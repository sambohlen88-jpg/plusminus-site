// Form submit events for GA4: every Webflow form sends `generate_lead` with its
// name ("Free Website Review", "Price builder quote", ...).
import { track } from '../utils/analytics.js';

export function init() {
  const onSubmit = (e) => {
    const form = e.target;
    if (!(form instanceof HTMLFormElement)) return;
    track('generate_lead', { form_name: form.dataset.name || form.getAttribute('name') || 'form' });
  };
  document.addEventListener('submit', onSubmit, true);
  return () => document.removeEventListener('submit', onSubmit, true);
}
