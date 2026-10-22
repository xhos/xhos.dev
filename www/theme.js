const root = document.documentElement;
const btn = document.querySelector('button.theme');
const system = matchMedia('(prefers-color-scheme: dark)');

const dark = () => (root.dataset.theme ?? (system.matches ? 'dark' : 'light')) === 'dark';
const label = () => (btn.textContent = dark() ? 'switch to day' : 'switch to night');

try {
  const saved = localStorage.getItem('theme');
  if (saved === 'light' || saved === 'dark') root.dataset.theme = saved;
} catch {}

if (btn) {
  label();
  btn.hidden = false;
  btn.addEventListener('click', () => {
    root.dataset.theme = dark() ? 'light' : 'dark';
    try {
      localStorage.setItem('theme', root.dataset.theme);
    } catch {}
    label();
  });
  system.addEventListener('change', label);
}
