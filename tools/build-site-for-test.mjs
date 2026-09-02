import { execFileSync } from "node:child_process";

const npm = process.platform === "win32" ? "npm.cmd" : "npm";

// Keep the production build outside Vitest's per-test timeout while preserving
// a stable build identity for the copy-audit assertions on every OS.
execFileSync(npm, ["run", "build:site"], {
  env: { ...process.env, GITHUB_SHA: "copy-audit-build" },
  stdio: "inherit"
});
