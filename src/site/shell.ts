declare const __BUILD_ID__: string;

const build = document.querySelector<HTMLElement>("#build-id");
if (build) build.textContent = `Build ${__BUILD_ID__}`;
