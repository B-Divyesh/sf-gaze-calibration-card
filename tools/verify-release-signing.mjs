import { createHash } from "node:crypto";
import { execFile } from "node:child_process";
import { mkdir, mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { promisify } from "node:util";

const execFileAsync = promisify(execFile);
const releaseApi = "https://api.github.com/repos/B-Divyesh/sf-gaze-calibration-card/releases/latest";

function requireRange(buffer, offset, length, label) {
  if (offset < 0 || length < 0 || offset + length > buffer.length) {
    throw new Error(`${label} points outside the package.`);
  }
}

function assertUnsignedPortableExecutable(buffer, name) {
  if (buffer.subarray(0, 2).toString("ascii") !== "MZ") throw new Error(`${name} is not a Windows executable.`);
  requireRange(buffer, 0x3c, 4, `${name} DOS header`);
  const peOffset = buffer.readUInt32LE(0x3c);
  requireRange(buffer, peOffset, 24, `${name} PE header`);
  if (buffer.subarray(peOffset, peOffset + 4).toString("binary") !== "PE\0\0") throw new Error(`${name} has no PE header.`);
  const optionalHeader = peOffset + 24;
  const magic = buffer.readUInt16LE(optionalHeader);
  const dataDirectories = optionalHeader + (magic === 0x20b ? 112 : magic === 0x10b ? 96 : 0);
  if (dataDirectories === optionalHeader) throw new Error(`${name} has an unknown PE optional header.`);
  const certificateDirectory = dataDirectories + (4 * 8);
  requireRange(buffer, certificateDirectory, 8, `${name} certificate directory`);
  const certificateOffset = buffer.readUInt32LE(certificateDirectory);
  const certificateSize = buffer.readUInt32LE(certificateDirectory + 4);
  if (certificateOffset !== 0 || certificateSize !== 0) throw new Error(`${name} contains an Authenticode certificate.`);
}

function compoundFileDirectoryNames(buffer, name) {
  if (buffer.subarray(0, 8).toString("hex") !== "d0cf11e0a1b11ae1") throw new Error(`${name} is not an MSI compound file.`);
  const sectorSize = 2 ** buffer.readUInt16LE(30);
  const firstDirectorySector = buffer.readUInt32LE(48);
  const firstDifatSector = buffer.readUInt32LE(68);
  const difatSectorCount = buffer.readUInt32LE(72);
  const freeSector = 0xffffffff;
  const endOfChain = 0xfffffffe;
  const fatSectors = [];
  for (let index = 0; index < 109; index += 1) {
    const sector = buffer.readUInt32LE(76 + (index * 4));
    if (sector !== freeSector) fatSectors.push(sector);
  }
  let difatSector = firstDifatSector;
  for (let count = 0; count < difatSectorCount && difatSector !== endOfChain; count += 1) {
    const offset = (difatSector + 1) * sectorSize;
    requireRange(buffer, offset, sectorSize, `${name} DIFAT sector`);
    for (let index = 0; index < (sectorSize / 4) - 1; index += 1) {
      const sector = buffer.readUInt32LE(offset + (index * 4));
      if (sector !== freeSector) fatSectors.push(sector);
    }
    difatSector = buffer.readUInt32LE(offset + sectorSize - 4);
  }
  const fat = [];
  for (const sector of fatSectors) {
    const offset = (sector + 1) * sectorSize;
    requireRange(buffer, offset, sectorSize, `${name} FAT sector`);
    for (let index = 0; index < sectorSize; index += 4) fat.push(buffer.readUInt32LE(offset + index));
  }
  const directoryChunks = [];
  const visited = new Set();
  let sector = firstDirectorySector;
  while (sector !== endOfChain) {
    if (visited.has(sector) || sector >= fat.length) throw new Error(`${name} has an invalid directory chain.`);
    visited.add(sector);
    const offset = (sector + 1) * sectorSize;
    requireRange(buffer, offset, sectorSize, `${name} directory sector`);
    directoryChunks.push(buffer.subarray(offset, offset + sectorSize));
    sector = fat[sector];
  }
  const directory = Buffer.concat(directoryChunks);
  const names = [];
  for (let offset = 0; offset + 128 <= directory.length; offset += 128) {
    const nameLength = directory.readUInt16LE(offset + 64);
    if (nameLength >= 2 && nameLength <= 64) names.push(directory.subarray(offset, offset + nameLength - 2).toString("utf16le"));
  }
  return names;
}

function assertUnsignedMsi(buffer, name) {
  const names = compoundFileDirectoryNames(buffer, name);
  if (names.includes("\u0005DigitalSignature") || names.includes("\u0005MsiDigitalSignatureEx")) {
    throw new Error(`${name} contains an Authenticode signature stream.`);
  }
}

function assertUnsignedMachO(buffer, name) {
  requireRange(buffer, 0, 32, `${name} Mach-O header`);
  if (buffer.readUInt32LE(0) !== 0xfeedfacf) throw new Error(`${name} is not a thin 64-bit Mach-O executable.`);
  const commandCount = buffer.readUInt32LE(16);
  let offset = 32;
  let signature = null;
  for (let index = 0; index < commandCount; index += 1) {
    requireRange(buffer, offset, 8, `${name} load command`);
    const command = buffer.readUInt32LE(offset);
    const size = buffer.readUInt32LE(offset + 4);
    if (size < 8) throw new Error(`${name} has an invalid Mach-O load command.`);
    if (command === 0x1d) signature = { offset: buffer.readUInt32LE(offset + 8), size: buffer.readUInt32LE(offset + 12) };
    offset += size;
  }
  if (!signature) return "absent";
  requireRange(buffer, signature.offset, signature.size, `${name} embedded signature`);
  if (buffer.readUInt32BE(signature.offset) !== 0xfade0cc0) throw new Error(`${name} has an unknown signature container.`);
  const count = buffer.readUInt32BE(signature.offset + 8);
  let adHoc = false;
  for (let index = 0; index < count; index += 1) {
    const entry = signature.offset + 12 + (index * 8);
    requireRange(buffer, entry, 8, `${name} signature index`);
    const type = buffer.readUInt32BE(entry);
    const blob = signature.offset + buffer.readUInt32BE(entry + 4);
    requireRange(buffer, blob, 16, `${name} signature blob`);
    if (type === 0x10000) throw new Error(`${name} contains a CMS publisher signature.`);
    if (type === 0 && buffer.readUInt32BE(blob) === 0xfade0c02) adHoc = (buffer.readUInt32BE(blob + 12) & 0x2) !== 0;
  }
  if (!adHoc) throw new Error(`${name} has a non-ad-hoc code signature.`);
  return "ad-hoc";
}

async function download(asset, directory) {
  const response = await fetch(asset.browser_download_url, { headers: { "User-Agent": "gaze-calibration-card-claim-test" } });
  if (!response.ok) throw new Error(`Could not download ${asset.name}: HTTP ${response.status}`);
  const buffer = Buffer.from(await response.arrayBuffer());
  const digest = createHash("sha256").update(buffer).digest("hex");
  if (asset.digest && asset.digest !== `sha256:${digest}`) throw new Error(`${asset.name} does not match its published digest.`);
  const path = join(directory, asset.name);
  await writeFile(path, buffer);
  return { buffer, digest, path };
}

async function verifyMacAsset(asset, directory) {
  const downloaded = await download(asset, directory);
  const { stdout } = await execFileAsync("tar", ["-tzf", downloaded.path]);
  const entries = stdout.trim().split("\n");
  if (entries.some((entry) => entry.includes("/_CodeSignature/"))) throw new Error(`${asset.name} contains an app signature directory.`);
  const executableEntry = entries.find((entry) => entry.endsWith("/Contents/MacOS/gaze-calibration-card"));
  if (!executableEntry || executableEntry.startsWith("/") || executableEntry.includes("..")) throw new Error(`${asset.name} is missing its app executable.`);
  const extraction = join(directory, asset.name.replace(/\.tar\.gz$/, ""));
  await mkdir(extraction, { recursive: true });
  await execFileAsync("tar", ["-xzf", downloaded.path, "-C", extraction, executableEntry]);
  const signature = assertUnsignedMachO(await readFile(join(extraction, executableEntry)), asset.name);
  return { name: asset.name, sha256: downloaded.digest, publisherSignature: false, signature };
}

async function main() {
  const response = await fetch(releaseApi, { headers: { Accept: "application/vnd.github+json", "User-Agent": "gaze-calibration-card-claim-test" } });
  if (!response.ok) throw new Error(`Could not read the published release: HTTP ${response.status}`);
  const release = await response.json();
  const patterns = {
    windowsExe: /_x64-setup\.exe$/i,
    windowsMsi: /_x64_en-US\.msi$/i,
    macArm: /_aarch64\.app\.tar\.gz$/i,
    macIntel: /_x64\.app\.tar\.gz$/i
  };
  const assets = Object.fromEntries(Object.entries(patterns).map(([key, pattern]) => {
    const asset = release.assets.find((candidate) => pattern.test(candidate.name));
    if (!asset) throw new Error(`Published release ${release.tag_name} is missing ${key}.`);
    return [key, asset];
  }));
  const directory = await mkdtemp(join(tmpdir(), "gaze-signing-"));
  try {
    const windowsExe = await download(assets.windowsExe, directory);
    assertUnsignedPortableExecutable(windowsExe.buffer, assets.windowsExe.name);
    const windowsMsi = await download(assets.windowsMsi, directory);
    assertUnsignedMsi(windowsMsi.buffer, assets.windowsMsi.name);
    const mac = await Promise.all([verifyMacAsset(assets.macArm, directory), verifyMacAsset(assets.macIntel, directory)]);
    console.log(JSON.stringify({
      release: release.tag_name,
      artifacts: [
        { name: assets.windowsExe.name, sha256: windowsExe.digest, publisherSignature: false, signature: "NotSigned" },
        { name: assets.windowsMsi.name, sha256: windowsMsi.digest, publisherSignature: false, signature: "NotSigned" },
        ...mac
      ]
    }, null, 2));
  } finally {
    await rm(directory, { recursive: true, force: true });
  }
}

await main();
