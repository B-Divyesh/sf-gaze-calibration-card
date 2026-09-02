import { describe, expect, it } from "vitest";
import { readFile } from "node:fs/promises";

describe("test command", () => {
  it("builds the production site before Vitest starts @regression:cold-copy-audit", async () => {
    const packageJson = JSON.parse(await readFile("package.json", "utf8")) as { scripts?: Record<string, string> };
    const copyAudit = await readFile("tests/copy-audit.test.ts", "utf8");

    expect(packageJson.scripts?.pretest).toBe("node tools/build-site-for-test.mjs");
    expect(packageJson.scripts?.test).toBe("vitest run");
    expect(copyAudit).not.toMatch(/child_process|build:site|execFile/);
  });
});
