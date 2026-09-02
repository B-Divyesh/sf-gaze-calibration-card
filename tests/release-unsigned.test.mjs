import { readFile } from "node:fs/promises";
import { execFile } from "node:child_process";
import { promisify } from "node:util";

const execFileAsync = promisify(execFile);
const [landing, readme] = await Promise.all([
  readFile("src/site/index.html", "utf8"),
  readFile("README.md", "utf8")
]);

const wording = "The Windows installers and macOS app bundles are unsigned.";
if (!landing.includes(wording) || !readme.includes(wording)) throw new Error("Unsigned-build guidance is missing or inconsistent.");

const { stdout } = await execFileAsync(process.execPath, ["tools/verify-release-signing.mjs"]);
const evidence = JSON.parse(stdout);
if (evidence.artifacts.length !== 4 || evidence.artifacts.some((artifact) => artifact.publisherSignature !== false)) {
  throw new Error("Published release signing evidence is incomplete.");
}
console.log(stdout.trim());
