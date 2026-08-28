const releaseApiUrl = "https://api.github.com/repos/B-Divyesh/sf-gaze-calibration-card/releases?per_page=1";
interface Asset { url: string; sha256?: string; label?: string }
interface Manifest { version: string; assets: Record<string, Asset> }
function platformKey(): { key: string; label: string; command: string } {
  const platform = ((navigator as Navigator & { userAgentData?: { platform?: string } }).userAgentData?.platform ?? navigator.platform).toLowerCase();
  const arm = /arm|aarch/.test(platform) || /arm|aarch/.test(navigator.userAgent.toLowerCase());
  if (platform.includes("win")) return { key: "windows-x86_64", label: "Download for Windows", command: "irm https://gaze-calibration-card.sociobot.in/install.ps1 | iex" };
  if (platform.includes("mac")) return { key: arm ? "macos-aarch64" : "macos-x86_64", label: `Download for Mac${arm ? " (Apple silicon)" : " (Intel)"}`, command: "curl -fsSL https://gaze-calibration-card.sociobot.in/install.sh | sh" };
  return { key: "linux-x86_64", label: "Download for Linux", command: "curl -fsSL https://gaze-calibration-card.sociobot.in/install.sh | sh" };
}
const detected = platformKey();
const label = document.querySelector<HTMLElement>("#platform-label");
const command = document.querySelector<HTMLElement>("#install-command");
const status = document.querySelector<HTMLElement>("#download-status");
const buttons = [document.querySelector<HTMLAnchorElement>("#primary-download"), document.querySelector<HTMLAnchorElement>("#secondary-download")].filter(Boolean) as HTMLAnchorElement[];
if (label) label.textContent = detected.label;
if (command) command.textContent = detected.command;
fetch(releaseApiUrl, { headers: { Accept: "application/vnd.github+json" } })
  .then((response) => { if (!response.ok) throw new Error("Release unavailable"); return response.json() as Promise<Array<{ assets: Array<{ name: string; browser_download_url: string }> }>>; })
  .then((releases) => { const manifestAsset = releases[0]?.assets.find((asset) => asset.name === "latest.json"); if (!manifestAsset) throw new Error("Release manifest unavailable"); return fetch(manifestAsset.browser_download_url); })
  .then((response) => { if (!response.ok) throw new Error("Release manifest unavailable"); return response.json() as Promise<Manifest>; })
  .then((manifest) => { const asset = manifest.assets[detected.key]; if (!asset?.url) throw new Error("No matching release asset"); buttons.forEach((button) => { button.href = asset.url; }); if (status) status.textContent = `Version ${manifest.version} · Free and open source · no telemetry`; })
  .catch(() => { if (status) status.textContent = "Release details unavailable — open the releases page to choose a download."; });
document.querySelector("#copy-command")?.addEventListener("click", async (event) => { try { await navigator.clipboard.writeText(detected.command); (event.currentTarget as HTMLButtonElement).textContent = "Copied"; } catch { if (status) status.textContent = "Select and copy the install command shown above."; } });
if ("serviceWorker" in navigator) window.addEventListener("load", () => navigator.serviceWorker.register("/sw.js").catch(() => undefined));
