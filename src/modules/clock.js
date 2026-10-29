// data-pm-clock: Perth time (AWST) as "12:45pm", updates each minute.
const fmt = new Intl.DateTimeFormat('en-AU', {
  timeZone: 'Australia/Perth',
  hour: 'numeric',
  minute: '2-digit',
  hour12: true,
});
const perthTime = () => fmt.format(new Date()).replace(/\s/g, '').toLowerCase();

export function init(root) {
  const els = root.querySelectorAll('[data-pm-clock]');
  if (!els.length) return () => {};

  const tick = () => els.forEach((el) => (el.textContent = perthTime()));
  tick();
  let interval;
  // Align to the next minute boundary, then tick every 60s.
  const timeout = setTimeout(() => {
    tick();
    interval = setInterval(tick, 60_000);
  }, 60_000 - (Date.now() % 60_000));

  return () => {
    clearTimeout(timeout);
    clearInterval(interval);
  };
}
