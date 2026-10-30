// GSAP: use the copy Webflow loads when the site has one, otherwise load the
// pinned CDN build (same files as the gsap@3.13.0 npm package, checked by SRI).
// Plugins load on demand: loadGsap('SplitText', 'ScrollTrigger').
const CDN = 'https://cdn.jsdelivr.net/npm/gsap@3.13.0/dist/';
const FILES = {
  gsap: ['gsap.min.js', 'sha384-HOvlOYPIs/zjoIkWUGXkVmXsjr8GuZLV+Q+rcPwmJOVZVpvTSXQChiN4t9Euv9Vc'],
  SplitText: ['SplitText.min.js', 'sha384-xb96EMJeax+NLXMC88ZBa1xAeAW+kn+horHh/zFlbMLG2UPWhMJJSlv7fi57hS+Q'],
  ScrollTrigger: ['ScrollTrigger.min.js', 'sha384-P8VzCVnT9NBUkMrpcIZrJbA7EBjJvh/fJS6PmP+4nLIM284DtsImIv8D0fFjIkeh'],
  Flip: ['Flip.min.js', 'sha384-lg3+EgIwmxYq9YD4ix279pdUEasqmOS17fF+2mI/NEg6JHkawYaWYpJ6nKZenPOy'],
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

const loading = {};
const load = (name) => (loading[name] ??= window[name] ? Promise.resolve() : inject(FILES[name]));

export async function loadGsap(...plugins) {
  await load('gsap');
  await Promise.all(plugins.map(load));
  plugins.forEach((p) => window.gsap.registerPlugin(window[p]));
  return window.gsap;
}
