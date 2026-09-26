(function () {
  'use strict';

  /* ================= Dữ liệu & bài học ================= */
  var LESSON_SIZE = 25;
  var LEVEL_NAMES = { 1: 'Cốt lõi', 2: 'Nâng cao', 3: 'Chuyên sâu' };
  var POS_VI = { n: 'danh từ', v: 'động từ', adj: 'tính từ', adv: 'trạng từ' };

  var byAlpha = function (a, b) { return a.w.localeCompare(b.w); };
  var RAW = window.SAT_WORDS || [];
  var WORDS = [].concat(
    RAW.filter(function (x) { return x.level === 1 && !x.multi; }).sort(byAlpha),
    RAW.filter(function (x) { return x.level === 2 && !x.multi; }).sort(byAlpha),
    RAW.filter(function (x) { return x.multi; }).sort(byAlpha),
    RAW.filter(function (x) { return x.level === 3 && !x.multi; }).sort(byAlpha)
  );
  var MAP = {};
  WORDS.forEach(function (x, i) {
    x.id = i;
    x.lesson = Math.floor(i / LESSON_SIZE) + 1;
    x.synList = x.syn.split(',').map(function (s) { return s.trim(); }).filter(Boolean);
    x.synSet = new Set(x.synList.map(function (s) { return s.toLowerCase(); }));
    x.pos1 = x.pos.split('/')[0];
    x.vi1 = x.vi.split(/[,;]/)[0].trim().toLowerCase();
    x.search = norm(x.w + ' ' + x.vi + ' ' + x.syn);
    MAP[x.w] = x;
  });
  var LESSON_COUNT = Math.ceil(WORDS.length / LESSON_SIZE);
  var LESSONS = [];
  for (var li = 1; li <= LESSON_COUNT; li++) {
    var lw = WORDS.filter(function (x) { return x.lesson === li; });
    var lv = {};
    lw.forEach(function (x) { lv[x.level] = (lv[x.level] || 0) + 1; });
    var main = +Object.keys(lv).sort(function (a, b) { return lv[b] - lv[a]; })[0];
    LESSONS.push({ n: li, words: lw, level: main, multi: lw.every(function (x) { return x.multi; }) || lw.filter(function (x) { return x.multi; }).length > 12 });
  }

  function posLabel(pos) { return pos.split('/').map(function (p) { return POS_VI[p] || p; }).join(' / '); }
  function norm(s) {
    return String(s).toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/đ/g, 'd');
  }

  /* ================= Tiện ích ================= */
  function $(s, r) { return (r || document).querySelector(s); }
  function $$(s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); }
  function esc(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
  function shuffle(a) {
    a = a.slice();
    for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)); var t = a[i]; a[i] = a[j]; a[j] = t; }
    return a;
  }
  function pick(a) { return a[Math.floor(Math.random() * a.length)]; }
  function chunk(a, n) { var out = []; for (var i = 0; i < a.length; i += n) out.push(a.slice(i, i + n)); return out; }
  function exHTML(ex) { return esc(ex).replace(/\[(.+?)\]/g, '<mark>$1</mark>'); }
  function exBlank(ex) { return esc(ex).replace(/\[(.+?)\]/g, '<span class="blank" aria-label="chỗ trống"></span>'); }
  function pad2(n) { return (n < 10 ? '0' : '') + n; }
  function dayKey(d) { d = d || new Date(); return d.getFullYear() + '-' + pad2(d.getMonth() + 1) + '-' + pad2(d.getDate()); }
  var DAY = 86400000;

  /* ================= Icon ================= */
  var I = {
    home: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 10.5 12 3l9 7.5"/><path d="M5 9.5V21h14V9.5"/><path d="M10 21v-6h4v6"/></svg>',
    book: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4.5A2.5 2.5 0 0 1 6.5 2H20v17H6.5A2.5 2.5 0 0 0 4 21.5z"/><path d="M4 21.5A2.5 2.5 0 0 1 6.5 19H20v3H6.5"/><path d="M9 7h7M9 11h5"/></svg>',
    cards: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="6" width="14" height="15" rx="2"/><path d="M7 3h12a2 2 0 0 1 2 2v12"/></svg>',
    quiz: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="6" cy="7" r="2.5"/><circle cx="6" cy="17" r="2.5"/><path d="M11 7h10M11 17h10"/><path d="M4.8 7l.9.9 1.6-1.8"/></svg>',
    list: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>',
    alert: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h12l4 4v12H4z"/><path d="m9 10 6 6M15 10l-6 6"/></svg>',
    gear: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z"/></svg>',
    speak: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 5 6 9H2v6h4l5 4z"/><path d="M15.5 8.5a5 5 0 0 1 0 7M19 5a10 10 0 0 1 0 14"/></svg>',
    star: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"><path d="m12 2.8 2.8 5.8 6.3.9-4.6 4.4 1.1 6.3L12 17.2l-5.6 3 1.1-6.3L2.9 9.5l6.3-.9z"/></svg>',
    x: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M6 6l12 12M18 6 6 18"/></svg>',
    left: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="m15 18-6-6 6-6"/></svg>',
    right: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="m9 18 6-6-6-6"/></svg>',
    flame: '<svg viewBox="0 0 24 24"><path d="M12 2c1 4 5 6 5 11a5 5 0 0 1-10 0c0-2 1-3.5 2-4.5 0 2 1 3 2 3 0-3-1-6 1-9.5z"/></svg>',
    bulb: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18h6M10 22h4"/><path d="M12 2a7 7 0 0 0-4 12.7c.6.5 1 1.3 1 2.3h6c0-1 .4-1.8 1-2.3A7 7 0 0 0 12 2z"/></svg>',
    play: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 4v16l14-8z"/></svg>',
    check: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="m5 12 5 5 9-10"/></svg>',
    shuffle: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 3h5v5M4 20 21 3M21 16v5h-5M15 15l6 6M4 4l5 5"/></svg>'
  };

  /* ================= Lưu trữ tiến độ ================= */
  var KEY = 'sat500.progress.v1';
  function defaults() {
    return {
      w: {}, days: {},
      settings: { goal: 20, accent: 'en-US', rate: 0.9, autoSpeak: false, theme: 'system', dir: 'en', typeMode: false }
    };
  }
  var P = defaults();
  try {
    var saved = JSON.parse(localStorage.getItem(KEY) || 'null');
    if (saved && typeof saved === 'object') {
      P.w = saved.w || {};
      P.days = saved.days || {};
      Object.assign(P.settings, saved.settings || {});
    }
  } catch (e) { /* bộ nhớ trình duyệt không khả dụng */ }
  var storageOK = true;
  function save() {
    try { localStorage.setItem(KEY, JSON.stringify(P)); }
    catch (e) {
      if (storageOK) { storageOK = false; toast('Trình duyệt đang chặn lưu dữ liệu — tiến độ sẽ mất khi đóng trang.'); }
    }
  }

  function wp(w) { return P.w[w] || { box: 0, due: 0, r: 0, x: 0, star: false, mis: false, fix: 0, seen: 0 }; }
  function wpSet(w) {
    if (!P.w[w]) P.w[w] = { box: 0, due: 0, r: 0, x: 0, star: false, mis: false, fix: 0, seen: 0 };
    return P.w[w];
  }
  function status(w) { var b = wp(w).box; return b <= 0 ? 'new' : b >= 4 ? 'mastered' : 'learning'; }
  var STATUS_VI = { new: 'Chưa học', learning: 'Đang học', mastered: 'Đã thuộc' };

  function today() {
    var k = dayKey();
    if (!P.days[k]) P.days[k] = { rev: 0, learned: 0, right: 0 };
    return P.days[k];
  }
  function logAct(type, n) { today()[type] += (n || 1); }
  function streak() {
    var d = new Date(), n = 0;
    var active = function (dt) { var r = P.days[dayKey(dt)]; return r && (r.rev > 0 || r.learned > 0); };
    if (!active(d)) d = new Date(d.getTime() - DAY);
    while (active(d)) { n++; d = new Date(d.getTime() - DAY); }
    return n;
  }

  /* SRS: hộp Leitner, khoảng ôn theo ngày */
  var INTERVALS = [0, 1, 2, 4, 8, 16, 32, 64];
  function nextState(p, g) {
    var box = p.box, due;
    var now = Date.now();
    if (g === 1) { box = 1; due = now + 10 * 60000; }
    else if (g === 2) { box = Math.max(1, box); due = now + Math.max(0.5, INTERVALS[box] * 0.5) * DAY; }
    else if (g === 3) { box = Math.min(7, box + 1); due = now + INTERVALS[box] * DAY; }
    else { box = Math.min(7, box + 2); due = now + INTERVALS[box] * DAY; }
    return { box: box, due: due };
  }
  function fmtDelta(ms) {
    var m = Math.round(ms / 60000);
    if (m < 60) return m + ' phút';
    var h = Math.round(m / 60);
    if (h < 24) return h + ' giờ';
    return Math.round(h / 24) + ' ngày';
  }
  function gradeWord(w, g) {
    var p = wpSet(w), s = nextState(p, g);
    p.box = s.box; p.due = s.due; p.seen++;
    logAct('rev');
    save();
  }
  function recordAnswer(w, ok) {
    var p = wpSet(w);
    p.seen++;
    if (ok) {
      p.r++;
      if (p.mis) { p.fix++; if (p.fix >= 2) { p.mis = false; p.fix = 0; } }
      logAct('right');
    } else {
      p.x++; p.mis = true; p.fix = 0;
      if (p.box > 1) { p.box = 1; p.due = Date.now(); }
    }
    logAct('rev');
    save();
  }
  function markLearned(w) {
    var p = wpSet(w);
    if (p.box < 1) { p.box = 1; p.due = Date.now() + DAY; logAct('learned'); }
    save();
  }
  function toggleStar(w) { var p = wpSet(w); p.star = !p.star; save(); return p.star; }

  function dueWords() { var now = Date.now(); return WORDS.filter(function (x) { var p = P.w[x.w]; return p && p.box > 0 && p.due <= now; }); }
  function learnedWords() { return WORDS.filter(function (x) { return wp(x.w).box > 0; }); }
  function starredWords() { return WORDS.filter(function (x) { return wp(x.w).star; }); }
  function mistakeWords() {
    return WORDS.filter(function (x) { return wp(x.w).mis; }).sort(function (a, b) { return wp(b.w).x - wp(a.w).x; });
  }
  function counts() {
    var c = { new: 0, learning: 0, mastered: 0 };
    WORDS.forEach(function (x) { c[status(x.w)]++; });
    return c;
  }
  function lessonProgress(L) {
    var ws = LESSONS[L - 1].words, learned = 0, mastered = 0;
    ws.forEach(function (x) { var b = wp(x.w).box; if (b > 0) learned++; if (b >= 4) mastered++; });
    return { total: ws.length, learned: learned, mastered: mastered };
  }
  function nextLesson() {
    for (var i = 1; i <= LESSON_COUNT; i++) { var pr = lessonProgress(i); if (pr.learned < pr.total) return i; }
    return null;
  }

  /* ================= Phát âm ================= */
  var voices = [];
  function loadVoices() { try { voices = window.speechSynthesis.getVoices() || []; } catch (e) { voices = []; } }
  if ('speechSynthesis' in window) {
    loadVoices();
    try { window.speechSynthesis.onvoiceschanged = loadVoices; } catch (e) { /* bỏ qua */ }
  }
  function speak(text) {
    if (!('speechSynthesis' in window)) { toast('Trình duyệt này không hỗ trợ phát âm.'); return; }
    try {
      window.speechSynthesis.cancel();
      var u = new SpeechSynthesisUtterance(text);
      u.lang = P.settings.accent; u.rate = +P.settings.rate || 0.9;
      var v = voices.filter(function (v) { return v.lang === P.settings.accent || v.lang === P.settings.accent.replace('-', '_'); })[0] ||
        voices.filter(function (v) { return /^en/i.test(v.lang); })[0];
      if (v) u.voice = v;
      window.speechSynthesis.speak(u);
    } catch (e) { toast('Không phát âm được trên trình duyệt này.'); }
  }

  /* ================= Giao diện chung ================= */
  var root = document.documentElement;
  var hostTheme = root.getAttribute('data-theme');
  function applyTheme() {
    var t = P.settings.theme;
    if (t === 'system') { if (hostTheme) root.setAttribute('data-theme', hostTheme); else root.removeAttribute('data-theme'); }
    else root.setAttribute('data-theme', t);
  }

  var toastTimer;
  function toast(msg) {
    var t = $('#toast');
    if (!t) return;
    t.textContent = msg; t.hidden = false;
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { t.hidden = true; }, 2600);
  }

  var ROUTES = [
    { id: 'home', label: 'Tổng quan', short: 'Tổng quan', icon: 'home' },
    { id: 'learn', label: 'Học từ mới', short: 'Học', icon: 'book' },
    { id: 'review', label: 'Ôn tập', short: 'Ôn tập', icon: 'cards' },
    { id: 'quiz', label: 'Kiểm tra', short: 'Kiểm tra', icon: 'quiz' },
    { id: 'words', label: 'Từ điển', short: 'Từ điển', icon: 'list' },
    { id: 'mistakes', label: 'Sổ lỗi sai', short: 'Lỗi sai', icon: 'alert' }
  ];
  function navHTML(short) {
    var due = dueWords().length, mis = mistakeWords().length;
    return ROUTES.map(function (r) {
      var badge = r.id === 'review' && due ? '<span class="count">' + due + '</span>' :
        r.id === 'mistakes' && mis ? '<span class="count">' + mis + '</span>' : '';
      return '<a class="tab" href="#' + r.id + '" data-route="' + r.id + '">' + I[r.icon] + '<span>' + (short ? r.short : r.label) + '</span>' + badge + '</a>';
    }).join('');
  }
  function renderNav() {
    $('#tabs').innerHTML = navHTML(false);
    $('#bottombar').innerHTML = navHTML(true);
    $('#settingsLink').innerHTML = I.gear;
    var cur = route();
    $$('[data-route]').forEach(function (a) { if (a.getAttribute('data-route') === cur) a.setAttribute('aria-current', 'page'); });
    if (cur === 'settings') $('#settingsLink').setAttribute('aria-current', 'page'); else $('#settingsLink').removeAttribute('aria-current');
  }

  function route() {
    var h = (location.hash || '').replace('#', '');
    var ok = ['home', 'learn', 'review', 'quiz', 'words', 'mistakes', 'settings'];
    return ok.indexOf(h) >= 0 ? h : 'home';
  }
  function go(r) {
    if (location.hash === '#' + r) render(); else location.hash = r;
  }

  var keyHandler = null;
  var tickTimer = null;
  function setView(html, onKey) {
    var v = $('#view');
    v.innerHTML = html;
    delete v.dataset.list;
    keyHandler = onKey || null;
  }

  function levelTag(x) {
    return (x.multi ? '<span class="tag multi">Đa nghĩa</span>' : '') + '<span class="tag l' + x.level + '">' + LEVEL_NAMES[x.level] + '</span>';
  }
  function speakBtn(w, cls) { return '<button class="icon-btn ' + (cls || 'sm') + '" data-speak="' + esc(w) + '" aria-label="Phát âm ' + esc(w) + '" title="Phát âm (P)">' + I.speak + '</button>'; }
  function starBtn(w, cls) {
    var on = wp(w).star;
    return '<button class="icon-btn ' + (cls || 'sm') + (on ? ' on' : '') + '" data-star="' + esc(w) + '" aria-pressed="' + on + '" aria-label="Gắn sao ' + esc(w) + '" title="Gắn sao (S)">' + I.star + '</button>';
  }
  function synHTML(x) {
    return '<div class="syns"><span class="lbl">Đồng nghĩa</span>' + x.synList.map(function (s) {
      return MAP[s] ? '<button class="chip link" data-word="' + esc(s) + '">' + esc(s) + '</button>' : '<span class="chip static">' + esc(s) + '</span>';
    }).join('') + '</div>';
  }
  function noteHTML(x) { return x.note ? '<div class="note">' + I.bulb + '<span>' + esc(x.note) + '</span></div>' : ''; }
  function wordInfoHTML(x, opts) {
    opts = opts || {};
    return '<div class="head"><span class="word">' + esc(x.w) + '</span>' + speakBtn(x.w, '') + starBtn(x.w, '') + '</div>' +
      '<div class="row"><span class="pos">' + esc(posLabel(x.pos)) + '</span>' + levelTag(x) + '<span class="tag">Bài ' + x.lesson + '</span></div>' +
      '<p class="vi">' + esc(x.vi) + '</p>' +
      '<p class="en">' + esc(x.en) + '</p>' +
      '<blockquote class="example">' + exHTML(x.ex) + '</blockquote>' +
      synHTML(x) + noteHTML(x);
  }

  /* ================= Chi tiết từ (modal) ================= */
  var modalList = null;
  function openWord(w, list) {
    var x = MAP[w]; if (!x) return;
    if (list) modalList = list;
    var p = wp(w), st = status(w);
    var dueTxt = p.box > 0 ? (p.due <= Date.now() ? 'Đến hạn ngay' : 'sau ' + fmtDelta(p.due - Date.now())) : '—';
    var idx = modalList ? modalList.indexOf(w) : -1;
    var html = '<div class="modal-card" role="dialog" aria-modal="true" aria-label="Chi tiết từ ' + esc(w) + '">' +
      '<button class="icon-btn modal-x" data-close aria-label="Đóng">' + I.x + '</button>' +
      '<div class="study" style="box-shadow:none;border:0;padding:0">' + wordInfoHTML(x) + '</div>' +
      '<dl class="dl">' +
      '<div><dt>Trạng thái</dt><dd><span class="dot ' + st + '"></span> ' + STATUS_VI[st] + '</dd></div>' +
      '<div><dt>Đúng / Sai</dt><dd class="num">' + p.r + ' / ' + p.x + '</dd></div>' +
      '<div><dt>Hộp ghi nhớ</dt><dd class="num">' + p.box + ' / 7</dd></div>' +
      '<div><dt>Ôn lại</dt><dd>' + dueTxt + '</dd></div>' +
      '</dl>' +
      '<div class="modal-nav">' +
      (idx >= 0 ? '<button class="btn ghost" data-mnav="-1"' + (idx <= 0 ? ' disabled' : '') + '>' + I.left + 'Từ trước</button>' : '<span></span>') +
      (p.box > 0 ? '<button class="btn ghost" data-reset-word="' + esc(w) + '">Học lại từ đầu</button>' : '<button class="btn ghost" data-mark-known="' + esc(w) + '">Đánh dấu đã biết</button>') +
      (idx >= 0 ? '<button class="btn ghost" data-mnav="1"' + (idx >= modalList.length - 1 ? ' disabled' : '') + '>Từ sau' + I.right + '</button>' : '<span></span>') +
      '</div></div>';
    var m = $('#modal');
    m.innerHTML = html; m.hidden = false;
    m.dataset.word = w;
    var c = $('.modal-x', m); if (c) c.focus();
  }
  function closeModal() { var m = $('#modal'); m.hidden = true; m.innerHTML = ''; modalList = null; }

  /* ================= Trang: Tổng quan ================= */
  function viewHome() {
    var c = counts(), due = dueWords().length, t = today(), goal = +P.settings.goal || 20;
    var done = t.rev, pct = Math.min(1, done / goal), st = streak(), nl = nextLesson();
    var R = 54, C = 2 * Math.PI * R;
    var total = WORDS.length;
    var learnedTotal = c.learning + c.mastered;

    var week = [];
    for (var i = 6; i >= 0; i--) {
      var d = new Date(Date.now() - i * DAY), k = dayKey(d), r = P.days[k];
      week.push({ d: d, v: r ? r.rev : 0, today: i === 0 });
    }
    var maxV = Math.max(goal, Math.max.apply(null, week.map(function (x) { return x.v; })));
    var dn = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];

    var html =
      '<section class="hero">' +
      '<div class="hero-text">' +
      '<p class="eyebrow">Digital SAT · Reading and Writing</p>' +
      '<h1>500 từ vựng <em>hay gặp nhất</em> trong đề SAT</h1>' +
      '<p class="lead">Học mỗi bài 25 từ, ôn bằng thẻ ghi nhớ theo lịch lặp lại ngắt quãng, rồi tự kiểm tra bằng câu hỏi điền từ giống dạng Words in Context của đề thật.</p>' +
      '</div>' +
      '<div class="panel goal-card">' +
      '<div class="ring" role="img" aria-label="Mục tiêu hôm nay: ' + done + ' trên ' + goal + ' lượt">' +
      '<svg viewBox="0 0 132 132"><circle class="track" cx="66" cy="66" r="' + R + '"/><circle class="val" cx="66" cy="66" r="' + R + '" stroke-dasharray="' + C.toFixed(1) + '" stroke-dashoffset="' + (C * (1 - pct)).toFixed(1) + '"/></svg>' +
      '<div class="ring-label"><b>' + done + '</b><span>/ ' + goal + ' lượt</span></div></div>' +
      '<div class="stack" style="gap:6px">' +
      '<b>' + (pct >= 1 ? 'Đã đạt mục tiêu hôm nay!' : 'Mục tiêu hôm nay') + '</b>' +
      '<span class="muted small">Mỗi lần lật thẻ hoặc trả lời một câu tính là 1 lượt.</span>' +
      '<span class="streak"><span class="flame">' + I.flame + '</span>' + st + ' ngày liên tiếp</span>' +
      '</div></div>' +
      '</section>' +

      '<section class="section">' +
      '<div class="cta-grid">' +
      (due > 0
        ? '<a class="cta main" href="#review" data-deck="due"><div class="cta-top"><b>Ôn tập ngay</b>' + I.cards + '</div><span class="muted">' + due + ' từ đến hạn ôn hôm nay</span></a>'
        : '<a class="cta main" href="#learn" data-lesson-go="' + (nl || 1) + '"><div class="cta-top"><b>' + (nl ? 'Học tiếp Bài ' + nl : 'Ôn lại bài 1') + '</b>' + I.book + '</div><span class="muted">' + (nl ? (lessonProgress(nl).total - lessonProgress(nl).learned) + ' từ mới đang chờ' : 'Bạn đã học hết 500 từ') + '</span></a>') +
      (due > 0
        ? '<a class="cta" href="#learn" data-lesson-go="' + (nl || 1) + '"><div class="cta-top"><b>' + (nl ? 'Học tiếp Bài ' + nl : 'Xem các bài') + '</b>' + I.book + '</div><span class="muted">' + (nl ? (lessonProgress(nl).total - lessonProgress(nl).learned) + ' từ mới đang chờ' : 'Bạn đã học hết 500 từ') + '</span></a>'
        : '<a class="cta" href="#review"><div class="cta-top"><b>Luyện thẻ ghi nhớ</b>' + I.cards + '</div><span class="muted">Chưa có từ đến hạn — luyện tự do</span></a>') +
      '<button class="cta" data-quick-quiz><div class="cta-top"><b>Kiểm tra nhanh 10 câu</b>' + I.quiz + '</div><span class="muted">' + (learnedTotal >= 10 ? 'Từ các từ bạn đã học' : 'Từ Bài 1 và các từ đã học') + '</span></button>' +
      '</div></section>' +

      '<section class="section">' +
      '<div class="section-head"><h2>Tiến độ 500 từ</h2><span class="muted small num">' + Math.round(learnedTotal / total * 100) + '% đã học</span></div>' +
      '<div class="panel progress-strip">' +
      '<div class="bar" role="img" aria-label="' + c.mastered + ' đã thuộc, ' + c.learning + ' đang học, ' + c.new + ' chưa học"><span class="m" style="width:' + (c.mastered / total * 100) + '%"></span><span class="l" style="width:' + (c.learning / total * 100) + '%"></span></div>' +
      '<div class="legend">' +
      '<div><span class="dot mastered"></span><b>' + c.mastered + '</b> đã thuộc</div>' +
      '<div><span class="dot learning"></span><b>' + c.learning + '</b> đang học</div>' +
      '<div><span class="dot new"></span><b>' + c.new + '</b> chưa học</div>' +
      '<div><b>' + starredWords().length + '</b> gắn sao</div>' +
      '<div><b>' + mistakeWords().length + '</b> trong sổ lỗi sai</div>' +
      '</div>' +
      '<p class="muted small">“Đã thuộc” = từ đã được ôn đúng nhiều lần và chuyển tới hộp ghi nhớ số 4 trở lên (khoảng ôn từ 8 ngày).</p>' +
      '</div></section>' +

      '<section class="section">' +
      '<div class="section-head"><h2>Lộ trình ' + LESSON_COUNT + ' bài</h2><span class="muted small">Bài 1–8 cốt lõi · 9–16 nâng cao · 17–20 từ đa nghĩa & chuyên sâu</span></div>' +
      lessonGridHTML() +
      '</section>' +

      '<section class="section">' +
      '<div class="section-head"><h2>7 ngày qua</h2><span class="muted small">Số lượt ôn / trả lời mỗi ngày</span></div>' +
      '<div class="panel"><div class="week">' +
      week.map(function (x) {
        var h = x.v ? Math.max(4, x.v / maxV * 100) : 3;
        return '<div class="col"><span class="v">' + x.v + '</span><span class="colbar' + (x.v ? '' : ' zero') + (x.today ? ' today' : '') + '" style="height:' + h + '%"></span><span class="d">' + (x.today ? 'Hôm nay' : dn[x.d.getDay()]) + '</span></div>';
      }).join('') +
      '</div></div></section>';

    setView(html);
  }

  function lessonGridHTML() {
    return '<div class="lesson-grid">' + LESSONS.map(function (L) {
      var pr = lessonProgress(L.n);
      var first = L.words[0].w, last = L.words[L.words.length - 1].w;
      var tag = L.multi ? '<span class="tag multi">Đa nghĩa</span>' : '<span class="tag l' + L.level + '">' + LEVEL_NAMES[L.level] + '</span>';
      return '<button class="lesson' + (pr.learned === pr.total ? ' done' : '') + '" data-lesson-go="' + L.n + '">' +
        '<div class="lesson-top"><span class="lesson-no">Bài ' + pad2(L.n) + '</span>' + tag + '</div>' +
        '<span class="range">' + esc(first) + ' – ' + esc(last) + '</span>' +
        '<div class="bar"><span class="m" style="width:' + (pr.mastered / pr.total * 100) + '%"></span><span class="l" style="width:' + ((pr.learned - pr.mastered) / pr.total * 100) + '%"></span></div>' +
        '<div class="meta"><span class="num">' + pr.learned + '/' + pr.total + ' đã học</span><span class="num">' + pr.mastered + ' thuộc</span></div>' +
        '</button>';
    }).join('') + '</div>';
  }

  /* ================= Trang: Học từ mới ================= */
  var learn = { lesson: null, s: null };

  function viewLearn() {
    if (learn.s) return renderLearnSession();
    if (learn.lesson) return viewLesson(learn.lesson);
    var nl = nextLesson();
    setView(
      '<div class="page-head"><p class="eyebrow">Học từ mới</p><h1>Chọn bài học</h1>' +
      '<p class="muted">Mỗi bài 25 từ. Bạn học từng nhóm 5 từ: xem thẻ từ, nghe phát âm, rồi làm ngay một bài kiểm tra nhỏ. Trả lời đúng hết thì nhóm từ được đưa vào lịch ôn tập.</p>' +
      (nl ? '<div class="row" style="margin-top:6px"><button class="btn primary lg" data-lesson-go="' + nl + '">' + I.play + 'Học tiếp Bài ' + nl + '</button></div>' : '') +
      '</div>' + lessonGridHTML()
    );
  }

  function viewLesson(n) {
    var L = LESSONS[n - 1], pr = lessonProgress(n);
    var newCount = pr.total - pr.learned;
    var list = L.words.map(function (x) { return x.w; });
    setView(
      '<div class="page-head">' +
      '<button class="back" data-lesson-back>' + I.left + 'Tất cả bài học</button>' +
      '<p class="eyebrow">Bài ' + pad2(n) + ' · ' + (L.multi ? 'Từ đa nghĩa' : LEVEL_NAMES[L.level]) + '</p>' +
      '<h1>' + esc(L.words[0].w) + ' – ' + esc(L.words[L.words.length - 1].w) + '</h1>' +
      '<div class="bar" style="max-width:420px;margin-top:6px"><span class="m" style="width:' + (pr.mastered / pr.total * 100) + '%"></span><span class="l" style="width:' + ((pr.learned - pr.mastered) / pr.total * 100) + '%"></span></div>' +
      '<p class="muted small num">' + pr.learned + '/' + pr.total + ' đã học · ' + pr.mastered + ' đã thuộc</p>' +
      '<div class="row" style="margin-top:8px">' +
      (newCount > 0 ? '<button class="btn primary lg" data-learn-start="' + n + '">' + I.play + 'Học ' + newCount + ' từ mới</button>'
        : '<button class="btn primary lg" data-learn-start="' + n + '" data-all="1">' + I.play + 'Học lại cả bài</button>') +
      '<button class="btn lg" data-cards-lesson="' + n + '">' + I.cards + 'Ôn bằng thẻ</button>' +
      '<button class="btn lg" data-quiz-lesson="' + n + '">' + I.quiz + 'Kiểm tra bài này</button>' +
      '</div></div>' +
      '<ul class="wlist">' + L.words.map(function (x) { return wordRowHTML(x); }).join('') + '</ul>'
    );
    $('#view').dataset.list = JSON.stringify(list);
  }

  function wordRowHTML(x, extra) {
    var st = status(x.w);
    return '<li class="wrow" data-word="' + esc(x.w) + '">' +
      '<span class="dot ' + st + '" title="' + STATUS_VI[st] + '"></span>' +
      '<div class="wmain"><div class="wline"><span class="hw">' + esc(x.w) + '</span><span class="pos">' + esc(x.pos) + '</span>' + (x.multi ? '<span class="tag multi">Đa nghĩa</span>' : '') + '</div>' +
      '<span class="vi">' + esc(x.vi) + '</span></div>' +
      '<div class="acts">' + (extra || '') + speakBtn(x.w) + starBtn(x.w) + '</div></li>';
  }

  function startLearn(n, all) {
    var L = LESSONS[n - 1];
    var ws = all ? L.words.slice() : L.words.filter(function (x) { return wp(x.w).box === 0; });
    if (!ws.length) { toast('Bài này đã học hết. Hãy ôn bằng thẻ hoặc làm bài kiểm tra.'); return; }
    learn.lesson = n;
    learn.s = { lesson: n, groups: chunk(ws, 5), gi: 0, phase: 'study', i: 0, queue: [], cur: null, doneQ: 0, total: 0 };
    renderLearnSession();
    if (P.settings.autoSpeak) speak(learn.s.groups[0][0].w);
  }

  function renderLearnSession() {
    var s = learn.s, group = s.groups[s.gi];
    var head = function (label, frac) {
      return '<div class="session-head"><button class="icon-btn" data-learn-exit aria-label="Thoát phiên học" title="Thoát (Esc)">' + I.x + '</button>' +
        '<div class="bar"><span class="a" style="width:' + (frac * 100) + '%"></span></div><span class="count">' + label + '</span></div>';
    };
    var groupLabel = 'Nhóm ' + (s.gi + 1) + '/' + s.groups.length;

    if (s.phase === 'study') {
      var x = group[s.i];
      setView('<div class="session-wrap">' + head(groupLabel + ' · Từ ' + (s.i + 1) + '/' + group.length, (s.gi * 5 + s.i) / (s.groups.reduce(function (a, g) { return a + g.length; }, 0) * 1)) +
        '<article class="study">' + wordInfoHTML(x) + '</article>' +
        '<div class="row between" style="margin-top:16px">' +
        '<button class="btn" data-study-nav="-1"' + (s.i === 0 ? ' disabled' : '') + '>' + I.left + 'Trước</button>' +
        (s.i < group.length - 1
          ? '<button class="btn primary lg" data-study-nav="1">Từ tiếp theo<kbd>→</kbd></button>'
          : '<button class="btn dark lg" data-study-check>Kiểm tra ' + group.length + ' từ vừa học<kbd>Enter</kbd></button>') +
        '</div></div>',
        function (e) {
          if (e.key === 'ArrowRight' || (e.key === 'Enter' && s.i < group.length - 1)) { studyNav(1); return true; }
          if (e.key === 'ArrowLeft') { studyNav(-1); return true; }
          if (e.key === 'Enter') { startCheck(); return true; }
          if (e.key === 'Escape') { exitLearn(); return true; }
          if (e.key === 'p' || e.key === 'P') { speak(x.w); return true; }
          if (e.key === 's' || e.key === 'S') { toggleStar(x.w); renderLearnSession(); return true; }
        });
      return;
    }

    if (s.phase === 'check') {
      var q = s.cur;
      setView('<div class="session-wrap">' + head(groupLabel + ' · Kiểm tra nhanh ' + (s.doneQ + 1) + '/' + s.total, s.doneQ / s.total) +
        '<div id="qbox"></div></div>', function (e) {
          if (e.key === 'Escape') { exitLearn(); return true; }
          return questionKeys(e);
        });
      mountQuestion($('#qbox'), q, function (ok) {
        if (!ok) { s.queue.push(makeQuestion(q.word, pick(['vi', 'en2', 'blank', 'def'].filter(function (t) { return t !== q.type; })))); s.total++; }
        s.doneQ++;
        logAct('rev'); save();
      }, function () { nextCheck(); });
      return;
    }

    if (s.phase === 'done') {
      var more = s.gi < s.groups.length - 1;
      setView('<div class="session-wrap">' + head(groupLabel + ' · Hoàn thành', 1) +
        '<div class="panel stack done-card">' +
        '<p class="eyebrow">Đã học xong nhóm ' + (s.gi + 1) + '</p>' +
        '<h2>+' + group.length + ' từ vào lịch ôn tập</h2>' +
        '<p class="muted">Các từ này sẽ xuất hiện lại trong mục Ôn tập vào ngày mai. Ôn đúng hạn là cách nhớ lâu nhất.</p>' +
        '<ul class="wlist" style="width:100%;text-align:left">' + group.map(function (x) { return wordRowHTML(x); }).join('') + '</ul>' +
        '<div class="row" style="justify-content:center">' +
        (more ? '<button class="btn primary lg" data-learn-next>Học 5 từ tiếp theo<kbd>Enter</kbd></button>' : '') +
        '<button class="btn lg" data-learn-exit>' + (more ? 'Dừng tại đây' : 'Về trang bài học') + '</button>' +
        '</div></div></div>',
        function (e) {
          if (e.key === 'Enter') { if (more) learnNextGroup(); else exitLearn(); return true; }
          if (e.key === 'Escape') { exitLearn(); return true; }
        });
    }
  }
  function studyNav(d) {
    var s = learn.s, g = s.groups[s.gi];
    var ni = s.i + d;
    if (ni < 0 || ni >= g.length) return;
    s.i = ni; renderLearnSession();
    if (P.settings.autoSpeak) speak(g[ni].w);
  }
  function startCheck() {
    var s = learn.s, g = s.groups[s.gi];
    s.phase = 'check';
    s.queue = shuffle(g).map(function (x) { return makeQuestion(x, pick(['vi', 'en2', 'blank', 'def'])); });
    s.total = s.queue.length; s.doneQ = 0;
    nextCheck();
  }
  function nextCheck() {
    var s = learn.s;
    if (!s.queue.length) {
      s.groups[s.gi].forEach(function (x) { markLearned(x.w); });
      s.phase = 'done'; renderNav(); renderLearnSession(); return;
    }
    s.cur = s.queue.shift();
    renderLearnSession();
  }
  function learnNextGroup() {
    var s = learn.s; s.gi++; s.phase = 'study'; s.i = 0; renderLearnSession();
    if (P.settings.autoSpeak) speak(s.groups[s.gi][0].w);
  }
  function exitLearn() { learn.s = null; renderNav(); render(); }

  /* ================= Câu hỏi (dùng chung) ================= */
  var QTYPES = {
    vi: { label: 'Nghĩa tiếng Việt', ask: 'Nghĩa tiếng Việt của từ này là gì?' },
    en2: { label: 'Chọn từ tiếng Anh', ask: 'Từ tiếng Anh nào mang nghĩa này?' },
    def: { label: 'Định nghĩa Anh–Anh', ask: 'Từ nào khớp với định nghĩa này?' },
    blank: { label: 'Điền từ (kiểu SAT)', ask: 'Chọn từ phù hợp nhất về logic và nghĩa để điền vào chỗ trống. (Đáp án ghi ở dạng gốc.)' },
    syn: { label: 'Từ đồng nghĩa', ask: 'Từ nào gần nghĩa nhất với từ trên?' },
    type: { label: 'Gõ chính tả', ask: 'Gõ từ tiếng Anh đúng với nghĩa và định nghĩa sau.' }
  };

  function conflict(a, b) {
    if (a === b) return true;
    if (a.synSet.has(b.w) || b.synSet.has(a.w)) return true;
    if (a.vi1 === b.vi1) return true;
    var hit = false;
    a.synSet.forEach(function (s) { if (b.synSet.has(s)) hit = true; });
    return hit;
  }
  function distractors(x, n, samePos) {
    var pool = shuffle(WORDS);
    var out = [];
    var ok = function (y) {
      if (out.indexOf(y) >= 0 || conflict(x, y)) return false;
      for (var i = 0; i < out.length; i++) if (conflict(out[i], y)) return false;
      return true;
    };
    if (samePos) pool.forEach(function (y) { if (out.length < n && y.pos1 === x.pos1 && ok(y)) out.push(y); });
    pool.forEach(function (y) { if (out.length < n && ok(y)) out.push(y); });
    return out;
  }
  function makeQuestion(x, type) {
    var q = { word: x, type: type };
    if (type === 'type') return q;
    if (type === 'syn') {
      var ds = distractors(x, 12, false).filter(function (y) { return !y.synList.some(function (s) { return x.synSet.has(s.toLowerCase()) || s.toLowerCase() === x.w; }); });
      var correct = pick(x.synList);
      var opts = [correct], used = new Set([correct.toLowerCase()]);
      ds.forEach(function (y) {
        if (opts.length >= 4) return;
        var s = pick(y.synList);
        if (!used.has(s.toLowerCase()) && s.toLowerCase() !== x.w) { used.add(s.toLowerCase()); opts.push(s); }
      });
      opts = shuffle(opts);
      q.options = opts.map(function (s) { return { text: s, isWord: true }; });
      q.answer = opts.indexOf(correct);
      return q;
    }
    var d = distractors(x, 3, type === 'blank' || type === 'def');
    var words = shuffle([x].concat(d));
    q.answer = words.indexOf(x);
    q.optWords = words;
    q.options = words.map(function (y) { return type === 'vi' ? { text: y.vi, isWord: false } : { text: y.w, isWord: true }; });
    return q;
  }

  function promptHTML(q) {
    var x = q.word;
    if (q.type === 'vi' || q.type === 'syn') return '<span class="word">' + esc(x.w) + '</span><div class="row"><span class="pos">' + esc(posLabel(x.pos)) + '</span>' + speakBtn(x.w) + '</div>';
    if (q.type === 'en2') return '<span class="vi-big">' + esc(x.vi) + '</span><span class="pos">' + esc(posLabel(x.pos)) + '</span>';
    if (q.type === 'def') return '<p class="def">“' + esc(x.en) + '”</p><span class="pos">' + esc(posLabel(x.pos)) + '</span>';
    if (q.type === 'blank') return '<p class="passage">' + exBlank(x.ex) + '</p>';
    if (q.type === 'type') return '<span class="vi-big">' + esc(x.vi) + '</span><p class="def">“' + esc(x.en) + '”</p>' +
      '<p class="hint-line" aria-label="Gợi ý: ' + x.w.length + ' chữ cái, bắt đầu bằng ' + esc(x.w[0]) + '">' + esc(x.w[0]) + ' ' + new Array(x.w.length).join('_ ') + '</p>';
    return '';
  }

  var activeQ = null;
  function mountQuestion(box, q, onAnswer, onNext, extraHead) {
    var x = q.word;
    var html = '<div class="q-card">' +
      '<div class="q-type"><span class="eyebrow">' + QTYPES[q.type].label + '</span>' + (extraHead || '') + '</div>' +
      '<div class="q-prompt">' + promptHTML(q) + '</div>' +
      '<p class="q-ask">' + QTYPES[q.type].ask + '</p>';
    if (q.type === 'type') {
      html += '<form class="typing" data-typing autocomplete="off"><input class="input" id="typeInput" type="text" autocapitalize="off" autocorrect="off" spellcheck="false" placeholder="Gõ từ tiếng Anh…" aria-label="Đáp án"><button class="btn dark" type="submit">Kiểm tra</button><button class="btn ghost" type="button" data-giveup>Không biết</button></form>';
    } else {
      html += '<div class="options">' + q.options.map(function (o, i) {
        return '<button class="opt" data-opt="' + i + '"><span class="bubble">' + 'ABCD'[i] + '</span><span class="otext' + (o.isWord ? ' w' : '') + '">' + esc(o.text) + '</span></button>';
      }).join('') + '</div>';
    }
    html += '<div id="fb"></div></div>';
    box.innerHTML = html;
    activeQ = { q: q, done: false, onAnswer: onAnswer, onNext: onNext, box: box };
    if (q.type === 'type') { var inp = $('#typeInput', box); if (inp) setTimeout(function () { inp.focus(); }, 30); }
  }

  function answerActive(i, typed) {
    var A = activeQ; if (!A || A.done) return;
    var q = A.q, x = q.word, ok, given;
    A.done = true;
    if (q.type === 'type') {
      given = (typed || '').trim();
      ok = given.toLowerCase() === x.w.toLowerCase();
      var inp = $('#typeInput', A.box);
      if (inp) { inp.disabled = true; inp.classList.add(ok ? 'ok' : 'bad'); }
      $$('.typing button', A.box).forEach(function (b) { b.disabled = true; });
    } else {
      ok = i === q.answer;
      given = q.options[i] ? q.options[i].text : '';
      $$('.opt', A.box).forEach(function (b, j) {
        b.disabled = true;
        if (j === q.answer) b.classList.add('correct');
        else if (j === i) b.classList.add('wrong');
        else b.classList.add('dim');
      });
    }
    A.ok = ok; A.given = given;
    A.onAnswer(ok, given);
    var fb = '<div class="feedback ' + (ok ? 'ok' : 'no') + '" role="status">' +
      '<span class="fb-title">' + (ok ? I.check + 'Chính xác!' : 'Chưa đúng' + (q.type === 'type' && given ? ' — bạn gõ “' + esc(given) + '”' : '')) + '</span>' +
      '<div class="fb-word"><span class="hw">' + esc(x.w) + '</span><span class="pos">' + esc(x.pos) + '</span><span>' + esc(x.vi) + '</span>' + speakBtn(x.w) + starBtn(x.w) + '</div>' +
      '<p class="fb-ex">' + exHTML(x.ex) + '</p>' +
      (x.note ? '<p class="small">' + esc(x.note) + '</p>' : '') +
      '</div>' +
      '<div class="row end"><button class="btn primary lg" data-qnext>Tiếp tục<kbd>Enter</kbd></button></div>';
    var box = $('#fb', A.box);
    box.innerHTML = fb;
    var nb = $('[data-qnext]', box); if (nb) nb.focus({ preventScroll: true });
    if (P.settings.autoSpeak) speak(x.w);
  }

  function questionKeys(e) {
    var A = activeQ; if (!A) return;
    if (A.done) {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); A.onNext(); return true; }
      return;
    }
    if (A.q.type === 'type') return;
    var k = e.key.toLowerCase();
    var map = { '1': 0, '2': 1, '3': 2, '4': 3, a: 0, b: 1, c: 2, d: 3 };
    if (k in map && map[k] < A.q.options.length) { answerActive(map[k]); return true; }
    if (k === 'p') { speak(A.q.word.w); return true; }
  }

  /* ================= Trang: Ôn tập (flashcard) ================= */
  var cards = { deck: 'due', lesson: 1, size: 30, s: null };
  function deckWords(deck, lesson) {
    switch (deck) {
      case 'due': return dueWords();
      case 'learned': return learnedWords();
      case 'star': return starredWords();
      case 'mistakes': return mistakeWords();
      case 'lesson': return LESSONS[(lesson || 1) - 1].words.slice();
      case 'all': return WORDS.slice();
    }
    return [];
  }
  var DECKS = [
    { id: 'due', name: 'Đến hạn hôm nay', sub: 'Theo lịch lặp lại ngắt quãng' },
    { id: 'learned', name: 'Tất cả từ đã học', sub: 'Ôn lại toàn bộ' },
    { id: 'star', name: 'Từ gắn sao', sub: 'Những từ bạn đánh dấu' },
    { id: 'mistakes', name: 'Sổ lỗi sai', sub: 'Từ từng trả lời sai' },
    { id: 'lesson', name: 'Theo bài', sub: 'Chọn một bài bên dưới' },
    { id: 'all', name: 'Cả 500 từ', sub: 'Luyện tự do, xáo trộn' }
  ];

  function viewReview() {
    if (cards.s) return renderCard();
    var due = dueWords().length;
    if (cards.deck === 'due' && !due && learnedWords().length === 0) cards.deck = 'lesson';
    var html = '<div class="page-head"><p class="eyebrow">Ôn tập</p><h1>Thẻ ghi nhớ</h1>' +
      '<p class="muted">Nhìn mặt trước, tự nhớ nghĩa, lật thẻ rồi tự chấm: <b>Quên</b>, <b>Khó</b>, <b>Nhớ</b> hoặc <b>Dễ</b>. Từ bạn nhớ tốt sẽ được hẹn ôn thưa dần (1 → 2 → 4 → 8 → 16 ngày…), từ bạn quên sẽ quay lại ngay.</p></div>' +
      '<div class="deck-grid">' + DECKS.map(function (d) {
        var n = deckWords(d.id, cards.lesson).length;
        return '<button class="deck" data-deck-pick="' + d.id + '" aria-pressed="' + (cards.deck === d.id) + '"' + (n === 0 ? ' disabled' : '') + '>' +
          '<div class="deck-top"><b>' + d.name + '</b><span class="n">' + n + '</span></div><span class="muted">' + d.sub + '</span></button>';
      }).join('') + '</div>' +
      '<div class="panel" style="margin-top:16px"><div class="opts">' +
      '<label class="field"><span>Bài (cho bộ “Theo bài”)</span><select class="input" id="cardLesson">' +
      LESSONS.map(function (L) { return '<option value="' + L.n + '"' + (L.n === cards.lesson ? ' selected' : '') + '>Bài ' + L.n + ': ' + esc(L.words[0].w) + ' – ' + esc(L.words[L.words.length - 1].w) + '</option>'; }).join('') +
      '</select></label>' +
      '<div class="field"><span>Mặt trước của thẻ</span><div class="seg" id="dirSeg">' +
      '<button data-dir="en" aria-pressed="' + (P.settings.dir === 'en') + '">Tiếng Anh</button>' +
      '<button data-dir="vi" aria-pressed="' + (P.settings.dir === 'vi') + '">Tiếng Việt</button>' +
      '<button data-dir="ex" aria-pressed="' + (P.settings.dir === 'ex') + '">Câu ví dụ</button></div></div>' +
      '<div class="field"><span>Số thẻ mỗi lượt</span><div class="seg" id="sizeSeg">' +
      [20, 30, 50, 0].map(function (n) { return '<button data-size="' + n + '" aria-pressed="' + (cards.size === n) + '">' + (n || 'Tất cả') + '</button>'; }).join('') +
      '</div></div>' +
      '</div>' +
      '<div class="row" style="margin-top:18px"><button class="btn primary lg" data-cards-start>' + I.play + 'Bắt đầu ôn</button>' +
      '<span class="muted small">Phím tắt: <span class="kbd">Space</span> lật thẻ · <span class="kbd">1</span>–<span class="kbd">4</span> chấm điểm · <span class="kbd">P</span> phát âm · <span class="kbd">S</span> gắn sao</span></div>' +
      '</div>';
    setView(html);
  }

  function startCards(deck, lesson) {
    if (deck) cards.deck = deck;
    if (lesson) cards.lesson = lesson;
    var ws = deckWords(cards.deck, cards.lesson);
    if (!ws.length) { toast('Bộ thẻ này đang trống.'); return false; }
    ws = shuffle(ws);
    if (cards.size) ws = ws.slice(0, cards.size);
    cards.s = { queue: ws, total: ws.length, done: 0, flipped: false, g: { 1: 0, 2: 0, 3: 0, 4: 0 }, again: {} };
    return true;
  }

  function renderCard() {
    var s = cards.s;
    if (!s.queue.length) {
      setView('<div class="session-wrap"><div class="panel stack done-card">' +
        '<p class="eyebrow">Hoàn thành lượt ôn</p><h2>Bạn đã ôn ' + s.done + ' thẻ</h2>' +
        '<div class="legend" style="justify-content:center">' +
        '<div><b style="color:var(--bad)">' + s.g[1] + '</b> quên</div><div><b style="color:var(--hard)">' + s.g[2] + '</b> khó</div>' +
        '<div><b style="color:var(--good)">' + s.g[3] + '</b> nhớ</div><div><b style="color:var(--accent)">' + s.g[4] + '</b> dễ</div></div>' +
        '<p class="muted">Các từ đã được hẹn lịch ôn tiếp theo. Thử kiểm tra để chắc chắn bạn dùng đúng từ trong câu.</p>' +
        '<div class="row" style="justify-content:center"><button class="btn primary lg" data-quick-quiz>' + I.quiz + 'Kiểm tra 10 câu</button>' +
        '<button class="btn lg" data-cards-exit>Về bộ thẻ</button></div></div></div>',
        function (e) { if (e.key === 'Escape' || e.key === 'Enter') { cards.s = null; render(); return true; } });
      return;
    }
    var x = s.queue[0], dir = P.settings.dir;
    var front = dir === 'vi'
      ? '<span class="vi-big">' + esc(x.vi) + '</span><span class="pos">' + esc(posLabel(x.pos)) + '</span>'
      : dir === 'ex'
        ? '<p class="passage" style="font-family:var(--f-display);font-size:1.25rem;line-height:1.6;max-width:30ch">' + exBlank(x.ex) + '</p><span class="muted small">Từ nào phù hợp? (' + esc(posLabel(x.pos)) + ')</span>'
        : '<span class="word">' + esc(x.w) + '</span><span class="pos">' + esc(posLabel(x.pos)) + '</span>';
    setView('<div class="session-wrap">' +
      '<div class="session-head"><button class="icon-btn" data-cards-exit aria-label="Kết thúc lượt ôn" title="Thoát (Esc)">' + I.x + '</button>' +
      '<div class="bar"><span class="a" style="width:' + (s.done / (s.done + s.queue.length) * 100) + '%"></span></div>' +
      '<span class="count">' + s.done + ' / ' + (s.done + s.queue.length) + '</span></div>' +
      '<div class="flash' + (s.flipped ? ' flipped' : '') + '" data-flip role="button" tabindex="0" aria-label="Lật thẻ">' +
      '<div class="flash-inner">' +
      '<div class="face front"><div class="corner">' + speakBtn(x.w) + starBtn(x.w) + '</div>' + front + '<span class="hint">Chạm để lật · Space</span></div>' +
      '<div class="face back"><div class="row"><span class="word" style="font-size:2rem">' + esc(x.w) + '</span><span class="pos">' + esc(posLabel(x.pos)) + '</span><div class="corner">' + speakBtn(x.w) + starBtn(x.w) + '</div></div>' +
      '<p class="vi-big">' + esc(x.vi) + '</p>' +
      '<p class="en" style="font-family:var(--f-display);font-style:italic;color:var(--ink-2)">' + esc(x.en) + '</p>' +
      '<blockquote class="example">' + exHTML(x.ex) + '</blockquote>' +
      synHTML(x) + noteHTML(x) +
      '</div></div></div>' +
      '<div id="cardCtl">' + cardCtlHTML() + '</div>' +
      '</div>', cardKeys);
    fitFlash();
  }
  function cardCtlHTML() {
    var s = cards.s, p = wp(s.queue[0].w);
    var pv = [1, 2, 3, 4].map(function (g) { return fmtDelta(nextState(p, g).due - Date.now()); });
    return s.flipped
      ? '<div class="grades">' +
      '<button class="grade g1" data-grade="1">Quên<small>' + pv[0] + '</small></button>' +
      '<button class="grade g2" data-grade="2">Khó<small>' + pv[1] + '</small></button>' +
      '<button class="grade g3" data-grade="3">Nhớ<small>' + pv[2] + '</small></button>' +
      '<button class="grade g4" data-grade="4">Dễ<small>' + pv[3] + '</small></button></div>'
      : '<div class="flip-row"><button class="btn dark lg" data-flip>Lật thẻ<kbd>Space</kbd></button></div>';
  }
  function fitFlash() {
    var inner = $('.flash-inner'); if (!inner) return;
    var h = 0;
    $$('.face', inner).forEach(function (f) { h = Math.max(h, f.scrollHeight); });
    inner.style.minHeight = Math.max(320, h) + 'px';
  }
  function flipCard() {
    var s = cards.s; if (!s || !s.queue.length) return;
    s.flipped = !s.flipped;
    var el = $('.flash'), ctl = $('#cardCtl');
    if (!el || !ctl) { renderCard(); return; }
    el.classList.toggle('flipped', s.flipped);
    ctl.innerHTML = cardCtlHTML();
    if (s.flipped && P.settings.autoSpeak) speak(s.queue[0].w);
  }
  function gradeCard(g) {
    var s = cards.s; if (!s || !s.flipped) return;
    var x = s.queue.shift();
    gradeWord(x.w, g);
    s.g[g]++; s.done++;
    s.flipped = false;
    if (g === 1) {
      s.again[x.w] = (s.again[x.w] || 0) + 1;
      if (s.again[x.w] <= 2) s.queue.splice(Math.min(s.queue.length, 3 + Math.floor(Math.random() * 3)), 0, x);
    }
    renderNav();
    renderCard();
  }
  function cardKeys(e) {
    if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); if (!cards.s.flipped) flipCard(); else if (e.key === 'Enter') gradeCard(3); return true; }
    if (/^[1-4]$/.test(e.key) && cards.s.flipped) { gradeCard(+e.key); return true; }
    if (e.key === 'ArrowUp' || e.key === 'ArrowDown') { flipCard(); return true; }
    var x = cards.s.queue[0];
    if (!x) return;
    if (e.key === 'p' || e.key === 'P') { speak(x.w); return true; }
    if (e.key === 's' || e.key === 'S') { toggleStar(x.w); renderCard(); return true; }
    if (e.key === 'Escape') { cards.s = null; render(); return true; }
  }

  /* ================= Trang: Kiểm tra ================= */
  var quiz = { scope: 'auto', n: 20, types: ['vi', 'en2', 'blank', 'def'], s: null, exitArm: false };
  function scopeWords(scope) {
    if (scope === 'auto') { var l = learnedWords(); return l.length >= 10 ? l : LESSONS[0].words.concat(l.filter(function (x) { return x.lesson !== 1; })); }
    if (scope === 'all') return WORDS.slice();
    if (scope === 'learned') return learnedWords();
    if (scope === 'star') return starredWords();
    if (scope === 'mistakes') return mistakeWords();
    if (scope === 'multi') return WORDS.filter(function (x) { return x.multi; });
    if (/^lv\d$/.test(scope)) return WORDS.filter(function (x) { return x.level === +scope[2] && !x.multi; });
    if (/^L\d+$/.test(scope)) return LESSONS[+scope.slice(1) - 1].words.slice();
    return [];
  }
  function scopeLabel(scope) {
    var m = {
      auto: 'Từ đã học (hoặc Bài 1 nếu chưa học đủ)', all: 'Cả 500 từ', learned: 'Tất cả từ đã học', star: 'Từ gắn sao', mistakes: 'Sổ lỗi sai',
      multi: 'Từ đa nghĩa', lv1: 'Cấp độ Cốt lõi', lv2: 'Cấp độ Nâng cao', lv3: 'Cấp độ Chuyên sâu'
    };
    return m[scope] || ('Bài ' + scope.slice(1));
  }

  function viewQuiz() {
    clearInterval(tickTimer);
    if (quiz.s) return quiz.s.finished ? renderQuizResult() : renderQuizQ();
    var n = scopeWords(quiz.scope).length;
    var opt = function (v, l, cnt) { return '<option value="' + v + '"' + (quiz.scope === v ? ' selected' : '') + (cnt === 0 ? ' disabled' : '') + '>' + l + ' (' + cnt + ')</option>'; };
    var html = '<div class="page-head"><p class="eyebrow">Kiểm tra</p><h1>Tự kiểm tra từ vựng</h1>' +
      '<p class="muted">Chọn phạm vi và dạng câu hỏi. Câu sai sẽ được ghi vào Sổ lỗi sai và đưa từ đó về lịch ôn sớm.</p></div>' +
      '<div class="quiz-layout"><div class="panel stack">' +
      '<label class="field"><span>Phạm vi từ</span><select class="input" id="qScope">' +
      '<optgroup label="Nhanh">' + opt('auto', 'Từ đã học', scopeWords('auto').length) + opt('all', 'Cả 500 từ', WORDS.length) + opt('star', 'Từ gắn sao', starredWords().length) + opt('mistakes', 'Sổ lỗi sai', mistakeWords().length) + opt('multi', 'Từ đa nghĩa (bẫy SAT)', scopeWords('multi').length) + '</optgroup>' +
      '<optgroup label="Theo cấp độ">' + opt('lv1', 'Cốt lõi', scopeWords('lv1').length) + opt('lv2', 'Nâng cao', scopeWords('lv2').length) + opt('lv3', 'Chuyên sâu', scopeWords('lv3').length) + '</optgroup>' +
      '<optgroup label="Theo bài">' + LESSONS.map(function (L) { return opt('L' + L.n, 'Bài ' + L.n + ': ' + L.words[0].w + ' – ' + L.words[L.words.length - 1].w, L.words.length); }).join('') + '</optgroup>' +
      '</select></label>' +
      '<div class="field"><span>Số câu hỏi</span><div class="seg" id="nSeg">' +
      [10, 20, 30, 50].map(function (v) { return '<button data-n="' + v + '" aria-pressed="' + (quiz.n === v) + '">' + v + '</button>'; }).join('') +
      '</div></div>' +
      '<div class="field"><span>Dạng câu hỏi</span><div class="chips" id="typeChips">' +
      Object.keys(QTYPES).map(function (t) { return '<button class="chip" data-qtype="' + t + '" aria-pressed="' + (quiz.types.indexOf(t) >= 0) + '">' + QTYPES[t].label + '</button>'; }).join('') +
      '</div></div>' +
      '<p class="muted small" id="scopeInfo">' + (n ? 'Sẽ tạo ' + Math.min(quiz.n, n * 2) + ' câu từ ' + n + ' từ.' : 'Phạm vi này đang trống.') + '</p>' +
      '<div class="row"><button class="btn primary lg" data-quiz-start' + (n ? '' : ' disabled') + '>' + I.play + 'Bắt đầu kiểm tra</button></div>' +
      '</div>' +
      '<aside class="panel tips"><p class="eyebrow">Mẹo làm Words in Context</p>' +
      '<ol><li>Che từ cần điền, đọc cả câu và tự đoán một từ phù hợp trước khi nhìn đáp án.</li>' +
      '<li>Tìm tín hiệu trong câu: từ nối tương phản (however, although) hay bổ sung (moreover, indeed) cho biết nghĩa cần tìm.</li>' +
      '<li>Thay từng đáp án vào câu. Đáp án đúng phải khớp cả nghĩa lẫn sắc thái tích cực/tiêu cực.</li>' +
      '<li>Cẩn thận từ đa nghĩa: đề thường hỏi nghĩa ít quen, ví dụ <i>novel</i> = mới lạ, <i>qualify</i> = giới hạn nhận định.</li>' +
      '<li>Đừng chọn đáp án chỉ vì nó “nghe khó”. Từ đơn giản mà đúng ngữ cảnh mới là đáp án.</li></ol></aside>' +
      '</div>';
    setView(html);
  }

  function startQuiz(scope, n, types) {
    if (scope) quiz.scope = scope;
    if (n) quiz.n = n;
    if (types) quiz.types = types;
    var pool = scopeWords(quiz.scope);
    if (!pool.length) { toast('Phạm vi này chưa có từ nào.'); return false; }
    if (!quiz.types.length) quiz.types = ['vi', 'en2', 'blank', 'def'];
    var count = Math.min(quiz.n, pool.length * 2);
    var qs = [], order = shuffle(pool), used = {};
    for (var i = 0; i < count; i++) {
      if (i > 0 && i % order.length === 0) order = shuffle(pool);
      var x = order[i % order.length];
      var avail = quiz.types.filter(function (t) { return !(used[x.w] === t); });
      var t = pick(avail.length ? avail : quiz.types);
      used[x.w] = t;
      qs.push(makeQuestion(x, t));
    }
    quiz.s = { qs: qs, i: 0, res: [], start: Date.now(), finished: false };
    quiz.exitArm = false;
    return true;
  }

  function renderQuizQ() {
    var s = quiz.s, q = s.qs[s.i];
    var right = s.res.filter(function (r) { return r.ok; }).length;
    setView('<div class="session-wrap">' +
      '<div class="session-head"><button class="btn ghost" data-quiz-exit title="Thoát (Esc)">' + I.x + '<span id="exitLbl">Thoát</span></button>' +
      '<div class="bar"><span class="a" style="width:' + (s.i / s.qs.length * 100) + '%"></span></div>' +
      '<span class="count">Câu ' + (s.i + 1) + '/' + s.qs.length + ' · <span style="color:var(--good)">' + right + ' đúng</span> · <span id="clock">' + clock(s) + '</span></span></div>' +
      '<div id="qbox"></div></div>', function (e) {
        if (e.key === 'Escape') { quizExit(); return true; }
        return questionKeys(e);
      });
    mountQuestion($('#qbox'), q, function (ok, given) {
      s.res.push({ q: q, ok: ok, given: given });
      recordAnswer(q.word.w, ok);
    }, function () {
      s.i++;
      if (s.i >= s.qs.length) { s.finished = true; s.end = Date.now(); renderNav(); renderQuizResult(); }
      else renderQuizQ();
    });
    clearInterval(tickTimer);
    tickTimer = setInterval(function () { var c = $('#clock'); if (c && quiz.s && !quiz.s.finished) c.textContent = clock(quiz.s); else clearInterval(tickTimer); }, 1000);
  }
  function clock(s) { var sec = Math.floor(((s.end || Date.now()) - s.start) / 1000); return Math.floor(sec / 60) + ':' + pad2(sec % 60); }
  function quizExit() {
    if (!quiz.exitArm) {
      quiz.exitArm = true;
      var l = $('#exitLbl'); if (l) l.textContent = 'Bấm lần nữa để thoát';
      setTimeout(function () { quiz.exitArm = false; var l2 = $('#exitLbl'); if (l2) l2.textContent = 'Thoát'; }, 3000);
      return;
    }
    quiz.s = null; clearInterval(tickTimer); renderNav(); render();
  }

  function renderQuizResult() {
    clearInterval(tickTimer);
    var s = quiz.s, total = s.res.length, right = s.res.filter(function (r) { return r.ok; }).length;
    var pct = total ? Math.round(right / total * 100) : 0;
    var msg = pct >= 90 ? 'Xuất sắc! Bạn nắm rất chắc nhóm từ này.' : pct >= 70 ? 'Tốt lắm! Ôn lại vài từ sai là ổn.' : pct >= 50 ? 'Khá. Hãy ôn thẻ các từ sai rồi làm lại.' : 'Cần ôn thêm. Học lại bằng thẻ trước khi kiểm tra tiếp.';
    var byType = {};
    s.res.forEach(function (r) { var t = r.q.type; byType[t] = byType[t] || { r: 0, n: 0 }; byType[t].n++; if (r.ok) byType[t].r++; });
    var wrongWords = [];
    s.res.forEach(function (r) { if (!r.ok && wrongWords.indexOf(r.q.word) < 0) wrongWords.push(r.q.word); });
    var html = '<div class="session-wrap stack">' +
      '<div class="panel stack"><p class="eyebrow">Kết quả · ' + esc(scopeLabel(quiz.scope)) + '</p>' +
      '<div class="score-hero"><span class="score-big">' + right + '<small>/' + total + '</small></span>' +
      '<div class="stack" style="gap:4px"><b style="font-size:1.15rem">' + pct + '% chính xác</b><span class="muted">' + msg + '</span><span class="muted small">Thời gian: ' + clock(s) + '</span></div></div>' +
      '<div class="bar"><span class="m" style="width:' + pct + '%"></span></div>' +
      '<div class="legend">' + Object.keys(byType).map(function (t) { return '<div>' + QTYPES[t].label + ': <b>' + byType[t].r + '/' + byType[t].n + '</b></div>'; }).join('') + '</div>' +
      '<div class="row">' +
      (wrongWords.length ? '<button class="btn primary" data-retry-wrong>Làm lại ' + wrongWords.length + ' từ sai</button><button class="btn" data-cards-wrong>' + I.cards + 'Ôn thẻ các từ sai</button>' : '') +
      '<button class="btn" data-quiz-again>Làm bài mới cùng phạm vi</button>' +
      '<button class="btn ghost" data-quiz-setup>Đổi cài đặt</button></div></div>' +
      '<h2>Xem lại từng câu</h2>' +
      '<ul class="review-list">' + s.res.map(function (r, i) {
        var x = r.q.word;
        var correctTxt = r.q.type === 'type' ? x.w : r.q.options[r.q.answer].text;
        return '<li class="review-item"><span class="mk ' + (r.ok ? 'ok' : 'no') + '">' + (i + 1) + '</span><div class="ri-body">' +
          '<div class="wline row" style="gap:8px"><button class="hw" style="background:none;border:0;padding:0;cursor:pointer;color:inherit" data-word="' + esc(x.w) + '">' + esc(x.w) + '</button><span class="pos">' + esc(x.pos) + '</span><span class="tag">' + QTYPES[r.q.type].label + '</span></div>' +
          '<span class="small">' + esc(x.vi) + '</span>' +
          (r.ok ? '' : '<span class="small">Bạn chọn: <span class="strike">' + esc(r.given || '(bỏ qua)') + '</span> · Đáp án: <b>' + esc(correctTxt) + '</b></span>') +
          '</div></li>';
      }).join('') + '</ul></div>';
    setView(html);
    quiz.lastWrong = wrongWords;
  }

  /* ================= Trang: Từ điển ================= */
  var filt = { q: '', level: 'all', status: 'all', lesson: 'all', star: false, sort: 'lesson' };
  function filteredWords() {
    var q = norm(filt.q.trim());
    var ws = WORDS.filter(function (x) {
      if (q && x.search.indexOf(q) < 0) return false;
      if (filt.level === 'multi' ? !x.multi : (filt.level !== 'all' && (x.level !== +filt.level || x.multi))) return false;
      if (filt.status !== 'all' && status(x.w) !== filt.status) return false;
      if (filt.lesson !== 'all' && x.lesson !== +filt.lesson) return false;
      if (filt.star && !wp(x.w).star) return false;
      return true;
    });
    if (filt.sort === 'az') ws.sort(byAlpha);
    else if (filt.sort === 'err') ws.sort(function (a, b) { return wp(b.w).x - wp(a.w).x || a.id - b.id; });
    if (q) ws.sort(function (a, b) { return (b.w.indexOf(q) === 0) - (a.w.indexOf(q) === 0); });
    return ws;
  }
  function viewWords() {
    var html = '<div class="page-head"><p class="eyebrow">Từ điển</p><h1>Tra cứu 500 từ</h1>' +
      '<p class="muted">Tìm theo từ tiếng Anh, nghĩa tiếng Việt (gõ có dấu hoặc không dấu) hoặc từ đồng nghĩa. Bấm vào một từ để xem chi tiết.</p></div>' +
      '<div class="filters">' +
      '<label class="field search"><span>Tìm kiếm</span><div style="position:relative">' + I.list + '<input class="input" id="wq" type="search" placeholder="vd: mitigate, giảm nhẹ, giam nhe…" value="' + esc(filt.q) + '"></div></label>' +
      '<label class="field"><span>Cấp độ</span><select class="input" id="wlevel">' +
      [['all', 'Tất cả'], ['1', 'Cốt lõi'], ['2', 'Nâng cao'], ['multi', 'Đa nghĩa'], ['3', 'Chuyên sâu']].map(function (o) { return '<option value="' + o[0] + '"' + (filt.level === o[0] ? ' selected' : '') + '>' + o[1] + '</option>'; }).join('') +
      '</select></label>' +
      '<label class="field"><span>Trạng thái</span><select class="input" id="wstatus">' +
      [['all', 'Tất cả'], ['new', 'Chưa học'], ['learning', 'Đang học'], ['mastered', 'Đã thuộc']].map(function (o) { return '<option value="' + o[0] + '"' + (filt.status === o[0] ? ' selected' : '') + '>' + o[1] + '</option>'; }).join('') +
      '</select></label>' +
      '<label class="field"><span>Bài</span><select class="input" id="wlesson"><option value="all">Tất cả bài</option>' +
      LESSONS.map(function (L) { return '<option value="' + L.n + '"' + (String(filt.lesson) === String(L.n) ? ' selected' : '') + '>Bài ' + L.n + '</option>'; }).join('') +
      '</select></label>' +
      '</div>' +
      '<div class="result-line"><span class="muted small num" id="wcount"></span>' +
      '<div class="row"><button class="chip" id="wstar" aria-pressed="' + filt.star + '">Chỉ từ gắn sao</button>' +
      '<div class="seg" id="wsort"><button data-sort="lesson" aria-pressed="' + (filt.sort === 'lesson') + '">Theo bài</button><button data-sort="az" aria-pressed="' + (filt.sort === 'az') + '">A–Z</button><button data-sort="err" aria-pressed="' + (filt.sort === 'err') + '">Hay sai</button></div></div></div>' +
      '<div id="wresults"></div>';
    setView(html, function (e) {
      if (e.key === '/' && document.activeElement !== $('#wq')) { e.preventDefault(); $('#wq').focus(); return true; }
    });
    renderWordList();
    var sEl = $('.search svg'); if (sEl) sEl.setAttribute('aria-hidden', 'true');
  }
  function renderWordList() {
    var ws = filteredWords();
    $('#wcount').textContent = ws.length + ' từ';
    var box = $('#wresults');
    if (!ws.length) { box.innerHTML = '<div class="panel empty">' + I.list + '<p>Không tìm thấy từ nào khớp bộ lọc.</p></div>'; return; }
    box.innerHTML = '<ul class="wlist">' + ws.map(function (x) {
      var e = wp(x.w).x;
      return wordRowHTML(x, e ? '<span class="errs" title="Số lần sai">' + e + ' sai</span>' : '');
    }).join('') + '</ul>';
    $('#view').dataset.list = JSON.stringify(ws.map(function (x) { return x.w; }));
  }

  /* ================= Trang: Sổ lỗi sai ================= */
  function viewMistakes() {
    var ws = mistakeWords();
    var html = '<div class="page-head"><p class="eyebrow">Sổ lỗi sai</p><h1>Những từ bạn hay nhầm</h1>' +
      '<p class="muted">Mỗi khi trả lời sai trong phần Kiểm tra, từ đó được ghi vào đây. Trả lời đúng từ đó <b>2 lần liên tiếp</b> thì nó tự rời khỏi sổ.</p></div>';
    if (!ws.length) {
      html += '<div class="panel empty">' + I.check + '<h2>Sổ lỗi sai đang trống</h2><p>Làm một bài kiểm tra để tìm ra những từ bạn còn nhầm.</p><button class="btn primary" data-quick-quiz>' + I.quiz + 'Kiểm tra 10 câu</button></div>';
    } else {
      html += '<div class="row" style="margin-bottom:14px"><button class="btn primary" data-cards-deck="mistakes">' + I.cards + 'Ôn thẻ ' + ws.length + ' từ này</button>' +
        '<button class="btn" data-quiz-scope="mistakes">' + I.quiz + 'Kiểm tra lại các từ này</button></div>' +
        '<ul class="wlist">' + ws.map(function (x) {
          var p = wp(x.w);
          return wordRowHTML(x, '<span class="errs" title="Số lần sai">' + p.x + ' sai</span>' + (p.fix ? '<span class="tag l1" title="Cần đúng thêm 1 lần">1/2 đúng</span>' : ''));
        }).join('') + '</ul>';
    }
    setView(html);
    if (ws.length) $('#view').dataset.list = JSON.stringify(ws.map(function (x) { return x.w; }));
  }

  /* ================= Trang: Cài đặt ================= */
  var resetArm = false;
  function viewSettings() {
    var S = P.settings;
    var segs = function (id, key, opts) {
      return '<div class="seg" id="' + id + '">' + opts.map(function (o) { return '<button data-set="' + key + '" data-val="' + o[0] + '" aria-pressed="' + (String(S[key]) === String(o[0])) + '">' + o[1] + '</button>'; }).join('') + '</div>';
    };
    var html = '<div class="page-head"><p class="eyebrow">Cài đặt</p><h1>Tùy chỉnh việc học</h1></div>' +
      '<div class="settings-grid">' +
      '<div class="panel stack"><h3>Học tập</h3>' +
      '<div class="field"><span>Mục tiêu mỗi ngày (lượt ôn/trả lời)</span>' + segs('sGoal', 'goal', [[10, '10'], [20, '20'], [40, '40'], [60, '60'], [100, '100']]) + '</div>' +
      '<div class="field"><span>Mặt trước thẻ ghi nhớ</span>' + segs('sDir', 'dir', [['en', 'Tiếng Anh'], ['vi', 'Tiếng Việt'], ['ex', 'Câu ví dụ']]) + '</div>' +
      '<div class="field"><span>Giao diện</span>' + segs('sTheme', 'theme', [['system', 'Theo hệ thống'], ['light', 'Sáng'], ['dark', 'Tối']]) + '</div>' +
      '</div>' +
      '<div class="panel stack"><h3>Phát âm</h3>' +
      '<div class="field"><span>Giọng đọc</span>' + segs('sAccent', 'accent', [['en-US', 'Anh – Mỹ'], ['en-GB', 'Anh – Anh']]) + '</div>' +
      '<div class="field"><span>Tốc độ đọc</span>' + segs('sRate', 'rate', [[0.7, 'Chậm'], [0.9, 'Vừa'], [1.1, 'Nhanh']]) + '</div>' +
      '<div class="field"><span>Tự động phát âm khi xem từ</span>' + segs('sAuto', 'autoSpeak', [[true, 'Bật'], [false, 'Tắt']]) + '</div>' +
      '<div class="row"><button class="btn" data-speak="ubiquitous">' + I.speak + 'Nghe thử “ubiquitous”</button></div>' +
      '</div>' +
      '<div class="panel stack"><h3>Sao lưu tiến độ</h3>' +
      '<p class="muted small">Tiến độ được lưu trong trình duyệt này. Để chuyển sang máy khác, sao chép mã bên dưới rồi dán vào ô “Khôi phục” ở máy kia.</p>' +
      '<textarea class="input" id="exportBox" readonly aria-label="Mã sao lưu">' + esc(JSON.stringify(P)) + '</textarea>' +
      '<div class="row"><button class="btn" data-copy-export>Sao chép mã</button><button class="btn ghost" data-download-export>Tải file .json</button></div>' +
      '</div>' +
      '<div class="panel stack"><h3>Khôi phục tiến độ</h3>' +
      '<textarea class="input" id="importBox" placeholder="Dán mã sao lưu vào đây…" aria-label="Dán mã khôi phục"></textarea>' +
      '<div class="row"><button class="btn dark" data-import>Khôi phục</button><label class="btn ghost" for="importFile">Chọn file .json</label><input type="file" id="importFile" accept=".json,application/json" hidden></div>' +
      '<p class="muted small" id="importMsg"></p>' +
      '</div>' +
      '<div class="panel stack"><h3>Phím tắt</h3><table class="kbd-table"><tbody>' +
      '<tr><td><span class="kbd">Space</span></td><td>Lật thẻ ghi nhớ</td></tr>' +
      '<tr><td><span class="kbd">1</span> <span class="kbd">2</span> <span class="kbd">3</span> <span class="kbd">4</span></td><td>Quên / Khó / Nhớ / Dễ (thẻ), chọn A–D (câu hỏi)</td></tr>' +
      '<tr><td><span class="kbd">Enter</span></td><td>Câu tiếp theo, tiếp tục</td></tr>' +
      '<tr><td><span class="kbd">P</span> · <span class="kbd">S</span></td><td>Phát âm · Gắn sao</td></tr>' +
      '<tr><td><span class="kbd">← →</span></td><td>Chuyển từ khi học từ mới</td></tr>' +
      '<tr><td><span class="kbd">/</span></td><td>Tìm kiếm trong Từ điển</td></tr>' +
      '<tr><td><span class="kbd">Esc</span></td><td>Thoát phiên học, đóng cửa sổ</td></tr>' +
      '</tbody></table></div>' +
      '<div class="panel stack"><h3>Xóa dữ liệu</h3><p class="muted small">Xóa toàn bộ tiến độ, từ gắn sao và sổ lỗi sai. Không thể hoàn tác.</p>' +
      '<div id="resetBox"><button class="btn danger" data-reset-arm>Xóa toàn bộ tiến độ</button></div></div>' +
      '</div>';
    setView(html);
  }

  /* ================= Điều hướng & sự kiện ================= */
  function render() {
    clearInterval(tickTimer);
    var r = route();
    renderNav();
    ({ home: viewHome, learn: viewLearn, review: viewReview, quiz: viewQuiz, words: viewWords, mistakes: viewMistakes, settings: viewSettings })[r]();
    window.scrollTo(0, 0);
  }

  function listFromView() { try { return JSON.parse($('#view').dataset.list || 'null'); } catch (e) { return null; } }

  document.addEventListener('click', function (e) {
    var t = e.target;
    var el;

    if ((el = t.closest('[data-speak]'))) { e.preventDefault(); e.stopPropagation(); speak(el.getAttribute('data-speak')); return; }
    if ((el = t.closest('[data-star]'))) {
      e.preventDefault(); e.stopPropagation();
      var w = el.getAttribute('data-star'), on = toggleStar(w);
      $$('[data-star="' + CSS.escape(w) + '"]').forEach(function (b) { b.classList.toggle('on', on); b.setAttribute('aria-pressed', on); });
      toast(on ? 'Đã gắn sao “' + w + '”' : 'Đã bỏ sao “' + w + '”');
      return;
    }

    /* Modal */
    var modal = $('#modal');
    if (!modal.hidden && modal.contains(t)) {
      if (t === modal || t.closest('[data-close]')) { closeModal(); return; }
      if ((el = t.closest('[data-mnav]'))) {
        var i = modalList.indexOf(modal.dataset.word) + +el.getAttribute('data-mnav');
        if (i >= 0 && i < modalList.length) openWord(modalList[i]);
        return;
      }
      if ((el = t.closest('[data-reset-word]'))) {
        var rw = el.getAttribute('data-reset-word'); var rp = wpSet(rw);
        rp.box = 0; rp.due = 0; save(); toast('Đã đưa “' + rw + '” về trạng thái chưa học'); openWord(rw); refreshBehindModal(); return;
      }
      if ((el = t.closest('[data-mark-known]'))) {
        var kw = el.getAttribute('data-mark-known'); var kp = wpSet(kw);
        kp.box = 4; kp.due = Date.now() + 8 * DAY; save(); toast('Đã đánh dấu “' + kw + '” là đã thuộc'); openWord(kw); refreshBehindModal(); return;
      }
      if ((el = t.closest('[data-word]'))) { openWord(el.getAttribute('data-word')); return; }
      return;
    }

    if ((el = t.closest('[data-word]')) && !t.closest('.opt')) {
      if (activeQ && !activeQ.done && $('#qbox') && $('#qbox').contains(el)) return;
      openWord(el.getAttribute('data-word'), listFromView());
      return;
    }

    /* Tổng quan / bài học */
    if ((el = t.closest('[data-lesson-go]'))) {
      e.preventDefault();
      learn.s = null; learn.lesson = +el.getAttribute('data-lesson-go');
      go('learn'); return;
    }
    if (t.closest('[data-lesson-back]')) { learn.lesson = null; render(); return; }
    if ((el = t.closest('[data-learn-start]'))) { startLearn(+el.getAttribute('data-learn-start'), el.hasAttribute('data-all')); return; }
    if ((el = t.closest('[data-study-nav]'))) { studyNav(+el.getAttribute('data-study-nav')); return; }
    if (t.closest('[data-study-check]')) { startCheck(); return; }
    if (t.closest('[data-learn-next]')) { learnNextGroup(); return; }
    if (t.closest('[data-learn-exit]')) { exitLearn(); return; }
    if ((el = t.closest('[data-cards-lesson]'))) { cards.size = 0; if (startCards('lesson', +el.getAttribute('data-cards-lesson'))) go('review'); return; }
    if ((el = t.closest('[data-quiz-lesson]'))) { if (startQuiz('L' + el.getAttribute('data-quiz-lesson'), 20)) go('quiz'); return; }

    /* Câu hỏi */
    if ((el = t.closest('[data-opt]'))) { answerActive(+el.getAttribute('data-opt')); return; }
    if (t.closest('[data-giveup]')) { answerActive(-1, ''); return; }
    if (t.closest('[data-qnext]')) { if (activeQ && activeQ.done) activeQ.onNext(); return; }

    /* Thẻ ghi nhớ */
    if ((el = t.closest('[data-deck]'))) { e.preventDefault(); if (startCards(el.getAttribute('data-deck'))) go('review'); return; }
    if ((el = t.closest('[data-deck-pick]'))) { cards.deck = el.getAttribute('data-deck-pick'); viewReview(); return; }
    if ((el = t.closest('[data-dir]'))) { P.settings.dir = el.getAttribute('data-dir'); save(); viewReview(); return; }
    if ((el = t.closest('[data-size]'))) { cards.size = +el.getAttribute('data-size'); viewReview(); return; }
    if (t.closest('[data-cards-start]')) { if (startCards()) renderCard(); return; }
    if (t.closest('[data-cards-exit]')) { cards.s = null; render(); return; }
    if ((el = t.closest('[data-cards-deck]'))) { cards.size = 0; if (startCards(el.getAttribute('data-cards-deck'))) go('review'); return; }
    if ((el = t.closest('[data-grade]'))) { gradeCard(+el.getAttribute('data-grade')); return; }
    if (t.closest('[data-flip]')) { flipCard(); return; }

    /* Kiểm tra */
    if (t.closest('[data-quick-quiz]')) { if (startQuiz('auto', 10, ['vi', 'en2', 'blank', 'def'])) go('quiz'); return; }
    if ((el = t.closest('[data-n]'))) { quiz.n = +el.getAttribute('data-n'); viewQuiz(); return; }
    if ((el = t.closest('[data-qtype]'))) {
      var qt = el.getAttribute('data-qtype'), ix = quiz.types.indexOf(qt);
      if (ix >= 0) { if (quiz.types.length > 1) quiz.types.splice(ix, 1); else toast('Cần chọn ít nhất một dạng câu hỏi.'); }
      else quiz.types.push(qt);
      viewQuiz(); return;
    }
    if (t.closest('[data-quiz-start]')) { if (startQuiz()) renderQuizQ(); return; }
    if (t.closest('[data-quiz-exit]')) { quizExit(); return; }
    if (t.closest('[data-quiz-again]')) { if (startQuiz()) renderQuizQ(); return; }
    if (t.closest('[data-quiz-setup]')) { quiz.s = null; viewQuiz(); return; }
    if (t.closest('[data-retry-wrong]')) {
      var ww = quiz.lastWrong || [];
      quiz.s = { qs: shuffle(ww).map(function (x) { return makeQuestion(x, pick(quiz.types)); }), i: 0, res: [], start: Date.now(), finished: false };
      renderQuizQ(); return;
    }
    if (t.closest('[data-cards-wrong]')) {
      var cw = shuffle(quiz.lastWrong || []);
      cards.s = { queue: cw, total: cw.length, done: 0, flipped: false, g: { 1: 0, 2: 0, 3: 0, 4: 0 }, again: {} };
      quiz.s = null; go('review'); return;
    }
    if ((el = t.closest('[data-quiz-scope]'))) { quiz.scope = el.getAttribute('data-quiz-scope'); quiz.s = null; go('quiz'); return; }

    /* Từ điển */
    if ((el = t.closest('[data-sort]'))) { filt.sort = el.getAttribute('data-sort'); $$('#wsort button').forEach(function (b) { b.setAttribute('aria-pressed', b === el); }); renderWordList(); return; }
    if (t.closest('#wstar')) { filt.star = !filt.star; $('#wstar').setAttribute('aria-pressed', filt.star); renderWordList(); return; }

    /* Cài đặt */
    if ((el = t.closest('[data-set]'))) {
      var key = el.getAttribute('data-set'), val = el.getAttribute('data-val');
      P.settings[key] = key === 'goal' || key === 'rate' ? +val : key === 'autoSpeak' ? val === 'true' : val;
      save();
      if (key === 'theme') applyTheme();
      viewSettings(); toast('Đã lưu cài đặt'); return;
    }
    if (t.closest('[data-copy-export]')) {
      var box = $('#exportBox'), txt = JSON.stringify(P);
      box.value = txt;
      try {
        navigator.clipboard.writeText(txt).then(function () { toast('Đã sao chép mã sao lưu'); }, function () { box.select(); toast('Hãy nhấn Ctrl+C (hoặc Cmd+C) để sao chép'); });
      } catch (err) { box.select(); toast('Hãy nhấn Ctrl+C (hoặc Cmd+C) để sao chép'); }
      return;
    }
    if (t.closest('[data-download-export]')) {
      try {
        var blob = new Blob([JSON.stringify(P, null, 1)], { type: 'application/json' });
        var a = document.createElement('a');
        a.href = URL.createObjectURL(blob); a.download = 'sat500-tien-do-' + dayKey() + '.json';
        document.body.appendChild(a); a.click(); a.remove();
        toast('Nếu file không tải về, hãy dùng “Sao chép mã”.');
      } catch (err) { toast('Không tải được file — hãy dùng “Sao chép mã”.'); }
      return;
    }
    if (t.closest('[data-import]')) { importData($('#importBox').value); return; }
    if (t.closest('[data-reset-arm]')) {
      $('#resetBox').innerHTML = '<div class="confirm-row"><b>Chắc chắn xóa hết?</b><button class="btn danger solid" data-reset-do>Xóa hẳn</button><button class="btn ghost" data-reset-cancel>Hủy</button></div>';
      return;
    }
    if (t.closest('[data-reset-cancel]')) { viewSettings(); return; }
    if (t.closest('[data-reset-do]')) {
      var keep = P.settings; P = defaults(); P.settings = keep; save();
      learn = { lesson: null, s: null }; cards.s = null; quiz.s = null;
      toast('Đã xóa toàn bộ tiến độ'); renderNav(); viewSettings(); return;
    }
  });

  function refreshBehindModal() {
    var r = route();
    if (r === 'words') renderWordList();
    else if (r === 'learn' && !learn.s && learn.lesson) { viewLesson(learn.lesson); }
    else if (r === 'mistakes' || r === 'home') render();
    renderNav();
  }

  function importData(txt) {
    var msg = $('#importMsg');
    try {
      var d = JSON.parse(txt);
      if (!d || typeof d !== 'object' || !d.w) throw new Error('bad');
      P.w = d.w; P.days = d.days || {}; Object.assign(P.settings, d.settings || {});
      save(); applyTheme(); renderNav();
      msg.textContent = 'Đã khôi phục tiến độ của ' + Object.keys(P.w).length + ' từ.';
      toast('Khôi phục thành công');
    } catch (e) {
      msg.textContent = 'Mã không hợp lệ. Hãy dán đúng toàn bộ nội dung đã sao chép từ mục Sao lưu.';
    }
  }

  document.addEventListener('change', function (e) {
    var t = e.target;
    if (t.id === 'cardLesson') { cards.lesson = +t.value; cards.deck = 'lesson'; viewReview(); }
    else if (t.id === 'qScope') { quiz.scope = t.value; viewQuiz(); }
    else if (t.id === 'wlevel') { filt.level = t.value; renderWordList(); }
    else if (t.id === 'wstatus') { filt.status = t.value; renderWordList(); }
    else if (t.id === 'wlesson') { filt.lesson = t.value; renderWordList(); }
    else if (t.id === 'importFile' && t.files && t.files[0]) {
      var fr = new FileReader();
      fr.onload = function () { $('#importBox').value = fr.result; importData(fr.result); };
      fr.readAsText(t.files[0]);
    }
  });
  document.addEventListener('input', function (e) {
    if (e.target.id === 'wq') { filt.q = e.target.value; renderWordList(); }
  });
  document.addEventListener('submit', function (e) {
    var f = e.target;
    if (f.hasAttribute('data-typing')) { e.preventDefault(); var v = $('#typeInput').value; if (v.trim()) answerActive(-1, v); }
  });
  document.addEventListener('keydown', function (e) {
    if (e.ctrlKey || e.metaKey || e.altKey) return;
    var m = $('#modal');
    if (!m.hidden) {
      if (e.key === 'Escape') { closeModal(); e.preventDefault(); }
      else if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') { var b = $('[data-mnav="' + (e.key === 'ArrowRight' ? 1 : -1) + '"]', m); if (b && !b.disabled) b.click(); }
      return;
    }
    var tag = (e.target.tagName || '').toLowerCase();
    var typing = tag === 'input' || tag === 'textarea' || tag === 'select';
    if (typing) {
      if (e.key === 'Enter' && activeQ && activeQ.done && e.target.id === 'typeInput') { e.preventDefault(); activeQ.onNext(); }
      return;
    }
    if (tag === 'button' && (e.key === 'Enter' || e.key === ' ') && !e.target.closest('.flash')) {
      if (!(activeQ && activeQ.done && e.target.hasAttribute('data-qnext'))) return;
    }
    if (keyHandler && keyHandler(e)) e.preventDefault();
  });

  window.addEventListener('hashchange', function () { closeModal(); render(); });
  window.addEventListener('resize', function () { if (cards.s && route() === 'review') fitFlash(); });

  applyTheme();
  if (!WORDS.length) { $('#view').innerHTML = '<div class="panel empty"><p>Không tải được dữ liệu từ vựng.</p></div>'; return; }
  render();
})();
