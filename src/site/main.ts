declare const __BUILD_ID__: string;

if (new URLSearchParams(location.search).get("demo") === "1") location.replace("/demo/");

const RELEASE_API = "https://api.github.com/repos/B-Divyesh/sf-gaze-calibration-card/releases/latest";
const RELEASE_PAGE = "https://github.com/B-Divyesh/sf-gaze-calibration-card/releases";
const RELEASE_CACHE_KEY = "gaze-calibration-card:release:v1";
const CACHE_MAX_AGE = 60 * 60 * 1000;

interface Asset { url: string; sha256?: string; label?: string }
interface Manifest { version: string; assets: Record<string, Asset> }
interface GitHubRelease { tag_name: string; assets: Array<{ name: string; browser_download_url: string }> }
interface UserAgentData {
  platform?: string;
  getHighEntropyValues?: (hints: string[]) => Promise<{ architecture?: string }>;
}
interface PlatformChoice { key: string | null; label: string; command: string; isMac: boolean }

function assetKey(name: string): string | null {
  const lower = name.toLowerCase();
  if (lower.endsWith(".dmg") && lower.includes("aarch64")) return "macos-aarch64";
  if (lower.endsWith(".dmg") && (lower.includes("x64") || lower.includes("x86_64"))) return "macos-x86_64";
  if ((lower.endsWith(".exe") || lower.endsWith(".msi")) && (lower.includes("x64") || lower.includes("x86_64"))) return "windows-x86_64";
  if (lower.endsWith(".appimage") && (lower.includes("amd64") || lower.includes("x86_64"))) return "linux-x86_64";
  if (lower.endsWith(".deb") && (lower.includes("amd64") || lower.includes("x86_64"))) return "linux-deb-x86_64";
  return null;
}

function toManifest(release: GitHubRelease): Manifest {
  const assets: Record<string, Asset> = {};
  for (const asset of release.assets) {
    const key = assetKey(asset.name);
    if (key && !assets[key]) assets[key] = { url: asset.browser_download_url, label: asset.name };
  }
  return { version: release.tag_name.replace(/^v/, ""), assets };
}

async function platformChoice(): Promise<PlatformChoice> {
  const uaData = (navigator as Navigator & { userAgentData?: UserAgentData }).userAgentData;
  const platform = (uaData?.platform ?? navigator.platform).toLowerCase();
  if (platform.includes("win")) return { key: "windows-x86_64", label: "Download for Windows", command: "irm https://gaze-calibration-card.sociobot.in/install.ps1 | iex", isMac: false };
  if (platform.includes("mac")) {
    let architecture = "";
    try { architecture = (await uaData?.getHighEntropyValues?.(["architecture"]))?.architecture?.toLowerCase() ?? ""; } catch { /* Offer both Mac builds below. */ }
    const key = /arm|aarch/.test(architecture) ? "macos-aarch64" : /x86|x64/.test(architecture) ? "macos-x86_64" : null;
    return { key, label: key === "macos-aarch64" ? "Download for Mac (Apple silicon)" : key === "macos-x86_64" ? "Download for Mac (Intel)" : "Choose a Mac download", command: "curl -fsSL https://gaze-calibration-card.sociobot.in/install.sh | sh", isMac: true };
  }
  return { key: "linux-x86_64", label: "Download for Linux", command: "curl -fsSL https://gaze-calibration-card.sociobot.in/install.sh | sh", isMac: false };
}

function readCachedManifest(): Manifest | null {
  try {
    const cached = JSON.parse(localStorage.getItem(RELEASE_CACHE_KEY) ?? "null") as { savedAt: number; manifest: Manifest } | null;
    return cached && Date.now() - cached.savedAt < CACHE_MAX_AGE ? cached.manifest : null;
  } catch { return null; }
}

function cacheManifest(manifest: Manifest) {
  try { localStorage.setItem(RELEASE_CACHE_KEY, JSON.stringify({ savedAt: Date.now(), manifest })); } catch { /* Release discovery still works without storage. */ }
}

async function getManifest(): Promise<Manifest> {
  const cached = readCachedManifest();
  if (cached) return cached;
  if (!navigator.onLine) throw new Error("Offline");
  const response = await fetch(RELEASE_API, { headers: { Accept: "application/vnd.github+json" } });
  if (!response.ok) throw new Error("Release metadata unavailable");
  const manifest = toManifest(await response.json() as GitHubRelease);
  cacheManifest(manifest);
  return manifest;
}

async function setUpDownloads() {
  const choice = await platformChoice();
  const label = document.querySelector<HTMLElement>("#platform-label");
  const command = document.querySelector<HTMLElement>("#install-command");
  const status = document.querySelector<HTMLElement>("#download-status");
  const button = document.querySelector<HTMLAnchorElement>("#primary-download");
  const macOptions = document.querySelector<HTMLElement>("#mac-options");
  if (label) label.textContent = choice.label;
  if (command) command.textContent = choice.command;

  try {
    const manifest = await getManifest();
    const asset = choice.key ? manifest.assets[choice.key] : null;
    if (asset?.url && button) button.href = asset.url;
    if (choice.isMac && !choice.key && macOptions) {
      const arm = manifest.assets["macos-aarch64"]?.url;
      const intel = manifest.assets["macos-x86_64"]?.url;
      if (arm && intel) {
        macOptions.hidden = false;
        macOptions.innerHTML = `<span>Mac architecture could not be detected:</span><a href="${arm}">Apple silicon</a><a href="${intel}">Intel</a>`;
      }
    }
    if (!asset?.url && !choice.isMac) throw new Error("Matching build unavailable");
    if (status) status.textContent = `Version ${manifest.version} · a matching download is ready.`;
  } catch {
    if (button) button.href = RELEASE_PAGE;
    if (status) status.textContent = "Downloads are being published. Open the releases page to check again.";
  }
}

document.querySelector("#copy-command")?.addEventListener("click", async (event) => {
  const command = document.querySelector<HTMLElement>("#install-command")?.textContent ?? "";
  const status = document.querySelector<HTMLElement>("#download-status");
  try { await navigator.clipboard.writeText(command); (event.currentTarget as HTMLButtonElement).textContent = "Copied"; }
  catch { if (status) status.textContent = "Select and copy the install command shown above."; }
});

const build = document.querySelector<HTMLElement>("#build-id");
if (build) build.textContent = `Build ${__BUILD_ID__}`;
void setUpDownloads();
if ("serviceWorker" in navigator) window.addEventListener("load", () => navigator.serviceWorker.register("/sw.js").catch(() => undefined));
