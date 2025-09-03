/* ============================================
   Preview en modal (proyectos + demo pricing)
============================================ */
(() => {
  const modal   = $('#previewModal');
  const iframe  = $('#previewFrame');
  const loader  = $('.iframe-loader');
  const openOut = $('#modalOpenSite');
  const close   = $('#modalClose');
  const overlay = $('#overlay');

  function open(url){
    modal?.setAttribute('aria-hidden','false');
    overlay?.classList.add('show');
    loader?.style?.removeProperty('display');
    iframe.src = url;
    openOut.href = url;
    iframe.onload = ()=> loader.style.display='none';
  }
  function hide(){
    modal?.setAttribute('aria-hidden','true');
    overlay?.classList.remove('show');
    iframe.src='';
  }
  $$('.btn-preview').forEach(b => b.addEventListener('click',()=> open(b.dataset.preview)));
  close?.addEventListener('click', hide);
  modal?.addEventListener('click',(e)=>{ if(e.target===modal) hide(); });
})();