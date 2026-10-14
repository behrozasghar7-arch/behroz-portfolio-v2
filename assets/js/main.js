/* Behroz Asghar — Portfolio 2026. No dependencies. */
(function () {
  'use strict';
  var root = document.documentElement;
  var reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  var fine = matchMedia('(hover: hover) and (pointer: fine)').matches;
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };
  function store(k, v) { try { if (v === undefined) return localStorage.getItem(k); localStorage.setItem(k, v); } catch (e) { return null; } }

  /* ---------- Theme ---------- */
  var sys = matchMedia('(prefers-color-scheme: dark)'), themeBtn = $('#theme');
  function now() { return root.getAttribute('data-theme') || (sys.matches ? 'dark' : 'light'); }
  function paint() { var t = now(); root.setAttribute('data-now', t); themeBtn.setAttribute('aria-label', t === 'dark' ? 'Switch to day mode' : 'Switch to night mode'); }
  var saved = store('ba-theme'); if (saved === 'dark' || saved === 'light') root.setAttribute('data-theme', saved);
  paint(); sys.addEventListener('change', paint);
  themeBtn.addEventListener('click', function () {
    var next = now() === 'dark' ? 'light' : 'dark';
    function apply() { root.setAttribute('data-theme', next); store('ba-theme', next); paint(); }
    if (!document.startViewTransition || reduce) return apply();
    var r = themeBtn.getBoundingClientRect(), x = r.left + r.width / 2, y = r.top + r.height / 2;
    var end = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y));
    document.startViewTransition(apply).ready.then(function () {
      root.animate({ clipPath: ['circle(0px at ' + x + 'px ' + y + 'px)', 'circle(' + end + 'px at ' + x + 'px ' + y + 'px)'] },
        { duration: 650, easing: 'cubic-bezier(.22,.8,.2,1)', pseudoElement: '::view-transition-new(root)' });
    });
  });

  /* ---------- Mobile menu ---------- */
  var menuBtn = $('#menu-btn'), menu = $('#mobile-menu');
  function setMenu(open) { menu.classList.toggle('open', open); menuBtn.setAttribute('aria-expanded', open); menuBtn.setAttribute('aria-label', open ? 'Close menu' : 'Open menu'); }
  menuBtn.addEventListener('click', function () { setMenu(!menu.classList.contains('open')); });
  $$('a', menu).forEach(function (a) { a.addEventListener('click', function () { setMenu(false); }); });
  addEventListener('keydown', function (e) { if (e.key === 'Escape' && menu.classList.contains('open')) { setMenu(false); menuBtn.focus(); } });

  /* ---------- Active section in nav ---------- */
  var navLinks = $$('.nav-links a');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        navLinks.forEach(function (a) { a.setAttribute('aria-current', a.getAttribute('href') === '#' + en.target.id ? 'true' : 'false'); });
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    ['about', 'work', 'expertise', 'toolkit', 'tech', 'process', 'experience', 'lab', 'contact'].forEach(function (id) { var s = document.getElementById(id); if (s) io.observe(s); });
  }

  /* ---------- Project preview that follows the cursor (desktop only) ---------- */
  if (fine && !reduce) {
    var pv = $('#preview'), pimg = $('img', pv), tx = 0, ty = 0, cx = 0, cy = 0, running = false;
    function loop() { cx += (tx - cx) * .14; cy += (ty - cy) * .14; pv.style.left = cx + 'px'; pv.style.top = cy + 'px'; if (running) requestAnimationFrame(loop); }
    $$('.index a').forEach(function (a) {
      a.addEventListener('mouseenter', function (e) {
        pimg.src = a.dataset.img; pv.classList.add('on');
        if (!running) { running = true; cx = tx = Math.min(e.clientX + 220, innerWidth - 190); cy = ty = e.clientY; loop(); }
      });
      a.addEventListener('mouseleave', function () { pv.classList.remove('on'); setTimeout(function () { if (!pv.classList.contains('on')) running = false; }, 400); });
    });
    addEventListener('mousemove', function (e) { tx = Math.min(e.clientX + 220, innerWidth - 190); ty = e.clientY; }, { passive: true });
  }

  /* ---------- Design meets technology: workflow + live editor ---------- */
  var studio = $('#studio');
  if (studio) {
    var steps = $$('.flow button', studio), layers = $$('.layer', studio);
    var codeEl = $('#code'), who = $('#who'), stageLabel = $('#stage-label'), playBtn = $('#s-play');
    var card = $('#ui-card'), cardIm = $('#ui-im'), cardName = $('#ui-name'), cardCat = $('#ui-cat');
    var PROJECTS = [
      { name: 'Alpha Leon', cat: 'Brand Identity', img: 'images/alpha-leon.webp', file: 'alpha-leon.webp', url: 'https://www.behance.net/gallery/251471999/Alpha-Leon' },
      { name: 'RevsetLabs', cat: 'Brand Identity', img: 'images/revsetlabs.webp', file: 'revsetlabs.webp', url: 'https://www.behance.net/gallery/251372189/RevsetLabs' },
      { name: 'Jee Aya Nu', cat: 'Brand Identity & Collateral', img: 'images/jee-aya-nu.webp', file: 'jee-aya-nu.webp', url: 'https://www.behance.net/gallery/210649061/Jee-Aya-Nu' }
    ];
    var st = { p: 0, theme: 'light', r: 12, mono: true };
    var paused = false, step = 0, timer = null, typing = null, visible = true, changed = '';
    var esc = function (s) { return s.replace(/&/g, '&amp;').replace(/</g, '&lt;'); };
    var C = function (s) { return { c: s }; };
    function lines(upTo) {
      var p = PROJECTS[st.p], dark = st.theme === 'dark';
      var out = [C('<!-- Figma: frame "Project card" 360×280 -->'), C('<!-- Auto layout · 16px gap -->')];
      if (upTo < 1) return out;
      out = out.concat(['', ':root {',
        { t: '  --radius: ' + st.r + 'px;', k: 'r' },
        { t: '  --card: ' + (dark ? '#0e0e0f' : '#ffffff') + ';', k: 'theme' },
        { t: '  --text: ' + (dark ? '#f2f2f0' : '#0e0e0f') + ';', k: 'theme' }, '}']);
      if (upTo < 2) return out;
      return out.concat(['',
        { t: '<article class="card">', k: '' },
        { t: '  <img src="' + p.file + '" alt="">', k: 'p' },
        { t: '  <h4>' + p.name + '</h4>', k: 'p' },
        { t: '  <a class="pill">View case ↗</a>', k: '' },
        '</article>', '',
        { t: '.card { border-radius: var(--radius); }', k: 'r' },
        { t: st.mono ? '.card img { filter: grayscale(1); }' : '.card img { filter: none; }', k: 'g' },
        { t: st.mono ? '.card:hover img { filter: none; }' : '/* full colour, always */', k: 'g' }]);
    }
    function fmt(l) {
      if (typeof l === 'string') return esc(l);
      if (l.c) return '<span class="c">' + esc(l.c) + '</span>';
      return l.k && l.k === changed ? '<span class="hl">' + esc(l.t) + '</span>' : esc(l.t);
    }
    var text = function (l) { return typeof l === 'string' ? l : (l.c || l.t); };
    function render(ls, partial) { codeEl.innerHTML = ls.map(fmt).join('\n') + (partial != null ? '\n' + esc(partial) : '') + '<span class="caret"></span>'; }
    function paintCard() {
      var p = PROJECTS[st.p];
      card.href = p.url; cardIm.style.backgroundImage = 'url("' + p.img + '")';
      cardName.textContent = p.name; cardCat.textContent = p.cat;
      card.style.setProperty('--r', st.r + 'px');
      card.classList.toggle('dark', st.theme === 'dark');
      card.classList.toggle('mono', st.mono);
    }
    var meta = [
      { who: 'Figma', label: 'Wireframe', dur: 2800 },
      { who: 'Direction', label: 'Type & colour', dur: 2800 },
      { who: 'Claude · VS Code', label: 'Prompting Claude', dur: 0 },
      { who: 'Live preview', label: 'Live component · hover it', dur: 5200 }
    ];
    function stop() { clearTimeout(timer); clearTimeout(typing); }
    function show(i, opts) {
      stop(); step = i; opts = opts || {};
      steps.forEach(function (b, k) { b.classList.remove('on', 'done'); void b.offsetWidth; if (k < i) b.classList.add('done'); b.setAttribute('aria-selected', k === i); });
      layers.forEach(function (l, k) { l.classList.toggle('on', k === i); });
      who.textContent = meta[i].who; stageLabel.textContent = meta[i].label;
      if (i === 2 && !opts.instant && !reduce) {
        var base = lines(1), build = lines(2).slice(base.length), li = 0, ci = 0;
        steps[i].style.setProperty('--step', (build.map(text).join('').length * 20 + build.length * 110) + 'ms');
        steps[i].classList.add('on');
        (function type() {
          if (li >= build.length) { render(base.concat(build)); if (!paused && visible) timer = setTimeout(function () { show(3); }, 500); return; }
          var cur = text(build[li]);
          if (ci >= cur.length) { li++; ci = 0; render(base.concat(build.slice(0, li))); typing = setTimeout(type, 110); }
          else { ci++; render(base.concat(build.slice(0, li)), cur.slice(0, ci)); typing = setTimeout(type, 20); }
        })();
        return;
      }
      render(lines(i));
      steps[i].style.setProperty('--step', (meta[i].dur || 1) + 'ms');
      steps[i].classList.add('on');
      if (paused) steps[i].classList.add('done');
      if (!paused && !reduce && visible) timer = setTimeout(function () { show((i + 1) % 4); }, meta[i].dur);
    }
    function setPaused(v) { paused = v; playBtn.setAttribute('aria-pressed', v); playBtn.setAttribute('aria-label', v ? 'Play workflow' : 'Pause workflow'); if (v) stop(); else show(step === 3 ? 0 : step); }
    playBtn.addEventListener('click', function () { setPaused(!paused); });
    steps.forEach(function (b, k) { b.addEventListener('click', function () { if (!paused) setPaused(true); show(k, { instant: true }); }); });

    // Live editing: any change pauses the loop, jumps to the live card and highlights the edited code
    function edit(key) { changed = key; paintCard(); if (!paused) setPaused(true); show(3, { instant: true }); changed = ''; }
    function seg(id, fn) { $$('#' + id + ' button').forEach(function (b) { b.addEventListener('click', function () { $$('#' + id + ' button').forEach(function (x) { x.setAttribute('aria-pressed', x === b); }); fn(b); }); }); }
    seg('tw-project', function (b) { st.p = +b.dataset.i; edit('p'); });
    seg('tw-theme', function (b) { st.theme = b.dataset.t; edit('theme'); });
    seg('tw-gray', function (b) { st.mono = b.dataset.g === '1'; edit('g'); });
    $('#tw-radius').addEventListener('input', function (e) { st.r = +e.target.value; $('#o-radius').textContent = st.r + 'px'; edit('r'); });

    paintCard();
    if (reduce) { paused = true; playBtn.setAttribute('aria-pressed', true); show(3, { instant: true }); }
    else {
      show(0);
      if ('IntersectionObserver' in window) new IntersectionObserver(function (en) { visible = en[0].isIntersecting; if (visible && !paused) show(step); else if (!visible) stop(); }).observe(studio);
    }
  }

  /* ---------- Typography lab ---------- */
  var lab = $('#type-lab');
  if (lab) {
    var tabs = $$('.lab-tabs button', lab);
    tabs.forEach(function (t, i) {
      t.addEventListener('click', function () { selectTab(t); });
      t.addEventListener('keydown', function (e) { if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') { var n = tabs[(i + 1) % 2]; selectTab(n); n.focus(); } });
    });
    function selectTab(t) {
      tabs.forEach(function (b) { var on = b === t; b.setAttribute('aria-selected', on); b.tabIndex = on ? 0 : -1; $('#' + b.getAttribute('aria-controls')).hidden = !on; });
      if (t.id === 't-kern') fitKern(); else applyPlay();
    }

    // Playground
    var word = $('#word'), spec = $('#spec'), readout = $('#readout');
    var w = $('#c-weight'), tr = $('#c-track'), sz = $('#c-size');
    var state = { text: 'Identity', align: 'left' };
    var DEF = { weight: 500, track: -4, size: 100 };
    function setLetters(el, text) {
      el.innerHTML = '';
      text.split('').forEach(function (ch, i) { var s = document.createElement('span'); s.textContent = ch; s.style.animationDelay = (i * 35) + 'ms'; el.appendChild(s); });
      el.setAttribute('aria-label', text);
    }
    function applyPlay() {
      var avail = spec.clientWidth - 48;
      var base = Math.min(avail / (state.text.length * .56), 150);
      var size = base * (+sz.value / 100);
      word.style.fontSize = size.toFixed(1) + 'px';
      word.style.fontWeight = w.value;
      word.style.letterSpacing = (+tr.value / 100) + 'em';
      word.style.textAlign = state.align;
      $('#o-weight').textContent = w.value;
      $('#o-track').textContent = (tr.value > 0 ? '+' : '') + tr.value + '%';
      $('#o-size').textContent = sz.value + '%';
      readout.textContent = Math.round(size) + 'px · ' + w.value + ' · ' + (tr.value > 0 ? '+' : '') + tr.value + '%';
    }
    function pressGroup(group, btn) { $$('button', group).forEach(function (b) { b.setAttribute('aria-pressed', b === btn); }); }
    $$('#words button').forEach(function (b) { b.addEventListener('click', function () { pressGroup($('#words'), b); state.text = b.textContent; setLetters(word, state.text); applyPlay(); }); });
    $$('#aligns button').forEach(function (b) { b.addEventListener('click', function () { pressGroup($('#aligns'), b); state.align = b.dataset.a; applyPlay(); }); });
    [w, tr, sz].forEach(function (el) { el.addEventListener('input', applyPlay); });
    $('#reset').addEventListener('click', function () {
      w.value = DEF.weight; tr.value = DEF.track; sz.value = DEF.size; state.align = 'left';
      pressGroup($('#aligns'), $('#aligns button')); setLetters(word, state.text); applyPlay();
    });
    setLetters(word, state.text); applyPlay();

    // Kerning challenge
    var WORDS = ['TYPO', 'WAVE', 'AVOW', 'LAYOUT', 'KERN', 'VOLT'];
    var kword = $('#kword'), kghost = $('#kghost'), kspec = $('#kern-spec'), gap = $('#k-gap'), oGap = $('#o-gap'), result = $('#k-result');
    var offsets = [], sel = 0, letters = [], lastWord = '';
    function newKern() {
      var t; do { t = WORDS[Math.floor(Math.random() * WORDS.length)]; } while (t === lastWord); lastWord = t;
      var n = t.length - 1; offsets = new Array(n).fill(0);
      var idx = []; for (var i = 0; i < n; i++) idx.push(i);
      idx.sort(function () { return Math.random() - .5; }).slice(0, Math.min(3, n)).forEach(function (i) { offsets[i] = (Math.random() < .5 ? -1 : 1) * (5 + Math.floor(Math.random() * 8)); });
      kword.innerHTML = ''; letters = [];
      t.split('').forEach(function (ch, i) {
        var s = document.createElement('span'); s.textContent = ch; s.style.animationDelay = (i * 40) + 'ms'; kword.appendChild(s); letters.push(s);
        if (i < n) {
          var m = document.createElement('span'); m.className = 'gap-mark';
          var b = document.createElement('button'); b.type = 'button'; b.textContent = i + 1; b.setAttribute('aria-label', 'Select gap ' + (i + 1)); b.setAttribute('aria-pressed', 'false');
          b.addEventListener('click', function () { selectGap(i); });
          m.appendChild(b); kword.appendChild(m);
        }
      });
      kword.setAttribute('aria-label', t);
      kghost.textContent = t;
      kspec.classList.remove('reveal-ideal');
      result.textContent = 'Some gaps are off. Make the word feel evenly spaced.';
      paintKern(); selectGap(offsets.findIndex(function (o) { return o !== 0; })); fitKern();
    }
    function paintKern() { letters.forEach(function (s, i) { s.style.marginRight = i < offsets.length ? (offsets[i] / 100) + 'em' : '0'; }); }
    function selectGap(i) { sel = Math.max(0, i); $$('.gap-mark button', kword).forEach(function (b, k) { b.setAttribute('aria-pressed', k === sel); }); gap.value = offsets[sel]; oGap.textContent = offsets[sel]; }
    function fitKern() { var avail = kspec.clientWidth - 64; var size = Math.min(avail / (lastWord.length * .72), 140); kword.style.fontSize = kghost.style.fontSize = size + 'px'; }
    gap.addEventListener('input', function () { offsets[sel] = +gap.value; oGap.textContent = gap.value; paintKern(); kspec.classList.remove('reveal-ideal'); });
    $('#k-new').addEventListener('click', newKern);
    $('#k-check').addEventListener('click', function () {
      var err = offsets.reduce(function (a, o) { return a + Math.abs(o); }, 0);
      var score = Math.max(0, Math.round(100 - err * 2.5));
      var verdict = score >= 95 ? 'Perfectly balanced.' : score >= 80 ? 'Sharp eye. Almost there.' : score >= 60 ? 'Getting closer.' : 'Keep adjusting.';
      result.textContent = 'Score ' + score + '/100. ' + verdict + ' The outline shows the balanced spacing.';
      kspec.classList.add('reveal-ideal');
    });
    newKern();

    var rt; addEventListener('resize', function () { clearTimeout(rt); rt = setTimeout(function () { applyPlay(); fitKern(); }, 120); });
  }

  /* ---------- Copy email ---------- */
  var toast = $('#toast'), tt, copyBtn = $('#copy'), copyLabel = $('#copy-label');
  function say(msg) { toast.textContent = msg; toast.classList.add('on'); clearTimeout(tt); tt = setTimeout(function () { toast.classList.remove('on'); }, 1800); }
  copyBtn.addEventListener('click', function () {
    var emailEl = $('#email'), email = emailEl.textContent.trim();
    function done() { copyBtn.classList.add('ok'); copyLabel.textContent = 'Copied'; say('Email copied to clipboard'); setTimeout(function () { copyBtn.classList.remove('ok'); copyLabel.textContent = 'Copy'; }, 2000); }
    function selectIt() { var r = document.createRange(); r.selectNodeContents(emailEl); var s = getSelection(); s.removeAllRanges(); s.addRange(r); say('Email selected. Press ⌘C / Ctrl+C to copy'); }
    if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(email).then(done, selectIt);
    else selectIt();
  });

  $('#yr').textContent = new Date().getFullYear();
})();
