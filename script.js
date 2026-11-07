const $ = s => document.querySelector(s);
const esc = s => String(s).replace(/[&<>"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const MEUS_LISTA = typeof MEUS !== 'undefined' ? MEUS : [];
const TODOS = [...TEXTOS, ...MEUS_LISTA];
const liberados = new Set();
let ultimoFoco = null;

const limpa = s => s.replace(/\{\{|\}\}|\*\*|\[\[\w+\||\]\]/g, '');
const resumo = t => {
  const s = limpa(t.corpo.filter(p => p !== '§§').join(' ')).replace(/\s+/g, ' ');
  return s.length > 150 ? s.slice(0, 150).trim() + '…' : s;
};
const tempo = t => Math.max(1, Math.round(t.corpo.join(' ').split(/\s+/).length / 200)) + ' min de leitura';

const corOk = t => /^#[0-9a-f]{3,8}$/i.test(t.cor || '');
function card(t, comTag) {
  const tag = comTag && t.comentario ? `<span class="tag">${esc(t.comentario)}</span>` : '';
  const selo = t.intimo ? '<span class="tag intimo">+18 · íntimo</span>' : '';
  const previa = t.intimo ? 'Texto íntimo. Toque para abrir.' : resumo(t);
  return `<article class="card${corOk(t) ? ' cor' : ''}"${corOk(t) ? ` style="--ac:${t.cor}"` : ''} role="button" tabindex="0" data-id="${t.id}">${tag}${selo}
    <h3>${esc(t.titulo)}</h3><p>${esc(previa)}</p>
    <small>${[t.data, tempo(t)].filter(Boolean).join(' · ')}</small></article>`;
}
function lista(el, arr, comTag) {
  $(el).innerHTML = arr.length ? arr.map(t => card(t, comTag)).join('') : '<p class="vazio">Em breve, por aqui…</p>';
}

/* ----- leitura ----- */
const fmt = p => esc(p)
  .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
  .replace(/\[\[(\w+)\|(.+?)\]\]/g, '<span class="c-$1">$2</span>')
  .replace(/\{\{(.+?)\}\}/g, '<mark>$1</mark>');
const corpoHtml = t => t.corpo.map(p => p === '§§' ? '<p class="orn">✦</p>' : `<p>${fmt(p)}</p>`).join('');

function abrir(id) {
  const t = TODOS.find(x => x.id === id);
  if (!t) return;
  const temRosa = t.corpo.some(p => p.includes('{{'));
  const trava = t.intimo && !liberados.has(id);
  $('#leitura').innerHTML = `<h2>${esc(t.titulo)}</h2>
    ${t.subtitulo ? `<p class="subt">${esc(t.subtitulo)}</p>` : ''}
    <p class="meta">${esc(t.data || '')}</p>
    ${t.comentario ? `<blockquote>${esc(t.comentario)}</blockquote>` : ''}
    ${trava ? '<div class="aviso"><p>Este texto é íntimo e tem conteúdo adulto (+18).</p><button class="botao" id="liberar">Ler mesmo assim</button></div>'
      : (temRosa ? '<button class="botao revelar" id="revelar">✦ Revelar a mensagem em rosa</button>' : '') + `<div id="corpo">${corpoHtml(t)}</div>`}`;
  if (trava) $('#liberar').onclick = () => { liberados.add(id); abrir(id); };
  else if (temRosa) $('#revelar').onclick = () => {
    const on = $('#corpo').classList.toggle('revela');
    $('#revelar').textContent = on ? 'Voltar ao texto' : '✦ Revelar a mensagem em rosa';
  };
  const folha = $('.folha');
  if (corOk(t)) { folha.dataset.cor = '1'; folha.style.setProperty('--ac', t.cor); folha.style.setProperty('--tit', t.cor); }
  else { delete folha.dataset.cor; folha.style.removeProperty('--ac'); folha.style.removeProperty('--tit'); }
  if ($('#modal').hidden) ultimoFoco = document.activeElement;
  $('#modal').hidden = false;
  document.body.classList.add('trava');
  $('.folha').scrollTop = 0;
  $('#fechar').focus();
}
function fechar() {
  $('#modal').hidden = true;
  document.body.classList.remove('trava');
  if (ultimoFoco) ultimoFoco.focus();
}
document.addEventListener('click', e => {
  const c = e.target.closest('.card');
  if (c) abrir(c.dataset.id);
});
document.addEventListener('keydown', e => {
  if (e.key === 'Escape' && !$('#modal').hidden) fechar();
  const c = e.target.closest && e.target.closest('.card');
  if (c && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); abrir(c.dataset.id); }
});
$('#fechar').onclick = fechar;
$('#modal').onclick = e => { if (e.target.id === 'modal') fechar(); };

/* ----- carrossel ----- */
function carrossel() {
  if (typeof CASAIS === 'undefined') return;
  const t = $('#trilho');
  t.innerHTML = CASAIS.map(c => `<figure class="slide">
    <div class="ph">♥<small>${esc(c.img || '')}</small></div>
    ${c.img ? `<img src="${esc(c.img)}" alt="${esc(c.titulo || 'Casal')}" loading="lazy">` : ''}
    ${c.titulo || c.obra ? `<figcaption><strong>${esc(c.titulo || '')}</strong><span>${esc(c.obra || '')}</span></figcaption>` : ''}</figure>`).join('');
  t.querySelectorAll('img').forEach(i => i.onerror = () => i.remove());
  const passo = () => t.firstElementChild.getBoundingClientRect().width + 14;
  $('#ant').onclick = () => t.scrollBy({ left: -passo(), behavior: 'smooth' });
  $('#prox').onclick = () => t.scrollBy({ left: passo(), behavior: 'smooth' });
}

/* ----- tarot ----- */
const norm = s => s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
const INDICE = TODOS.map(t => ({ t, p: norm(limpa(t.titulo + ' ' + t.corpo.join(' '))).split(/[^a-z0-9]+/).filter(Boolean) }));

function conta(palavras, k) {
  const exato = k.endsWith('$'), s = exato ? k.slice(0, -1) : k;
  let c = 0, achada = null;
  for (const w of palavras) if (exato ? w === s : w.startsWith(s)) { c++; achada = achada || w; }
  return { c, achada };
}
// pontua cada texto pelas palavras-chave da carta (palavras raras no conjunto valem mais)
function melhorTexto(carta) {
  const ks = carta[3].split(' '), N = INDICE.length, df = {};
  ks.forEach(k => df[k] = INDICE.filter(d => conta(d.p, k).c > 0).length);
  return INDICE.map(d => {
    let s = 0; const achadas = [];
    ks.forEach(k => {
      const r = conta(d.p, k);
      if (r.c) { s += Math.log(1 + r.c) * Math.log((N + 1) / (df[k] + 0.5)); achadas.push(r.achada); }
    });
    return { t: d.t, s: s / Math.pow(d.p.length, 0.25), achadas };
  }).sort((a, b) => b.s - a.s)[0];
}

let ultima = -1, ocupado = false;
$('#tirar').onclick = () => {
  if (ocupado) return;
  ocupado = true;
  const el = $('#carta'), frente = el.querySelector('.frente'), estavaVirada = el.classList.contains('virada');
  el.classList.remove('virada');
  $('#resultado').hidden = true;
  let i;
  do { i = Math.floor(Math.random() * CARTAS.length); } while (i === ultima);
  ultima = i;
  const c = CARTAS[i];
  setTimeout(() => { try {
    $('#cSimbolo').textContent = c[1];
    $('#cNome').textContent = c[0];
    const img = $('#cImg');
    frente.classList.remove('com-img');
    img.onload = () => frente.classList.add('com-img');
    img.onerror = () => frente.classList.remove('com-img');
    const url = typeof IMG_TAROT !== 'undefined' && IMG_TAROT[i];
    if (url) img.src = url; else img.removeAttribute('src');
    el.classList.add('virada');
    setTimeout(() => {
      try { mostrar(c); $('#tirar').textContent = 'Tirar outra carta'; } finally { ocupado = false; }
    }, 750);
  } catch (e) { console.error(e); ocupado = false; } }, estavaVirada ? 450 : 50);
};

function mostrar(c) {
  const m = melhorTexto(c);
  const t = m.s > 0 ? m.t : TODOS[Math.floor(Math.random() * TODOS.length)];
  const dono = MEUS_LISTA.includes(t) ? 'texto meu' : 'texto dela';
  $('#cSignificado').textContent = c[2];
  $('#cTexto').innerHTML = card(t, false);
  $('#cPalavras').textContent = m.s > 0 ? `(${dono}) Palavras em comum: ` + [...new Set(m.achadas)].slice(0, 5).join(', ') : `(${dono}) Nenhuma palavra em comum — o destino escolheu este.`;
  $('#resultado').hidden = false;
  $('#resultado').scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

/* ----- início ----- */
document.title = CONFIG.titulo;
$('#titulo').textContent = CONFIG.titulo;
$('#subtitulo').textContent = CONFIG.subtitulo;
$('#rodape').textContent = CONFIG.rodape;
lista('#gridFav', TEXTOS.filter(t => t.favorito), true);
lista('#gridTodos', TEXTOS.filter(t => t.categoria !== 'analise'), false);
lista('#gridAnalises', TEXTOS.filter(t => t.categoria === 'analise'), false);
lista('#gridDela', TEXTOS.filter(t => t.paraMim), true);
lista('#gridMeus', MEUS_LISTA, true);
carrossel();
