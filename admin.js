/* ══════════════════════════════════
   CAFÉ ROBLE — admin.js
   Panel de Administración Completo
══════════════════════════════════ */

let admTab = 0;
let admSection = 'menu'; // 'menu' | 'negocio' | 'categorias'

/* ═══════════════════════
   BUILD ADMIN
═══════════════════════ */
function buildAdmin() {
  // Section nav
  document.querySelectorAll('.asec-btn').forEach(b => {
    b.classList.toggle('active', b.dataset.sec === admSection);
  });
  document.querySelectorAll('.adm-section').forEach(s => {
    s.classList.toggle('active', s.id === 'adm-sec-' + admSection);
  });

  if (admSection === 'menu') buildMenuSection();
  if (admSection === 'negocio') buildNegocioSection();
  if (admSection === 'categorias') buildCategoriasSection();
}

function switchSection(sec) {
  admSection = sec;
  buildAdmin();
}

/* ════════════════════════════════
   SECCIÓN: MENÚ (productos + galería)
════════════════════════════════ */
function buildMenuSection() {
  const tabs = document.getElementById('admTabs');
  tabs.innerHTML = '';

  DATA.categorias.forEach((cat, i) => {
    const b = document.createElement('button');
    b.className = 'atab' + (i === admTab ? ' active' : '');
    b.textContent = cat.label;
    b.onclick = () => { admTab = i; buildAdmin(); };
    tabs.appendChild(b);
  });

  if (admTab >= DATA.categorias.length) admTab = 0;
  renderAdmTab(admTab);
}

function renderAdmTab(ci) {
  const cat = DATA.categorias[ci];
  if (!cat) return;
  const content = document.getElementById('admContent');
  content.innerHTML = '';

  /* ── PRODUCTOS ── */
  const pc = document.createElement('div'); pc.className = 'acard';
  const ph = document.createElement('div'); ph.className = 'acard-head';
  ph.innerHTML = `<span>🛍 Productos — ${e(cat.label)}</span>`;
  const addP = document.createElement('button');
  addP.className = 'ab ab-blue'; addP.textContent = '+ Producto';
  addP.onclick = () => {
    cat.productos.push({ nombre: 'Nuevo producto', desc: 'Descripción del producto.', precio: '$0.00', badge: '', img: '', imgFull: '' });
    renderAdmTab(ci);
  };
  ph.appendChild(addP); pc.appendChild(ph);

  cat.productos.forEach((p, pi) => {
    const row = document.createElement('div'); row.className = 'prow';

    const th = document.createElement('div'); th.className = 'athumb';
    th.innerHTML = `<img src="${e(p.img || 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=200&q=80')}" onerror="this.src='https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=200&q=80'" alt=""><div class="athumb-ov">📷</div>`;
    th.onclick = () => admUploadProd(ci, pi, th.querySelector('img'));
    row.appendChild(th);

    const pf = document.createElement('div'); pf.className = 'pfields';
    pf.innerHTML = `
      <div class="afw"><label class="albl">Nombre</label><input class="ainp" value="${e(p.nombre)}" oninput="DATA.categorias[${ci}].productos[${pi}].nombre=this.value"></div>
      <div class="afw"><label class="albl">Precio</label><input class="ainp" value="${e(p.precio)}" oninput="DATA.categorias[${ci}].productos[${pi}].precio=this.value"></div>
      <div class="afw pf-full"><label class="albl">Descripción</label><input class="ainp" value="${e(p.desc)}" oninput="DATA.categorias[${ci}].productos[${pi}].desc=this.value"></div>
      <div class="afw"><label class="albl">Badge (ej: Nuevo, Popular)</label><input class="ainp" value="${e(p.badge||'')}" oninput="DATA.categorias[${ci}].productos[${pi}].badge=this.value"></div>
      <div class="afw"><label class="albl">URL de imagen</label><input class="ainp" value="${e(p.img||'')}" oninput="DATA.categorias[${ci}].productos[${pi}].img=this.value;DATA.categorias[${ci}].productos[${pi}].imgFull=this.value;this.closest('.prow').querySelector('img').src=this.value||'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=200&q=80'"></div>`;
    row.appendChild(pf);

    const del = document.createElement('div'); del.className = 'adel'; del.textContent = '✕';
    del.title = 'Eliminar producto';
    del.onclick = () => { if (confirm('¿Eliminar este producto?')) { cat.productos.splice(pi, 1); renderAdmTab(ci); } };
    row.appendChild(del);
    pc.appendChild(row);
  });
  content.appendChild(pc);

  /* ── GALERÍA ── */
  const gc = document.createElement('div'); gc.className = 'acard';
  const gh = document.createElement('div'); gh.className = 'acard-head';
  gh.innerHTML = `<span>🖼 Galería — ${e(cat.label)}</span>`;
  const addG = document.createElement('button');
  addG.className = 'ab ab-blue'; addG.textContent = '+ Fotos';
  addG.onclick = () => admUploadGalMulti(ci);
  gh.appendChild(addG); gc.appendChild(gh);

  if (!cat.galeria) cat.galeria = { titulo: '', fotos: [] };

  const gti = document.createElement('div');
  gti.innerHTML = `<label class="albl" style="margin-bottom:3px;display:block">Título de la galería</label>
    <input class="gtinp" value="${e(cat.galeria.titulo||'')}" oninput="DATA.categorias[${ci}].galeria.titulo=this.value">`;
  gc.appendChild(gti);

  const gg = document.createElement('div'); gg.className = 'ggrid';
  (cat.galeria.fotos || []).forEach((f, fi) => {
    const wrap = document.createElement('div');
    const cell = document.createElement('div'); cell.className = 'gcell';
    cell.innerHTML = `<img src="${e(f.img)}" onerror="this.src='https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=200&q=80'" alt="">
      <div class="gcell-ov">
        <button class="gov" onclick="admUploadGalAt(${ci},${fi},this.closest('.gcell').querySelector('img'))">📷</button>
        <button class="gov" style="background:rgba(220,38,38,.5)" onclick="if(confirm('¿Eliminar foto?')){DATA.categorias[${ci}].galeria.fotos.splice(${fi},1);renderAdmTab(${ci})}">✕</button>
      </div>`;
    const cap = document.createElement('input'); cap.className = 'capinp';
    cap.placeholder = 'Texto de la foto…'; cap.value = f.caption || '';
    cap.oninput = () => { DATA.categorias[ci].galeria.fotos[fi].caption = cap.value; };
    wrap.appendChild(cell); wrap.appendChild(cap);
    gg.appendChild(wrap);
  });
  gc.appendChild(gg);
  content.appendChild(gc);
}

