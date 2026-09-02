import { describe, expect, it } from "vitest";
import { readFile, readdir } from "node:fs/promises";
import { join } from "node:path";

function auditedLines(document: string, name: string): string[] {
  const match = document.match(new RegExp(`<!-- ${name}:start -->\\n([\\s\\S]*?)<!-- ${name}:end -->`));
  if (!match) throw new Error(`Missing ${name} section in copy audit`);
  return match[1].split("\n").filter((line) => line.startsWith("- ")).map((line) => line.slice(2));
}

async function filesBelow(directory: string): Promise<string[]> {
  const entries = await readdir(directory, { withFileTypes: true });
  const paths = await Promise.all(entries.map(async (entry) => entry.isDirectory()
    ? filesBelow(join(directory, entry.name))
    : [join(directory, entry.name)]));
  return paths.flat();
}

describe("copy audit", () => {
  it("matches current built visitor copy and declares only release and build values as dynamic", async () => {
    const audit = await readFile(".factory/copy-audit.md", "utf8");
    const landing = auditedLines(audit, "audit-landing");
    const readme = auditedLines(audit, "audit-readme");
    expect(landing.length).toBeGreaterThan(50);
    expect(readme.length).toBeGreaterThan(25);
    expect(audit).toContain("{release version}");
    expect(audit).toContain("{build id}");

    const output = (await Promise.all((await filesBelow("dist/site")).map((path) => readFile(path, "utf8").catch(() => "")))).join("\n");
    for (const copy of landing) expect(output, copy).toContain(copy);
    expect(output).toContain("Version ");
    expect(output).toContain(" · a matching download is ready.");
    expect(output).toContain("Build copy-audit-");

    const currentReadme = await readFile("README.md", "utf8");
    for (const copy of readme) expect(currentReadme, copy).toContain(copy);
  });
});
