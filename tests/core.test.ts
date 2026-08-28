import { describe, expect, it } from "vitest";
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
