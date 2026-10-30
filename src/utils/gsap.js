// GSAP: use the copy Webflow loads when the site has one, otherwise load the
// pinned CDN build (same files as the gsap@3.13.0 npm package, checked by SRI).
const CDN = 'https://cdn.jsdelivr.net/npm/gsap@3.13.0/dist/';
const FILES = {
  gsap: ['gsap.min.js', 'sha384-HOvlOYPIs/zjoIkWUGXkVmXsjr8GuZLV+Q+rcPwmJOVZVpvTSXQChiN4t9Euv9Vc'],
  SplitText: ['SplitText.min.js', 'sha384-xb96EMJeax+NLXMC88ZBa1xAeAW+kn+horHh/zFlbMLG2UPWhMJJSlv7fi57hS+Q'],
};

function inject([file, integrity]) {
  return new Promise((resolve, reject) => {
    const s = document.createElement('script');
    s.src = CDN + file;
    s.integrity = integrity;
    s.crossOrigin = 'anonymous';
    s.onload = resolve;
    s.onerror = () => reject(new Error(`[pm] failed to load ${file}`));
    document.head.appendChild(s);
  });
}

let ready;
export function loadGsap() {
  ready ??= (async () => {
    if (!window.gsap) await inject(FILES.gsap);
    if (!window.SplitText) await inject(FILES.SplitText);
    window.gsap.registerPlugin(window.SplitText);
    return window.gsap;
  })();
  return ready;
}
