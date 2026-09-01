import { describe, expect, it } from "vitest";
import { readFile } from "node:fs/promises";
import { calculateMetrics, describeDrift, escapeHtml, type TargetReading } from "../src/app/core";

function reading(targetX: number, targetY: number, dx = 0, dy = 0): TargetReading {
  return { targetX, targetY, samples: Array.from({ length: 10 }, (_, time) => ({ x: targetX + dx, y: targetY + dy, time })) };
}

describe("calibration scoring", () => {
  it("classifies a steady, close gaze pointer as reliable", () => {
    const result = calculateMetrics(Array.from({ length: 9 }, () => reading(100, 100, 24, -12)), "gaze-pointer");
    expect(result.verdict).toBe("reliable");
    expect(result.dwellReliability).toBe(100);
    expect(Math.round(result.meanError)).toBe(27);
  });

  it("classifies moderate misses as borderline", () => {
    const result = calculateMetrics(Array.from({ length: 9 }, () => reading(100, 100, 70, 45)), "gaze-pointer");
    expect(result.verdict).toBe("borderline");
  });

  it("reports missing pointer samples as unreliable", () => {
    const result = calculateMetrics([{ targetX: 10, targetY: 10, samples: [] }], "gaze-pointer");
    expect(result.verdict).toBe("unreliable");
    expect(result.sampleCount).toBe(0);
  });

  it("does not present keyboard practice as a gaze result", () => {
    expect(calculateMetrics([], "keyboard").verdict).toBe("practice");
  });
});

describe("supporting language and export safety", () => {
  it("describes directional drift", () => {
    expect(describeDrift(25, -30)).toBe("Drifts up and right");
    expect(describeDrift(5, 5)).toBe("No consistent directional drift");
  });

  it("escapes user-entered setup notes", () => {
    expect(escapeHtml(`<script>alert("x")</script>`)).toBe("&lt;script&gt;alert(&quot;x&quot;)&lt;/script&gt;");
  });
});

describe("desktop release packaging", () => {
  it("pins the Ubuntu GTK compatibility path required by the AppImage helper", async () => {
    const workflow = await readFile(".github/workflows/release.yml", "utf8");
    expect(workflow).toContain("platform: ubuntu-24.04");
    expect(workflow).toContain("libfuse2t64");
    expect(workflow).toContain("libgtk-3-0t64/gtk-query-immodules-3.0");
    expect(workflow).toContain('APPIMAGE_EXTRACT_AND_RUN: "1"');
    expect(workflow).toContain("tauri-apps/tauri-action@1deb371b0cd8bd54025b384f1cd735e725c4060f");
  });
});
