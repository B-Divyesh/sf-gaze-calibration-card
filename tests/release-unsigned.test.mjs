import { readFile } from "node:fs/promises";

const [landing, readme, workflow] = await Promise.all([
  readFile("src/site/index.html", "utf8"),
  readFile("README.md", "utf8"),
  readFile(".github/workflows/release.yml", "utf8")
]);

const wording = "macOS and Windows builds are unsigned. Your system may ask you to confirm the publisher.";
if (!landing.includes(wording) || !readme.includes(wording)) throw new Error("Unsigned-build guidance is missing or inconsistent.");
if (!workflow.includes("Verify unsigned desktop packages") || !workflow.includes("NotSigned") || !workflow.includes("Authority=Developer ID")) {
  throw new Error("The release workflow does not verify unsigned Windows and macOS artifacts.");
}
console.log("Unsigned-build guidance and release-artifact verification are present.");
