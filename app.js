/* ══════════════════════════════════
   CAFÉ ROBLE — app.js
   Render, Slider, Lightbox, Navigation
══════════════════════════════════ */

/* ═══════════════════════
   LOAD DATA
═══════════════════════ */
let DATA;
async function loadData() {
  try {
    const saved = localStorage.getItem('cafeRoble_v2');
    if (saved) {
      DATA = JSON.parse(saved);
    } else {
      const res = await fetch('data/menu-data.json');
      DATA = await res.json();
    }
  } catch(e) {
    console.error('Error cargando datos:', e);
    DATA = { negocio: {}, categorias: [] };
  }
}

/* ═══════════════════════
   ESCAPE HELPER
═══════════════════════ */
function e(s){ return String(s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#39;'); }

/* ═══════════════════════
   RENDER BANNERS
═══════════════════════ */
function renderBanners() {
  const n = DATA.negocio || {};
  document.querySelectorAll('.banner-name').forEach(el => el.textContent = n.nombre || 'Café Roble');
  document.querySelectorAll('.banner-sub').forEach(el => el.textContent = n.subtitulo || '');
  document.querySelectorAll('.banner-photo').forEach(el => {
    el.src = n.bannerImg || 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=200&q=80';
    el.alt = n.nombre || 'Café Roble';
  });
}

/* ═══════════════════════
   RENDER MENU
═══════════════════════ */
function renderMenu() {
  renderBanners();

  // Nav buttons
  const nav = document.getElementById('catNav');
  nav.innerHTML = '';
  DATA.categorias.forEach((cat, i) => {
    const b = document.createElement('button');
    b.className = 'cat-btn' + (i===0?' active':'');
    b.dataset.index = i;
    b.textContent = cat.label;
    b.addEventListener('click', () => goTo(i, true));
    nav.appendChild(b);
  });

  // Panels
  const track = document.getElementById('track');
  track.innerHTML = '';
  sliderReady = false;

  DATA.categorias.forEach((cat, ci) => {
    const panel = document.createElement('div');
    panel.className = 'slide-panel';

    const title = document.createElement('h2');
    title.className = 'sec-title';
    title.textContent = cat.label;
    panel.appendChild(title);

    const list = document.createElement('div');
    list.className = 'items-list';
    cat.productos.forEach((p, pi) => {
      const row = document.createElement('div');
      row.className = 'item-row';
      row.innerHTML = `
        <div class="item-thumb">
          <img src="${e(p.img)}" alt="${e(p.nombre)}" onerror="this.src='https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=200&q=80'">
          ${p.badge ? `<span class="badge">${e(p.badge)}</span>` : ''}
        </div>
        <div class="item-info">
          <p class="item-name">${e(p.nombre)}</p>
          <p class="item-desc">${e(p.desc)}</p>
        </div>
        <div class="item-right"><span class="price">${e(p.precio)}</span></div>`;
      row.querySelector('.item-thumb').addEventListener('click', () => lbProduct(ci, pi));
      list.appendChild(row);
    });
    panel.appendChild(list);

    // gallery
    if (cat.galeria && cat.galeria.fotos && cat.galeria.fotos.length) {
      const gal = document.createElement('div');
      gal.className = 'panel-gal';
      gal.innerHTML = `<p class="panel-gal-title">${e(cat.galeria.titulo||'')}</p>
        <div class="panel-gal-grid">${cat.galeria.fotos.map((f,fi) => `
          <div class="pgc" data-ci="${ci}" data-fi="${fi}">
            <div class="pgc-img"><img src="${e(f.img)}" alt="" onerror="this.src='https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=200&q=80'"></div>
            <span class="pgc-cap">${e(f.caption||'')}</span>
          </div>`).join('')}
        </div>`;
      gal.querySelectorAll('.pgc').forEach(c => {
        c.addEventListener('click', () => lbGal(+c.dataset.ci, +c.dataset.fi));
      });
      panel.appendChild(gal);
    }

    track.appendChild(panel);
  });

  currentCat = 0;
  initSlider();
}

/* ═══════════════════════
   RENDER INFO PAGE
═══════════════════════ */
function renderInfo() {
  const n = DATA.negocio || {};

  // Promo
  const promo = document.getElementById('promoBlock');
  if (promo) {
    promo.innerHTML = `
      <img class="promo-photo" src="${e(n.promoImg||'')}" alt="Promo" onerror="this.style.display='none'"/>
      <div class="promo-body">
        <span class="promo-tag">${e(n.promoTag||'')}</span>
        <p class="promo-title">${e(n.promoTitulo||'')}</p>
        <p class="promo-desc">${e(n.promoDesc||'')}</p>
        <span class="promo-price">${e(n.promoPrecio||'')}</span>
      </div>`;
  }

  // About
  const aboutImg = document.getElementById('aboutImg');
  if (aboutImg) aboutImg.src = n.aboutImg || '';
  const aboutBadge = document.getElementById('aboutBadge');
  if (aboutBadge) aboutBadge.textContent = n.aboutBadge || '';
  const aboutTitulo = document.getElementById('aboutTitulo');
  if (aboutTitulo) aboutTitulo.textContent = n.aboutTitulo || '';
  const aboutP1 = document.getElementById('aboutP1');
  if (aboutP1) aboutP1.textContent = n.aboutP1 || '';
  const aboutP2 = document.getElementById('aboutP2');
  if (aboutP2) aboutP2.textContent = n.aboutP2 || '';

  // Contact
  const contactBlock = document.getElementById('contactBlock');
  if (contactBlock) {
    contactBlock.innerHTML = `
      <div class="cc"><span class="ci">📍</span><div><p class="cl">Dirección</p><p class="cv">${e(n.direccion||'')}</p></div></div>
      <div class="cc"><span class="ci">📱</span><div><p class="cl">Teléfono</p><p class="cv">${e(n.telefono||'')}</p></div></div>
      <div class="cc"><span class="ci">✉️</span><div><p class="cl">Email</p><p class="cv">${e(n.email||'')}</p></div></div>
      <div class="cc"><span class="ci">📸</span><div><p class="cl">Instagram</p><p class="cv">${e(n.instagram||'')}</p></div></div>`;
  }

  // Horarios
  const horariosBlock = document.getElementById('horariosBlock');
  if (horariosBlock && n.horarios) {
    horariosBlock.innerHTML = n.horarios.map(h =>
      `<div class="hc"><p class="hd">${e(h.dias)}</p><p class="ht">${e(h.hora)}</p></div>`
    ).join('');
  }

  // Mapa
  const mapFrame = document.getElementById('mapFrame');
  if (mapFrame && n.mapsEmbed) mapFrame.src = n.mapsEmbed;
  const mapAddr = document.getElementById('mapAddr');
  if (mapAddr) mapAddr.innerHTML = `<strong>${e(n.nombre||'')}</strong>${e(n.direccion||'')}<br>Tel: ${e(n.telefono||'')}`;
  const mapLink = document.getElementById('mapLink');
  if (mapLink) mapLink.href = n.mapsLink || '#';

  // Footer
  document.querySelectorAll('.footer-main').forEach(el => el.textContent = n.footer || '');
  document.querySelectorAll('.footer-sub').forEach(el => el.textContent = n.footerSub || '');

  // Destacados
  const feat = document.getElementById('infoFeat');
  const gal  = document.getElementById('infoGal');
  if (feat) feat.innerHTML = '';
  if (gal) gal.innerHTML = '';

  const galAll = [];
  DATA.categorias.forEach(cat => {
    if (cat.productos[0] && feat) {
      const p = cat.productos[0];
      const card = document.createElement('div'); card.className = 'feat-card';
      card.innerHTML = `<div style="overflow:hidden"><img class="feat-img" src="${e(p.img)}" alt="${e(p.nombre)}" onerror="this.src='https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=200&q=80'"></div>
        <div class="feat-body"><p class="feat-name">${e(p.nombre)}</p><p class="feat-price">${e(p.precio)}</p></div>`;
      card.addEventListener('click', () => lbSingle(p.imgFull||p.img, p.nombre));
      feat.appendChild(card);
    }
    if (cat.galeria?.fotos?.[0]) galAll.push(cat.galeria.fotos[0]);
  });

  if (gal) {
    galAll.forEach((f,i) => {
      const img = document.createElement('img'); img.className='info-gal-img';
      img.src = f.imgFull||f.img; img.alt='';
      img.addEventListener('click', () => lbGallery(galAll.map(g=>({src:g.imgFull||g.img,cap:g.caption||''})),i));
      gal.appendChild(img);
    });
  }
}

/* ═══════════════════════
   LIGHTBOX
═══════════════════════ */
let _lbImgs=[], _lbIdx=0;
function lbProduct(ci,pi){ _lbImgs=DATA.categorias[ci].productos.map(p=>({src:p.imgFull||p.img||'',cap:p.nombre})); _lbIdx=pi; lbShow(); }
function lbGal(ci,fi){ _lbImgs=(DATA.categorias[ci].galeria?.fotos||[]).map(f=>({src:f.imgFull||f.img||'',cap:f.caption||''})); _lbIdx=fi; lbShow(); }
function lbSingle(src,cap){ _lbImgs=[{src,cap}]; _lbIdx=0; lbShow(); }
function lbGallery(imgs,idx){ _lbImgs=imgs; _lbIdx=idx; lbShow(); }
function lbShow(){
  const cur=_lbImgs[_lbIdx]||{};
  document.getElementById('lb-img').src=cur.src||'';
  document.getElementById('lb-cap').textContent=cur.cap||'';
  document.getElementById('lb-ctr').textContent=_lbImgs.length>1?(_lbIdx+1)+' / '+_lbImgs.length:'';
  document.getElementById('lb-prev').style.display=_lbImgs.length>1?'':'none';
  document.getElementById('lb-next').style.display=_lbImgs.length>1?'':'none';
  document.getElementById('lb').classList.add('open');
  document.body.style.overflow='hidden';
}
function lbClose(){ document.getElementById('lb').classList.remove('open'); document.body.style.overflow=''; }
function lbBg(ev){ if(ev.target===document.getElementById('lb')) lbClose(); }
function lbNav(d){ _lbIdx=(_lbIdx+d+_lbImgs.length)%_lbImgs.length; lbShow(); }
document.addEventListener('keydown',ev=>{
  if(!document.getElementById('lb').classList.contains('open')) return;
  if(ev.key==='Escape') lbClose();
  if(ev.key==='ArrowRight') lbNav(1);
  if(ev.key==='ArrowLeft') lbNav(-1);
});

/* ═══════════════════════
   PAGE NAVIGATION
═══════════════════════ */
function goPage(name){
  document.querySelectorAll('.page').forEach(p=>p.classList.remove('active'));
  document.getElementById('page-'+name).classList.add('active');
  window.scrollTo(0,0);
  document.getElementById('adminBtn').style.display = name==='admin' ? 'none' : '';
}
function goAdmin(){ goPage('admin'); buildAdmin(); }

/* ═══════════════════════
   SLIDER
═══════════════════════ */
let currentCat=0, sliderReady=false, dragging=false, startX=0, dragDelta=0;
function getPanels(){ return Array.from(document.querySelectorAll('.slide-panel')); }
function getCatBtns(){ return Array.from(document.querySelectorAll('.cat-btn')); }
function initSlider(){
  if(sliderReady) return;
  sliderReady=true;
  const ps=getPanels();
  ps.forEach(p=>{ p.style.position='absolute'; p.style.top='0'; p.style.left='0'; });
  layout(0); syncH(false);
}
function layout(delta){
  const vw=document.getElementById('viewport').offsetWidth;
  getPanels().forEach((p,i)=>{ p.style.transform=`translateX(${(i-currentCat)*vw+delta}px)`; });
}
function syncH(anim){
  const ps=getPanels(); if(!ps[currentCat]) return;
  const t=document.getElementById('track');
  t.style.transition=anim?'height .35s cubic-bezier(.25,.46,.45,.94)':'none';
  t.style.height=ps[currentCat].scrollHeight+'px';
}
function goTo(idx,anim){
  const ps=getPanels(), bs=getCatBtns(), TOTAL=ps.length;
  idx=Math.max(0,Math.min(TOTAL-1,idx)); currentCat=idx;
  ps.forEach(p=>{ p.style.transition=anim?'transform .35s cubic-bezier(.25,.46,.45,.94)':'none'; });
  layout(0); syncH(anim);
  bs.forEach((b,i)=>b.classList.toggle('active',i===idx));
  const btn=bs[idx], nav=document.getElementById('catNav');
  if(btn&&nav) nav.scrollTo({left:Math.max(0,(btn.offsetLeft-52)-(nav.offsetWidth/2-btn.offsetWidth/2)),behavior:'smooth'});
  document.getElementById('swipeHint').classList.add('hidden');
}

const vp=document.getElementById('viewport');
function gX(ev){ return ev.touches?ev.touches[0].clientX:ev.clientX; }
function onS(ev){
  if(ev.target.closest('.item-thumb,.pgc,.pgc-img')) return;
  dragging=true; startX=gX(ev); dragDelta=0;
  getPanels().forEach(p=>p.style.transition='none');
  document.getElementById('track').style.transition='none';
  vp.classList.add('grabbing');
}
function onM(ev){ if(!dragging) return; dragDelta=gX(ev)-startX; layout(dragDelta); }
function onE(){
  if(!dragging) return; dragging=false; vp.classList.remove('grabbing');
  const thr=vp.offsetWidth*.2, TOTAL=getPanels().length;
  if(dragDelta<-thr&&currentCat<TOTAL-1) goTo(currentCat+1,true);
  else if(dragDelta>thr&&currentCat>0)   goTo(currentCat-1,true);
  else                                    goTo(currentCat,true);
}
vp.addEventListener('mousedown',onS);
window.addEventListener('mousemove',onM);
window.addEventListener('mouseup',onE);
vp.addEventListener('touchstart',onS,{passive:true});
vp.addEventListener('touchmove',onM,{passive:true});
vp.addEventListener('touchend',onE);
window.addEventListener('resize',()=>{ if(sliderReady){layout(0);syncH(false);} });

/* ═══════════════════════
   TOAST
═══════════════════════ */
function toast(msg,type=''){
  const t=document.getElementById('toast');
  t.textContent=msg; t.className=type; t.classList.add('show');
  clearTimeout(t._t); t._t=setTimeout(()=>t.classList.remove('show'),2600);
}

/* ═══════════════════════
   BOOT
═══════════════════════ */
document.addEventListener('DOMContentLoaded', async () => {
  await loadData();
  renderMenu();
  renderInfo();
});
