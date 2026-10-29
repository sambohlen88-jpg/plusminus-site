// data-pm-clock: Perth time (AWST), updates each minute.
const fmt = new Intl.DateTimeFormat('en-AU', {
  timeZone: 'Australia/Perth',
  hour: '2-digit',
  minute: '2-digit',
  hour12: false,
});

export function init(root) {
  const els = root.querySelectorAll('[data-pm-clock]');
  if (!els.length) return () => {};

  const tick = () => els.forEach((el) => (el.textContent = fmt.format(new Date())));
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
