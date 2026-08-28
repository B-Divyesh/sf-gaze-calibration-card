export type InputMode = "gaze-pointer" | "pointer" | "keyboard";

export interface PointSample {
  x: number;
  y: number;
  time: number;
}

export interface TargetReading {
  targetX: number;
  targetY: number;
  samples: PointSample[];
  keyboard?: boolean;
}

export interface Metrics {
  meanError: number;
  horizontalDrift: number;
  verticalDrift: number;
  dwellReliability: number;
  sampleCount: number;
  verdict: "reliable" | "borderline" | "unreliable" | "practice";
}

export const targetPositions = [
  [12, 16], [50, 16], [88, 16],
  [12, 50], [50, 50], [88, 50],
  [12, 84], [50, 84], [88, 84]
] as const;

export function calculateMetrics(readings: TargetReading[], mode: InputMode): Metrics {
  if (mode === "keyboard") {
    return { meanError: 0, horizontalDrift: 0, verticalDrift: 0, dwellReliability: 100, sampleCount: 9, verdict: "practice" };
  }

  const allErrors: number[] = [];
  const dxs: number[] = [];
  const dys: number[] = [];
  let inside = 0;
  let sampleCount = 0;

  readings.forEach((reading) => {
    reading.samples.forEach((sample) => {
      const dx = sample.x - reading.targetX;
      const dy = sample.y - reading.targetY;
      const distance = Math.hypot(dx, dy);
      allErrors.push(distance);
      dxs.push(dx);
      dys.push(dy);
      sampleCount += 1;
      if (distance <= 88) inside += 1;
    });
  });

  if (!sampleCount) {
    return { meanError: 999, horizontalDrift: 0, verticalDrift: 0, dwellReliability: 0, sampleCount: 0, verdict: "unreliable" };
  }

  const average = (items: number[]) => items.reduce((sum, item) => sum + item, 0) / items.length;
  const meanError = average(allErrors);
  const dwellReliability = (inside / sampleCount) * 100;
  let verdict: Metrics["verdict"] = "unreliable";
  if (meanError <= 80 && dwellReliability >= 75) verdict = "reliable";
  else if (meanError <= 125 && dwellReliability >= 55) verdict = "borderline";

  return {
    meanError,
    horizontalDrift: average(dxs),
    verticalDrift: average(dys),
    dwellReliability,
    sampleCount,
    verdict
  };
}

export function describeDrift(horizontal: number, vertical: number): string {
  if (Math.hypot(horizontal, vertical) < 16) return "No consistent directional drift";
  const verticalWord = vertical < -12 ? "up" : vertical > 12 ? "down" : "";
  const horizontalWord = horizontal < -12 ? "left" : horizontal > 12 ? "right" : "";
  return `Drifts ${[verticalWord, horizontalWord].filter(Boolean).join(" and ")}`;
}

export function escapeHtml(value: string): string {
  return value.replace(/[&<>'"]/g, (character) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;"
  })[character] ?? character);
}

export function formatDate(iso: string): string {
  return new Intl.DateTimeFormat(undefined, { dateStyle: "medium", timeStyle: "short" }).format(new Date(iso));
}
