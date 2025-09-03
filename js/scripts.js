/* ============================================
   Ajustes rápidos / helpers
============================================ */
const $ = (s,root=document)=>root.querySelector(s);
const $$ = (s,root=document)=>Array.from(root.querySelectorAll(s));


/* ============================================
   KPIs: contadores cuando aparecen
============================================ */
(() => {
  const nums = $$('.metric');
  if(!nums.length) return;
  const io = new IntersectionObserver((entries)=>{
    entries.forEach(e=>{
      if(!e.isIntersecting) return;
      const el = e.target; const to = parseInt(el.dataset.counter||'0',10);
      let n=0; const step=Math.max(1, Math.round(to/40));
      const id = setInterval(()=>{ n+=step; if(n>=to){ n=to; clearInterval(id);} el.textContent=n; }, 30);
      io.unobserve(el);
    });
  },{threshold:.3});
  nums.forEach(n=>io.observe(n));
})();


/* ============================================
   AOS
============================================ */
AOS.init({ once:true, duration:650, easing:'ease-out-cubic' });

/* ============================================
   CONFIGURADOR DE PRECIOS — tabs + suma + envíos
============================================ */
(() => {
  // 👉 EDITÁ TU CONTACTO:
  const WHATSAPP_NUMBER = '59899999999';      // sin + ni 0
  const EMAIL           = 'rodribru.dev@gmail.com';
  const HOSTING_ANUAL   = 120;

  // Refs
  const baseEl      = $('#basePrice');
  const totalEl     = $('#totalPrice');
  const extraCount  = $('#extraCount');
  const totalBarEl  = $('#totalBar');
  const countBarEl  = $('#countBar');
  const quoteBar    = $('#quoteBar');
  const btnGoSummary= $('#goSummary');
  const btnBarSum   = $('#barSummary');
  const btnWA       = $('#btnWA');
  const btnEmail    = $('#btnEmail');
  const panelFull   = $('#quoteBreakdownFull');

  const qName   = $('#qName');
  const qInd    = $('#qIndustry');
  const qDeadline = $('#qDeadline');
  const qChannel  = $('#qChannel');

  const money  = (n)=> Math.round(parseFloat(n||0)).toString();

  /* ----- Tabs ----- */
  function activateTab(key){
    $$('.pricing-pro .scope-tabs .tab').forEach(t=>{
      const active = t.dataset.tab===key;
      t.classList.toggle('is-active', active);
      t.setAttribute('aria-selected', active?'true':'false');
    });
    $$('.pricing-pro .panel').forEach(p=>{
      const active = p.dataset.panel===key;
      p.classList.toggle('is-active', active);
      p.setAttribute('aria-hidden', active?'false':'true');
    });

    const showBar = key!=='resumen' && matchMedia('(max-width:1099px)').matches;
    quoteBar?.classList.toggle('show', showBar);

    $('#precios')?.scrollIntoView({behavior:'smooth', block:'start'});
  }
  $$('.pricing-pro .tab').forEach(b => b.addEventListener('click',()=> activateTab(b.dataset.tab)));
  btnGoSummary?.addEventListener('click',()=> activateTab('resumen'));
  btnBarSum   ?.addEventListener('click',()=> activateTab('resumen'));

  /* ----- Leer ampliaciones ----- */
  function collectAddons(){
    const items = [];
    $$('.pricing-pro [data-panel="amplia"] .addon').forEach(card=>{
      const title = (card.querySelector('.addon-head strong')?.textContent||'Extra').trim();
      const qtySpan = card.querySelector('.qty[data-qty]');
      const unitEl  = card.querySelector('.unit b[data-usd]');
      const toggle  = card.querySelector('.addon-toggle');

      if(qtySpan && unitEl){
        const qty = parseInt(qtySpan.textContent||'0',10);
        const unit= parseInt(unitEl.dataset.usd||'0',10);
        if(qty>0) items.push({title, qty, unit, total: qty*unit, mode:'qty'});
      } else if(toggle){
        const unit= parseInt(toggle.dataset.usd||'0',10);
        if(toggle.checked) items.push({title, qty:1, unit, total:unit, mode:'toggle'});
      }
    });
    return items;
  }

  /* ----- Render ---- */
  function renderQuote(){
    const base  = parseInt(baseEl?.dataset.usd || baseEl?.textContent || '0', 10);
    const extras= collectAddons();
    const addSum= extras.reduce((s,a)=> s + a.total, 0);
    const total = base + addSum;

    totalEl.textContent   = money(total);
    extraCount.textContent= extras.length;
    totalBarEl.textContent= money(total);
    countBarEl.textContent= extras.length;

    // Breakdown completo
    panelFull.innerHTML = '';
    const liBase = document.createElement('li');
    liBase.innerHTML = `<span>Base</span><span>US$ ${money(base)}</span>`;
    panelFull.appendChild(liBase);

    if(extras.length){
      extras.forEach(a=>{
        const li = document.createElement('li');
        li.innerHTML = `<span>${a.title}${a.mode==='qty'?` × ${a.qty}`:''}</span><span>US$ ${money(a.total)}</span>`;
        panelFull.appendChild(li);
      });
      const liSub = document.createElement('li');
      liSub.className='muted';
      liSub.innerHTML = `<span>Subtotal ampliaciones</span><span>US$ ${money(addSum)}</span>`;
      panelFull.appendChild(liSub);
    }else{
      const liEmpty = document.createElement('li');
      liEmpty.className='muted';
      liEmpty.textContent='Sin ampliaciones seleccionadas.';
      panelFull.appendChild(liEmpty);
    }

    const liTotal = document.createElement('li');
    liTotal.innerHTML = `<strong>Total estimado</strong><strong>US$ ${money(total)}</strong>`;
    panelFull.appendChild(liTotal);

    const liHost = document.createElement('li');
    liHost.className='muted';
    liHost.innerHTML = `<span>*Hosting anual aparte</span><span>US$ ${HOSTING_ANUAL}</span>`;
    panelFull.appendChild(liHost);

    // Mensaje
    const lines = [];
    lines.push('Cotización — Landing (Paquete Base)');
    lines.push(`Precio base: US$ ${money(base)}`);
    if(extras.length){
      lines.push('Ampliaciones:');
      extras.forEach(a=> lines.push(`• ${a.title}${a.mode==='qty'?` × ${a.qty}`:''}: US$ ${money(a.total)}`));
      lines.push(`Subtotal ampliaciones: US$ ${money(addSum)}`);
    }
    lines.push(`Total estimado: US$ ${money(total)}`);
    lines.push(`*Hosting anual aparte: US$ ${HOSTING_ANUAL}*`);
    lines.push('');
    lines.push('Datos:');
    lines.push(`• Nombre/Marca: ${qName?.value||''}`);
    lines.push(`• Rubro: ${qInd?.value||''}`);
    lines.push(`• Plazo deseado: ${qDeadline?.value||''}`);
    lines.push(`• Prefiero: ${qChannel?.value||'WhatsApp'}`);
    const body = encodeURIComponent(lines.join('\n'));

    btnWA?.setAttribute('href', `https://wa.me/${WHATSAPP_NUMBER}?text=${body}`);
    btnEmail?.setAttribute('href', `mailto:${EMAIL}?subject=${encodeURIComponent('Cotización Landing — Rodrigo Brun')}&body=${body}`);
  }

  /* ----- Eventos ----- */
  function bindConfigurator(){
    $$('.pricing-pro .step').forEach(b=>{
      b.addEventListener('click', ()=>{
        const step = parseInt(b.dataset.step,10);
        const card = b.closest('.addon');
        const qtyEl= card.querySelector('.qty[data-qty]');
        let qty = parseInt(qtyEl.textContent||'0',10);
        qty = Math.max(0, Math.min(99, qty + step));
        qtyEl.textContent = qty;
        renderQuote();
      });
    });
    $$('.pricing-pro .addon-toggle').forEach(chk=> chk.addEventListener('change', renderQuote));
    [qName,qInd,qDeadline,qChannel].forEach(el=> el && el.addEventListener('input', renderQuote));

    // Barra flotante según tab y viewport
    const initialTab = $('.pricing-pro .tab.is-active')?.dataset.tab || 'incluye';
    const showBar = initialTab!=='resumen' && matchMedia('(max-width:1099px)').matches;
    quoteBar?.classList.toggle('show', showBar);

    renderQuote();
  }

  if (document.readyState !== 'loading') bindConfigurator();
  else document.addEventListener('DOMContentLoaded', bindConfigurator);
})();

/* ============================================
   Footer: año dinámico
============================================ */
(() => {
  const y = $('#year'); if(y) y.textContent = new Date().getFullYear();
})();
