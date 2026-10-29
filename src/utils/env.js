// Environment checks shared by every module.

export const reducedMotion = () =>
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export const isTouch = () => window.matchMedia('(hover: none)').matches;

// Custom code must never run inside the Webflow Designer or Editor.
export function inWebflowEditor() {
  const html = document.documentElement;
  return (
    window.self !== window.top ||                 // Designer canvas iframe
    html.classList.contains('w-editor') ||        // Editor mode
    new URLSearchParams(location.search).has('edit') ||
    !!document.querySelector('.w-editor-bem-EditorOverlay')
  );
}