/* ════════════════════════════════
   SECCIÓN: DATOS DEL NEGOCIO
════════════════════════════════ */
function buildNegocioSection() {
  const n = DATA.negocio || {};
  const wrap = document.getElementById('adm-negocio-content');
  if (!wrap) return;
  wrap.innerHTML = '';

  /* ── BANNER ── */
  const bannerCard = makeCard('🏷 Banner del negocio');
  bannerCard.innerHTML += `
    <div class="banner-preview" id="bannerPreview">
      <img class="bp-img" id="bpImg" src="${e(n.bannerImg||'')}" alt="" onerror="this.style.opacity='.3'">
      <div class="bp-body">
        <div class="bp-name" id="bpName">${e(n.nombre||'')}</div>
        <div class="bp-sub" id="bpSub">${e(n.subtitulo||'')}</div>
      </div>
    </div>
    <div class="info-grid">
      <div class="afw pf-full">
        <label class="albl">Nombre del negocio</label>
        <input class="ainp" id="inp-nombre" value="${e(n.nombre||'')}" oninput="DATA.negocio.nombre=this.value;document.getElementById('bpName').textContent=this.value">
      </div>
      <div class="afw pf-full">
        <label class="albl">Subtítulo del banner</label>
        <input class="ainp" id="inp-subtitulo" value="${e(n.subtitulo||'')}" oninput="DATA.negocio.subtitulo=this.value;document.getElementById('bpSub').textContent=this.value">
      </div>
      <div class="afw pf-full">
        <label class="albl">URL imagen del banner</label>
        <input class="ainp" value="${e(n.bannerImg||'')}" oninput="DATA.negocio.bannerImg=this.value;document.getElementById('bpImg').src=this.value">
      </div>
      <div class="afw" style="grid-column:1/-1">
        <button class="ab ab-blue" style="width:fit-content" onclick="admUploadBanner()">📷 Subir imagen de banner</button>
      </div>
    </div>`;
  wrap.appendChild(bannerCard);

  /* ── CONTACTO ── */
  const contactCard = makeCard('📞 Contacto e información');
  contactCard.innerHTML += `
    <div class="info-grid">
      <div class="afw pf-full"><label class="albl">Dirección</label><input class="ainp" value="${e(n.direccion||'')}" oninput="DATA.negocio.direccion=this.value"></div>
      <div class="afw"><label class="albl">Teléfono</label><input class="ainp" value="${e(n.telefono||'')}" oninput="DATA.negocio.telefono=this.value"></div>
      <div class="afw"><label class="albl">Email</label><input class="ainp" value="${e(n.email||'')}" oninput="DATA.negocio.email=this.value"></div>
      <div class="afw"><label class="albl">Instagram</label><input class="ainp" value="${e(n.instagram||'')}" oninput="DATA.negocio.instagram=this.value"></div>
      <div class="afw pf-full"><label class="albl">Texto footer línea 1</label><input class="ainp" value="${e(n.footer||'')}" oninput="DATA.negocio.footer=this.value"></div>
      <div class="afw pf-full"><label class="albl">Texto footer línea 2</label><input class="ainp" value="${e(n.footerSub||'')}" oninput="DATA.negocio.footerSub=this.value"></div>
    </div>`;
  wrap.appendChild(contactCard);

  /* ── HORARIOS ── */
  const horCard = makeCard('🕐 Horarios');
  const horList = document.createElement('div'); horList.id = 'horariosList';
  (n.horarios || []).forEach((h, hi) => {
    horList.appendChild(makeHorarioRow(h, hi));
  });
  horCard.appendChild(horList);
  const addHor = document.createElement('button');
  addHor.className = 'ab ab-blue'; addHor.textContent = '+ Agregar horario';
  addHor.style.marginTop = '.5rem';
  addHor.onclick = () => {
    if (!DATA.negocio.horarios) DATA.negocio.horarios = [];
    DATA.negocio.horarios.push({ dias: 'Lun – Vie', hora: '9:00 – 20:00' });
    buildNegocioSection();
  };
  horCard.appendChild(addHor);
  wrap.appendChild(horCard);

  /* ── MAPA ── */
  const mapaCard = makeCard('📍 Mapa y ubicación');
  mapaCard.innerHTML += `
    <div class="info-grid">
      <div class="afw pf-full"><label class="albl">URL iframe de Google Maps (embed)</label><input class="ainp" value="${e(n.mapsEmbed||'')}" oninput="DATA.negocio.mapsEmbed=this.value" placeholder="https://www.google.com/maps/embed?..."></div>
      <div class="afw pf-full"><label class="albl">Enlace "Abrir en Maps"</label><input class="ainp" value="${e(n.mapsLink||'')}" oninput="DATA.negocio.mapsLink=this.value" placeholder="https://maps.google.com/..."></div>
    </div>
    <p style="font-size:.68rem;color:var(--muted);margin-top:.4rem">💡 Para obtener el iframe: abre Google Maps → busca tu local → Compartir → Insertar mapa → copia la URL del src=""</p>`;
  wrap.appendChild(mapaCard);

  /* ── SOBRE NOSOTROS ── */
  const aboutCard = makeCard('🫘 Sobre nosotros');
  aboutCard.innerHTML += `
    <div class="info-grid">
      <div class="afw pf-full"><label class="albl">URL imagen "Sobre nosotros"</label><input class="ainp" value="${e(n.aboutImg||'')}" oninput="DATA.negocio.aboutImg=this.value"></div>
      <div class="afw"><label class="albl">Badge (ej: Desde 1998)</label><input class="ainp" value="${e(n.aboutBadge||'')}" oninput="DATA.negocio.aboutBadge=this.value"></div>
      <div class="afw"><label class="albl">Título</label><input class="ainp" value="${e(n.aboutTitulo||'')}" oninput="DATA.negocio.aboutTitulo=this.value"></div>
      <div class="afw pf-full"><label class="albl">Párrafo 1</label><textarea class="atextarea" oninput="DATA.negocio.aboutP1=this.value">${e(n.aboutP1||'')}</textarea></div>
      <div class="afw pf-full"><label class="albl">Párrafo 2</label><textarea class="atextarea" oninput="DATA.negocio.aboutP2=this.value">${e(n.aboutP2||'')}</textarea></div>
    </div>`;
  wrap.appendChild(aboutCard);

  /* ── PROMO ── */
  const promoCard = makeCard('⭐ Oferta / Promoción del mes');
  promoCard.innerHTML += `
    <div class="info-grid">
      <div class="afw pf-full"><label class="albl">URL imagen de la promo</label><input class="ainp" value="${e(n.promoImg||'')}" oninput="DATA.negocio.promoImg=this.value"></div>
      <div class="afw"><label class="albl">Etiqueta (ej: Solo en noviembre)</label><input class="ainp" value="${e(n.promoTag||'')}" oninput="DATA.negocio.promoTag=this.value"></div>
      <div class="afw"><label class="albl">Precio</label><input class="ainp" value="${e(n.promoPrecio||'')}" oninput="DATA.negocio.promoPrecio=this.value"></div>
      <div class="afw"><label class="albl">Título de la promo</label><input class="ainp" value="${e(n.promoTitulo||'')}" oninput="DATA.negocio.promoTitulo=this.value"></div>
      <div class="afw pf-full"><label class="albl">Descripción</label><input class="ainp" value="${e(n.promoDesc||'')}" oninput="DATA.negocio.promoDesc=this.value"></div>
    </div>`;
  wrap.appendChild(promoCard);
}

