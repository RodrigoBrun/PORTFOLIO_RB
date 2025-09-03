/* ============================================
   Navegación: smooth scroll + sidebar
============================================ */
(() => {
  const overlay = $('#overlay');
  const sidebar = $('#sidebar');
  $('#btn-menu')?.addEventListener('click', () => {
    sidebar?.setAttribute('aria-hidden','false'); overlay?.classList.add('show');
  });
  $('#btn-close')?.addEventListener('click', () => {
    sidebar?.setAttribute('aria-hidden','true'); overlay?.classList.remove('show');
  });
  overlay?.addEventListener('click', () => {
    sidebar?.setAttribute('aria-hidden','true'); overlay?.classList.remove('show');
  });

  function goTo(target){
    const el = document.getElementById(target);
    if(!el) return;
    el.scrollIntoView({behavior:'smooth',block:'start'});
    sidebar?.setAttribute('aria-hidden','true'); overlay?.classList.remove('show');
  }
  $$('.nav-link').forEach(a=> a.addEventListener('click',()=> goTo(a.dataset.target)));
  $$('.sidebar-link').forEach(a=> a.addEventListener('click',()=> goTo(a.dataset.target)));
})();