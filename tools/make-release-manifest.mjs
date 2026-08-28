import { createHash } from "node:crypto";
import { readdir, readFile, writeFile } from "node:fs/promises";
import { basename, join } from "node:path";

const [directory, version, repository] = process.argv.slice(2);
if (!directory || !version || !repository) throw new Error("Usage: node make-release-manifest.mjs <directory> <version> <owner/repo>");
const files = (await readdir(directory)).filter((name) => !["SHA256SUMS", "latest.json"].includes(name));
const checksum = async (name) => createHash("sha256").update(await readFile(join(directory, name))).digest("hex");
const url = (name) => `https://github.com/${repository}/releases/download/v${version}/${encodeURIComponent(name).replaceAll("%2F", "/")}`;
const find = (...patterns) => files.find((name) => patterns.every((pattern) => pattern.test(name)));
const choices = {
  "macos-aarch64": find(/aarch64|arm64/i, /\.dmg$/i),
  "macos-x86_64": find(/x64|x86_64/i, /\.dmg$/i),
  "windows-x86_64": find(/x64|x86_64/i, /setup\.exe$|\.msi$/i),
  "linux-x86_64": find(/amd64|x86_64/i, /\.AppImage$/i),
  "linux-deb-x86_64": find(/amd64|x86_64/i, /\.deb$/i)
};
const assets = {};
for (const [platform, filename] of Object.entries(choices)) {
  if (!filename) throw new Error(`Could not find release asset for ${platform}. Found: ${files.join(", ")}`);
  assets[platform] = { url: url(filename), sha256: await checksum(filename), filename: basename(filename) };
}
await writeFile(join(directory, "latest.json"), `${JSON.stringify({ version, published_at: new Date().toISOString(), assets }, null, 2)}\n`);