function makeHorarioRow(h, hi) {
  const div = document.createElement('div'); div.className = 'horario-row';
  div.innerHTML = `
    <input class="ainp" style="flex:1.2" value="${e(h.dias)}" placeholder="Lun – Vie" oninput="DATA.negocio.horarios[${hi}].dias=this.value">
    <input class="ainp" style="flex:1" value="${e(h.hora)}" placeholder="9:00 – 20:00" oninput="DATA.negocio.horarios[${hi}].hora=this.value">
    <button class="horario-del" onclick="DATA.negocio.horarios.splice(${hi},1);buildNegocioSection()" title="Eliminar">✕</button>`;
  return div;
}

/* ════════════════════════════════
   SECCIÓN: GESTIONAR CATEGORÍAS
════════════════════════════════ */
function buildCategoriasSection() {
  const wrap = document.getElementById('adm-cat-content');
  if (!wrap) return;
  wrap.innerHTML = '';

  const card = makeCard('📂 Categorías del menú');
  card.innerHTML += `<p style="font-size:.75rem;color:var(--muted);margin-bottom:.8rem">Agrega, renombra, reordena o elimina categorías. Los cambios afectan toda la carta.</p>`;

  const list = document.createElement('div'); list.id = 'catList';
  DATA.categorias.forEach((cat, ci) => {
    const row = document.createElement('div');
    row.style.cssText = 'display:flex;gap:.5rem;align-items:center;margin-bottom:.5rem;padding:.5rem;background:#f9f7f4;border-radius:8px;border:1px solid #e8e5e0';

    const grip = document.createElement('span');
    grip.textContent = '⠿'; grip.style.cssText = 'color:var(--muted);font-size:1rem;cursor:grab;user-select:none;padding:0 4px';

    const inp = document.createElement('input'); inp.className = 'ainp'; inp.style.flex = '1';
    inp.value = cat.label;
    inp.oninput = () => { DATA.categorias[ci].label = inp.value; };

    const upBtn = document.createElement('button'); upBtn.className = 'ab'; upBtn.textContent = '↑';
    upBtn.style.cssText = 'background:#e5e7eb;color:#374151;padding:4px 9px';
    upBtn.title = 'Subir';
    upBtn.onclick = () => { if(ci>0){ const tmp=DATA.categorias.splice(ci,1)[0]; DATA.categorias.splice(ci-1,0,tmp); if(admTab===ci) admTab=ci-1; buildCategoriasSection(); } };

    const downBtn = document.createElement('button'); downBtn.className = 'ab';
    downBtn.textContent = '↓'; downBtn.style.cssText = 'background:#e5e7eb;color:#374151;padding:4px 9px';
    downBtn.title = 'Bajar';
    downBtn.onclick = () => { if(ci<DATA.categorias.length-1){ const tmp=DATA.categorias.splice(ci,1)[0]; DATA.categorias.splice(ci+1,0,tmp); if(admTab===ci) admTab=ci+1; buildCategoriasSection(); } };

    const del = document.createElement('button'); del.className = 'ab ab-red'; del.textContent = '✕';
    del.title = 'Eliminar categoría';
    del.onclick = () => {
      if (!confirm(`¿Eliminar la categoría "${cat.label}" y todos sus productos?`)) return;
      DATA.categorias.splice(ci, 1);
      if (admTab >= DATA.categorias.length) admTab = Math.max(0, DATA.categorias.length - 1);
      buildCategoriasSection();
    };

    const count = document.createElement('span');
    count.style.cssText = 'font-size:.67rem;color:var(--muted);white-space:nowrap';
    count.textContent = `${cat.productos.length} prod.`;

    row.appendChild(grip); row.appendChild(inp); row.appendChild(count);
    row.appendChild(upBtn); row.appendChild(downBtn); row.appendChild(del);
    list.appendChild(row);
  });
  card.appendChild(list);

  const addBtn = document.createElement('button'); addBtn.className = 'ab ab-blue';
  addBtn.textContent = '+ Nueva categoría'; addBtn.style.marginTop = '.6rem';
  addBtn.onclick = () => {
    const label = prompt('Nombre de la nueva categoría:');
    if (!label || !label.trim()) return;
    const id = label.trim().toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    DATA.categorias.push({ id, label: label.trim(), productos: [], galeria: { titulo: '', fotos: [] } });
    admTab = DATA.categorias.length - 1;
    buildCategoriasSection();
    toast(`Categoría "${label.trim()}" creada`, 'ok');
  };
  card.appendChild(addBtn);
  wrap.appendChild(card);
}

