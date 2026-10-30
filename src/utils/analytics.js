// GA4 events. Sends through gtag when the site has it, otherwise queues on
// dataLayer so a later GA4/GTM install picks them up. Never throws.
export function track(name, params = {}) {
  try {
    if (typeof window.gtag === 'function') window.gtag('event', name, params);
    else (window.dataLayer = window.dataLayer || []).push({ event: name, ...params });
  } catch (err) {
    console.warn('[pm] analytics', err);
  }
}
