/* ============================================
   Tema (oscuro/claro)
============================================ */
(() => {
  const html = document.documentElement;
  const key = 'rb-theme';
  const saved = localStorage.getItem(key);
  if(saved) html.setAttribute('data-theme', saved);

  function toggleTheme(){
    const next = html.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    html.setAttribute('data-theme', next);
    localStorage.setItem(key, next);
  }
  $('#btn-theme')?.addEventListener('click', toggleTheme);
  $('#btn-theme-mobile')?.addEventListener('click', toggleTheme);
})();