/* ═══════════════════════
   HELPERS
═══════════════════════ */
function makeCard(title) {
  const card = document.createElement('div'); card.className = 'acard';
  const head = document.createElement('div'); head.className = 'acard-head';
  head.innerHTML = `<span>${title}</span>`;
  card.appendChild(head);
  return card;
}

/* ── Upload helpers ── */
function admUploadProd(ci, pi, imgEl) {
  pickFile(file => { toBase64(file, b64 => { DATA.categorias[ci].productos[pi].img = b64; DATA.categorias[ci].productos[pi].imgFull = b64; imgEl.src = b64; toast('Imagen actualizada', 'ok'); }); });
}
function admUploadGalMulti(ci) {
  pickFiles(files => {
    if (!DATA.categorias[ci].galeria) DATA.categorias[ci].galeria = { titulo: '', fotos: [] };
    let done = 0;
    files.forEach(f => { toBase64(f, b64 => { DATA.categorias[ci].galeria.fotos.push({ img: b64, imgFull: b64, caption: '' }); done++; if (done === files.length) { renderAdmTab(ci); toast(`${done} foto(s) agregada(s)`, 'ok'); } }); });
  });
}
function admUploadGalAt(ci, fi, imgEl) {
  pickFile(file => { toBase64(file, b64 => { DATA.categorias[ci].galeria.fotos[fi].img = b64; DATA.categorias[ci].galeria.fotos[fi].imgFull = b64; imgEl.src = b64; toast('Foto actualizada', 'ok'); }); });
}
function admUploadBanner() {
  pickFile(file => { toBase64(file, b64 => {
    DATA.negocio.bannerImg = b64;
    const bpImg = document.getElementById('bpImg');
    if (bpImg) bpImg.src = b64;
    toast('Imagen de banner actualizada', 'ok');
  }); });
}
function pickFile(cb) { const i = document.createElement('input'); i.type = 'file'; i.accept = 'image/*'; i.onchange = ev => cb(ev.target.files[0]); i.click(); }
function pickFiles(cb) { const i = document.createElement('input'); i.type = 'file'; i.accept = 'image/*'; i.multiple = true; i.onchange = ev => cb(Array.from(ev.target.files)); i.click(); }
function toBase64(file, cb) { const r = new FileReader(); r.onload = ev => cb(ev.target.result); r.readAsDataURL(file); }

