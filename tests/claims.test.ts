import { describe, expect, it } from "vitest";
import { readFile } from "node:fs/promises";

interface Claim {
  id: string;
  claim: string;
  where: string;
  test: string;
  sandbox: string;
}

describe("claim registry", () => {
  it("maps every registered claim to exactly one runnable tagged test", async () => {
    const claims = JSON.parse(await readFile(".factory/claims.json", "utf8")) as Claim[];
    const suite = await readFile("tests/e2e/claims.spec.ts", "utf8");
    expect(new Set(claims.map(({ id }) => id)).size).toBe(claims.length);
    for (const claim of claims) {
      expect(claim.claim.trim()).not.toBe("");
      expect(claim.where.trim()).not.toBe("");
      expect(claim.sandbox.trim()).not.toBe("");
      expect(claim.test).toBe(`npm run test:claims -- --grep @claim:${claim.id}`);
      const occurrences = suite.match(new RegExp(`@claim:${claim.id}(?![a-z0-9-])`, "g")) ?? [];
      expect(occurrences, claim.id).toHaveLength(1);
    }
    const tags = [...suite.matchAll(/@claim:([a-z0-9-]+)/g)].map((match) => match[1]);
    expect(new Set(tags)).toEqual(new Set(claims.map(({ id }) => id)));
  });
});