/* ── Apply / Export / Import ── */
function admApply() {
  localStorage.setItem('cafeRoble_v2', JSON.stringify(DATA));
  renderMenu();
  renderInfo();
  toast('✔ Cambios guardados y aplicados', 'ok');
}
function admExport() {
  const blob = new Blob([JSON.stringify(DATA, null, 2)], { type: 'application/json' });
  const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = 'menu-data.json'; a.click(); URL.revokeObjectURL(a.href);
  toast('JSON exportado — reemplaza data/menu-data.json y haz commit', 'ok');
}
function admImport(input) {
  const f = input.files[0]; if (!f) return;
  const r = new FileReader(); r.onload = ev => {
    try {
      DATA = JSON.parse(ev.target.result);
      localStorage.setItem('cafeRoble_v2', JSON.stringify(DATA));
      admTab = 0; admSection = 'menu'; buildAdmin();
      toast('JSON importado correctamente', 'ok');
    } catch (_) { toast('Error: JSON inválido', 'warn'); }
  }; r.readAsText(f); input.value = '';
}
function admReset() {
  if (!confirm('¿Borrar todos los cambios locales y volver a los datos del archivo?\n\nEsto eliminará cambios no exportados.')) return;
  localStorage.removeItem('cafeRoble_v2');
  loadData().then(() => { admTab = 0; admSection = 'menu'; buildAdmin(); renderMenu(); renderInfo(); toast('Datos restablecidos desde archivo', 'ok'); });
}
