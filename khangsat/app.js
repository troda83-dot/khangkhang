/* KHANGSAT — web làm đề Digital SAT Reading and Writing.
 * Không cần server: đề nằm trong tests/*.js, tiến độ lưu trong localStorage. */
(function () {
  'use strict';

  var TESTS = window.KHANGSAT_TESTS || [];
  var KEY = 'khangsat.v1';
  var LETTERS = ['A', 'B', 'C', 'D'];

  var SKILLS = {
    wic:   { d: 'cs',  vi: 'Từ vựng trong ngữ cảnh',     en: 'Words in Context' },
    tsp:   { d: 'cs',  vi: 'Cấu trúc & mục đích',        en: 'Text Structure and Purpose' },
    ctc:   { d: 'cs',  vi: 'Liên hệ hai đoạn văn',       en: 'Cross-Text Connections' },
    cid:   { d: 'ii',  vi: 'Ý chính & chi tiết',         en: 'Central Ideas and Details' },
    coet:  { d: 'ii',  vi: 'Bằng chứng từ văn bản',      en: 'Command of Evidence: Textual' },
    coeq:  { d: 'ii',  vi: 'Bằng chứng từ bảng, biểu đồ', en: 'Command of Evidence: Quantitative' },
    inf:   { d: 'ii',  vi: 'Suy luận',                   en: 'Inferences' },
    bound: { d: 'sec', vi: 'Dấu câu & ranh giới câu',    en: 'Boundaries' },
    fss:   { d: 'sec', vi: 'Hình thái & cấu trúc câu',   en: 'Form, Structure, and Sense' },
    trans: { d: 'ei',  vi: 'Từ nối',                     en: 'Transitions' },
    rs:    { d: 'ei',  vi: 'Tổng hợp ghi chú',           en: 'Rhetorical Synthesis' }
  };
  var DOMAINS = [
    { id: 'cs',  vi: 'Kỹ năng đọc & cấu trúc', en: 'Craft and Structure' },
    { id: 'ii',  vi: 'Thông tin & ý tưởng',    en: 'Information and Ideas' },
    { id: 'sec', vi: 'Quy tắc ngữ pháp',       en: 'Standard English Conventions' },
    { id: 'ei',  vi: 'Diễn đạt ý',             en: 'Expression of Ideas' }
  ];

  var I = {
    clock: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>',
    list: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 6h11M9 12h11M9 18h11M4 6h.01M4 12h.01M4 18h.01"/></svg>',
    book: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 5a2 2 0 0 1 2-2h13v16H6a2 2 0 0 0-2 2z"/><path d="M4 19V5"/></svg>',
    bulb: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18h6M10 22h4M12 2a7 7 0 0 0-4 12.7V16h8v-1.3A7 7 0 0 0 12 2z"/></svg>',
    flag: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 21V4h11l-2 4 2 4H5"/></svg>',
    up: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M6 15l6-6 6 6"/></svg>',
    left: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 6l-6 6 6 6"/></svg>',
    right: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 6l6 6-6 6"/></svg>',
    ok: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg>',
    no: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M6 6l12 12M18 6L6 18"/></svg>',
    dash: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round"><path d="M6 12h12"/></svg>',
    moon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/></svg>',
    sun: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>',
    home: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 11l9-7 9 7v9a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z"/></svg>',
    redo: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12a9 9 0 1 0 3-6.7L3 8"/><path d="M3 3v5h5"/></svg>'
  };

  /* ---------- storage ---------- */
  var store = { active: null, history: [], theme: 'system' };
  try {
    var raw = JSON.parse(localStorage.getItem(KEY) || 'null');
    if (raw && typeof raw === 'object') {
      store.active = raw.active || null;
      store.history = Array.isArray(raw.history) ? raw.history : [];
      store.theme = raw.theme || 'system';
    }
  } catch (e) { /* bộ nhớ trình duyệt bị chặn: vẫn chạy bình thường */ }
  function save() {
    try { localStorage.setItem(KEY, JSON.stringify(store)); } catch (e) { /* bỏ qua */ }
  }

  /* ---------- theme ---------- */
  var root = document.documentElement;
  var hostTheme = root.getAttribute('data-theme');
  function isDark() {
    var t = root.getAttribute('data-theme');
    if (t) return t === 'dark';
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  }
  function applyTheme() {
    if (store.theme === 'system') {
      if (hostTheme) root.setAttribute('data-theme', hostTheme); else root.removeAttribute('data-theme');
    } else root.setAttribute('data-theme', store.theme);
  }
  function toggleTheme() {
    store.theme = isDark() ? 'light' : 'dark';
    applyTheme(); save(); render();
  }
  applyTheme();

  /* ---------- helpers ---------- */
  var app = document.getElementById('app');
  var toastEl = document.getElementById('toast');
  var toastTimer;
  function toast(msg) {
    toastEl.textContent = msg; toastEl.hidden = false;
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { toastEl.hidden = true; }, 2600);
  }
  function esc(s) {
    return String(s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; });
  }
  function fmt(s) {
    return String(s)
      .replace(/\[u\]/g, '<u>').replace(/\[\/u\]/g, '</u>')
      .replace(/\*([^*]+)\*/g, '<i>$1</i>')
      .replace(/_{4,}/g, '<span class="blank" role="img" aria-label="chỗ trống"></span>');
  }
  function mmss(sec) {
    sec = Math.max(0, Math.round(sec));
    var m = Math.floor(sec / 60), s = sec % 60;
    return m + ':' + (s < 10 ? '0' : '') + s;
  }
  function testById(id) { for (var i = 0; i < TESTS.length; i++) if (TESTS[i].id === id) return TESTS[i]; return null; }
  function qByN(test, n) { for (var i = 0; i < test.questions.length; i++) if (test.questions[i].n === n) return test.questions[i]; return null; }
  function uid() { return Date.now().toString(36) + Math.random().toString(36).slice(2, 6); }
  function scaled(correct, total) { return Math.round((200 + 600 * correct / total) / 10) * 10; }
  function dateStr(ts) {
    var d = new Date(ts);
    return d.getDate() + '/' + (d.getMonth() + 1) + '/' + d.getFullYear() + ' · ' + d.getHours() + ':' + (d.getMinutes() < 10 ? '0' : '') + d.getMinutes();
  }

  /* ---------- view state ---------- */
  var V = { name: 'home', resultId: null, reviewIdx: 0, filter: 'all', navOpen: false, confirm: false };
  var tick = null;

  function go(name, extra) {
    V.name = name; V.navOpen = false; V.confirm = false;
    if (extra) for (var k in extra) V[k] = extra[k];
    render();
    window.scrollTo(0, 0);
  }

  /* ---------- session ---------- */
  function startSession(test, mode, subset) {
    store.active = {
      id: uid(), testId: test.id, mode: mode,
      order: subset || test.questions.map(function (q) { return q.n; }),
      answers: {}, marked: {}, elim: {}, checked: {},
      idx: 0, timeLeft: test.minutes * 60, elapsed: 0, startedAt: Date.now(),
      hideTimer: false, elimMode: false, retry: !!subset
    };
    save();
    go('exam');
  }
  function S() { return store.active; }
  function curQ() { var s = S(); return qByN(testById(s.testId), s.order[s.idx]); }

  function startTick() {
    stopTick();
    tick = setInterval(function () {
      var s = S(); if (!s) return stopTick();
      s.elapsed += 1;
      if (s.mode === 'exam') {
        s.timeLeft -= 1;
        if (s.timeLeft <= 0) { s.timeLeft = 0; save(); toast('Hết giờ! Bài đã được nộp tự động.'); submit(); return; }
      }
      if (s.elapsed % 5 === 0) save();
      paintTimer();
    }, 1000);
  }
  function stopTick() { if (tick) { clearInterval(tick); tick = null; } }
  function paintTimer() {
    var el = document.getElementById('timer'); if (!el) return;
    var s = S();
    if (s.hideTimer) { el.textContent = '—:—'; el.classList.remove('warn'); return; }
    var sec = s.mode === 'exam' ? s.timeLeft : s.elapsed;
    el.textContent = mmss(sec);
    el.classList.toggle('warn', s.mode === 'exam' && sec <= 300);
  }

  function submit() {
    var s = S(); if (!s) return;
    stopTick();
    var test = testById(s.testId);
    var correct = 0;
    s.order.forEach(function (n) { if (s.answers[n] === qByN(test, n).a) correct++; });
    var entry = {
      id: s.id, testId: s.testId, mode: s.mode, date: Date.now(), order: s.order,
      answers: s.answers, marked: s.marked, elapsed: s.elapsed, correct: correct, total: s.order.length, retry: s.retry
    };
    store.history.unshift(entry);
    store.history = store.history.slice(0, 30);
    store.active = null;
    save();
    document.body.classList.remove('in-exam');
    go('result', { resultId: entry.id, filter: 'all' });
  }

  /* ---------- render ---------- */
  function render() {
    if (V.name !== 'exam' && V.name !== 'check') stopTick();
    document.body.classList.toggle('in-exam', V.name === 'exam' || V.name === 'check' || V.name === 'review');
    if (V.name === 'exam') { if (!S()) return go('home'); renderExam(); if (!tick) startTick(); paintTimer(); }
    else if (V.name === 'check') { if (!S()) return go('home'); renderCheck(); if (!tick) startTick(); paintTimer(); }
    else if (V.name === 'result') renderResult();
    else if (V.name === 'review') renderReview();
    else renderHome();
  }

  function topbar() {
    return '<header class="topbar"><div class="topbar-inner">' +
      '<button class="brand" data-act="home" style="border:0;background:none;cursor:pointer;padding:0">KHANG<b>SAT</b></button>' +
      '<span class="brand-tag">Luyện đề Digital SAT</span><span class="spacer"></span>' +
      '<button class="icon-btn" data-act="theme" aria-label="Đổi giao diện sáng/tối" title="Sáng / tối">' + (isDark() ? I.sun : I.moon) + '</button>' +
      '</div></header>';
  }

  function domainCounts(test, order) {
    var c = { cs: 0, ii: 0, sec: 0, ei: 0 };
    (order || test.questions.map(function (q) { return q.n; })).forEach(function (n) { c[SKILLS[qByN(test, n).skill].d]++; });
    return c;
  }

  function renderHome() {
    var h = topbar() + '<main class="home" id="main">';
    h += '<div class="home-head"><span class="eyebrow">Reading and Writing</span>' +
      '<h1>Làm đề SAT như thi thật, chấm điểm và giải thích từng câu</h1>' +
      '<p>Chọn chế độ thi thử có đồng hồ đếm ngược, hoặc luyện tập để xem đáp án và lời giải tiếng Việt ngay sau mỗi câu.</p></div>';

    var s = S();
    if (s) {
      var t = testById(s.testId);
      var done = s.order.filter(function (n) { return s.answers[n]; }).length;
      h += '<section class="card resume" aria-label="Bài đang làm dở"><div class="grow">' +
        '<span class="eyebrow">Đang làm dở</span><strong>' + esc(t ? t.title : '') + ' · ' + (s.mode === 'exam' ? 'Thi thử' : 'Luyện tập') + '</strong>' +
        '<span class="small muted">Đã trả lời ' + done + '/' + s.order.length + ' câu' +
        (s.mode === 'exam' ? ' · còn <span class="num">' + mmss(s.timeLeft) + '</span>' : '') + '</span></div>' +
        '<div class="row"><button class="btn ghost danger" data-act="discard">Bỏ bài này</button>' +
        '<button class="btn primary" data-act="resume">Làm tiếp</button></div></section>';
    }

    h += '<div class="home-grid"><div class="stack">';
    TESTS.forEach(function (test) {
      var dc = domainCounts(test), total = test.questions.length;
      h += '<article class="card test-card"><div class="booklet">' +
        '<span class="eyebrow">' + esc(test.subtitle) + '</span><h2>' + esc(test.title) + '</h2>' +
        '<div class="meta"><span>' + I.list + total + ' câu</span><span>' + I.clock + test.minutes + ' phút</span><span>' + I.book + 'Module 1</span></div>' +
        '<div class="comp"><div class="comp-bar" aria-hidden="true">' +
        DOMAINS.map(function (d) { return '<i class="d-' + d.id + '" style="width:' + (dc[d.id] / total * 100) + '%"></i>'; }).join('') +
        '</div><div class="comp-legend">' +
        DOMAINS.map(function (d) { return '<span><i class="d-' + d.id + '"></i>' + d.vi + '<b>' + dc[d.id] + '</b></span>'; }).join('') +
        '</div></div></div>' +
        '<div class="modes">' +
        '<button class="mode main" data-act="start" data-test="' + test.id + '" data-mode="exam"><strong>' + I.clock + 'Thi thử</strong><span>Đếm ngược ' + test.minutes + ' phút, chấm điểm khi nộp bài.</span></button>' +
        '<button class="mode" data-act="start" data-test="' + test.id + '" data-mode="practice"><strong>' + I.bulb + 'Luyện tập</strong><span>Không giới hạn giờ, kiểm tra đáp án và đọc lời giải từng câu.</span></button>' +
        '</div></article>';
    });
    h += '</div><aside class="side">';

    h += '<section class="card panel"><h3>Lịch sử làm bài</h3>';
    if (!store.history.length) h += '<p class="empty-note">Chưa có bài nào. Kết quả sẽ được lưu ở đây sau khi bạn nộp bài.</p>';
    else {
      h += '<ul class="hist">' + store.history.slice(0, 8).map(function (e) {
        var t = testById(e.testId);
        return '<li><button data-act="open-result" data-id="' + e.id + '"><span class="t">' + esc(t ? t.title : e.testId) +
          (e.retry ? ' · làm lại câu sai' : (e.mode === 'exam' ? ' · thi thử' : ' · luyện tập')) + '</span>' +
          '<span class="sc">' + e.correct + '/' + e.total + '</span><span class="d">' + dateStr(e.date) + '</span></button></li>';
      }).join('') + '</ul>';
    }
    h += '</section>';

    h += '<section class="card panel"><h3>Phím tắt khi làm bài</h3><ul class="tips">' +
      '<li><span><kbd>A</kbd>–<kbd>D</kbd></span><span>Chọn đáp án (hoặc <kbd>1</kbd>–<kbd>4</kbd>)</span></li>' +
      '<li><span><kbd>←</kbd><kbd>→</kbd></span><span>Câu trước / câu sau</span></li>' +
      '<li><span><kbd>M</kbd></span><span>Đánh dấu câu để xem lại</span></li>' +
      '<li><span><kbd>Enter</kbd></span><span>Luyện tập: kiểm tra đáp án, rồi sang câu tiếp</span></li>' +
      '</ul><p class="small muted">Bật nút <b style="text-decoration:line-through">ABC</b> để gạch bỏ các đáp án đã loại, giống Bluebook.</p></section>';
    h += '</aside></div></main>';
    app.innerHTML = h;
  }

  /* ----- passage / figure ----- */
  function tableHTML(t) {
    var numCol = t.head.length - 1;
    return '<figure class="fig" style="margin:0"><figcaption class="fig-title">' + esc(t.title) + '</figcaption><div class="fig-scroll"><table><thead><tr>' +
      t.head.map(function (x) { return '<th scope="col">' + esc(x) + '</th>'; }).join('') + '</tr></thead><tbody>' +
      t.rows.map(function (r) {
        return '<tr>' + r.map(function (x, i) { return '<td' + (i === numCol && /^[−\-\d.,\s]+$/.test(x) ? ' class="n"' : '') + '>' + esc(x) + '</td>'; }).join('') + '</tr>';
      }).join('') + '</tbody></table></div>' + (t.note ? '<p class="fig-note">' + esc(t.note) + '</p>' : '') + '</figure>';
  }
  function chartHTML(c) {
    var W = 360, H = 250, L = 46, R = 10, T = 12, B = 34;
    var pw = W - L - R, ph = H - T - B;
    var y = function (v) { return T + ph - v / c.yMax * ph; };
    var colors = ['var(--bar-1)', 'var(--bar-2)', 'var(--bar-3)'];
    var g = '';
    for (var v = 0; v <= c.yMax; v += c.yStep) {
      g += '<line class="grid" x1="' + L + '" x2="' + (W - R) + '" y1="' + y(v) + '" y2="' + y(v) + '"/>' +
        '<text x="' + (L - 6) + '" y="' + (y(v) + 4) + '" text-anchor="end">' + v + '</text>';
    }
    var gw = pw / c.groups.length, bw = Math.min(34, (gw * 0.7) / c.series.length);
    c.groups.forEach(function (name, gi) {
      var x0 = L + gi * gw + (gw - bw * c.series.length) / 2;
      c.series.forEach(function (s, si) {
        var val = s.values[gi];
        g += '<rect class="bar" x="' + (x0 + si * bw) + '" y="' + y(val) + '" width="' + bw + '" height="' + (y(0) - y(val)) + '" fill="' + colors[si] + '"><title>' + esc(s.name) + ', ' + esc(name) + ': khoảng ' + val + '%</title></rect>';
      });
      g += '<text x="' + (L + gi * gw + gw / 2) + '" y="' + (H - B + 18) + '" text-anchor="middle">' + esc(name) + '</text>';
    });
    g += '<line class="ax" x1="' + L + '" x2="' + (W - R) + '" y1="' + y(0) + '" y2="' + y(0) + '"/>';
    g += '<text x="12" y="' + (T + ph / 2) + '" text-anchor="middle" transform="rotate(-90 12 ' + (T + ph / 2) + ')">' + esc(c.yLabel) + '</text>';
    return '<figure class="fig chart" style="margin:0"><figcaption class="fig-title">' + esc(c.title) + '</figcaption>' +
      '<svg viewBox="0 0 ' + W + ' ' + H + '" role="img" aria-label="' + esc(c.title) + '">' + g + '</svg>' +
      '<div class="legend">' + c.series.map(function (s, i) { return '<span><i style="background:' + colors[i] + '"></i>' + esc(s.name) + '</span>'; }).join('') + '</div>' +
      '<details class="data"><summary>Xem số liệu dạng bảng (ước đọc từ biểu đồ)</summary><div class="fig-scroll"><table><thead><tr><th></th>' +
      c.groups.map(function (x) { return '<th scope="col">' + esc(x) + '</th>'; }).join('') + '</tr></thead><tbody>' +
      c.series.map(function (s) { return '<tr><th scope="row">' + esc(s.name) + '</th>' + s.values.map(function (v) { return '<td class="n">≈ ' + v + '%</td>'; }).join('') + '</tr>'; }).join('') +
      '</tbody></table></div></details></figure>';
  }
  function passageHTML(q) {
    var h = '';
    if (q.notes) {
      var intro = q.notesIntro !== undefined ? q.notesIntro : 'While researching a topic, a student has taken the following notes:';
      if (intro) h += '<p class="notes-intro">' + intro + '</p>';
      h += '<ul class="notes">' + q.notes.map(function (x) { return '<li>' + fmt(x) + '</li>'; }).join('') + '</ul>';
    }
    if (q.passage) h += '<div class="passage-text">' + fmt(q.passage) + '</div>';
    if (q.table) h += tableHTML(q.table);
    if (q.chart) h += chartHTML(q.chart);
    return h;
  }

  function verdictHTML(pick, key) {
    if (!pick) return '<div class="verdict skip">' + I.dash + 'Bỏ trống · Đáp án đúng: ' + key + '</div>';
    if (pick === key) return '<div class="verdict ok">' + I.ok + 'Chính xác! Đáp án ' + key + '</div>';
    return '<div class="verdict no">' + I.no + 'Chưa đúng. Bạn chọn ' + pick + ', đáp án đúng là ' + key + '</div>';
  }
  function explainHTML(q) {
    var sk = SKILLS[q.skill];
    return '<div class="explain"><span class="eyebrow">Lời giải · ' + sk.vi + '</span><div>' + q.ex + '</div></div>';
  }

  function choicesHTML(q, pick, opts) {
    // opts: { reveal, elim, elimMode, locked }
    return '<ol class="choices" role="list">' + q.c.map(function (text, i) {
      var L = LETTERS[i], cls = 'choice';
      if (opts.reveal) {
        if (L === q.a) cls += ' right';
        else if (L === pick) cls += ' wrong';
      } else if (L === pick) cls += ' sel';
      var out = !opts.reveal && opts.elim && opts.elim[L];
      if (out) cls += ' out';
      var h = '<li><button class="' + cls + '" data-act="pick" data-l="' + L + '"' + (opts.locked ? ' disabled' : '') +
        ' aria-pressed="' + (L === pick) + '"><span class="L">' + L + '</span><span class="T">' + text + '</span></button>';
      if (opts.elimMode && !opts.locked) {
        h += '<button class="strike' + (out ? ' undo' : '') + '" data-act="strike" data-l="' + L + '" aria-label="' + (out ? 'Bỏ gạch đáp án ' : 'Gạch bỏ đáp án ') + L + '">' + (out ? 'Hoàn tác' : L) + '</button>';
      }
      return h + '</li>';
    }).join('') + '</ol>';
  }

  function navGrid(order, cellClass, curIdx) {
    return '<div class="qgrid">' + order.map(function (n, i) {
      return '<button class="qcell ' + cellClass(n, i) + (i === curIdx ? ' cur' : '') + '" data-act="jump" data-i="' + i + '" aria-label="Câu ' + n + '">' + n + '</button>';
    }).join('') + '</div>';
  }

  function renderExam() {
    var s = S(), test = testById(s.testId), q = curQ();
    var checked = s.mode === 'practice' && s.checked[q.n];
    var pick = s.answers[q.n];
    var last = s.idx === s.order.length - 1;
    var hasPassage = !!(q.passage || q.notes || q.table || q.chart);

    var h = '<div class="exam">';
    h += '<header class="xbar"><div class="xbar-l"><b>Reading and Writing</b><span>' + esc(test.title) + (s.retry ? ' · làm lại câu sai' : '') + '</span></div>' +
      '<div class="xbar-c"><span class="timer" id="timer" aria-live="off"></span><button class="timer-toggle" data-act="hide-timer">' + (s.hideTimer ? 'Hiện giờ' : 'Ẩn giờ') + '</button></div>' +
      '<div class="xbar-r"><span class="chip' + (s.mode === 'practice' ? ' practice' : '') + '">' + (s.mode === 'exam' ? 'Thi thử' : 'Luyện tập') + '</span>' +
      '<button class="icon-btn" data-act="theme" aria-label="Đổi giao diện sáng/tối">' + (isDark() ? I.sun : I.moon) + '</button>' +
      '<button class="btn sm ghost" data-act="exit">Thoát</button></div></header>';

    h += '<div class="xbody' + (hasPassage ? '' : ' solo') + '">';
    h += '<section class="pane passage" aria-label="Đoạn văn"><div class="pane-inner">' + passageHTML(q) + '</div></section><div class="divider"></div>';
    h += '<section class="pane question" aria-label="Câu hỏi"><div class="pane-inner">' +
      '<div class="qhead"><span class="qnum">' + q.n + '</span>' +
      '<button class="flag' + (s.marked[q.n] ? ' on' : '') + '" data-act="mark" aria-pressed="' + !!s.marked[q.n] + '">' + I.flag + (s.marked[q.n] ? 'Đã đánh dấu' : 'Đánh dấu xem lại') + '</button>' +
      '<span class="grow"></span>' +
      (checked ? '' : '<button class="elim-toggle' + (s.elimMode ? ' on' : '') + '" data-act="elim-mode" aria-pressed="' + !!s.elimMode + '" title="Gạch bỏ đáp án">ABC</button>') +
      '</div>' +
      (s.mode === 'practice' ? '<span class="skill-tag">' + SKILLS[q.skill].vi + ' · ' + SKILLS[q.skill].en + '</span>' : '') +
      '<p class="stem">' + fmt(q.q) + '</p>' +
      choicesHTML(q, pick, { reveal: checked, elim: s.elim[q.n], elimMode: s.elimMode, locked: checked });
    if (s.mode === 'practice') {
      if (checked) h += verdictHTML(pick, q.a) + explainHTML(q);
      else h += '<div class="check-row"><button class="btn soft" data-act="check"' + (pick ? '' : ' disabled') + '>Kiểm tra đáp án <kbd>Enter</kbd></button>' +
        '<button class="btn ghost sm" data-act="reveal">Xem lời giải</button></div>';
    }
    h += '</div></section></div>';

    var answered = s.order.filter(function (n) { return s.answers[n]; }).length;
    h += '<footer class="xfoot"><span class="who">Đã trả lời ' + answered + '/' + s.order.length + '</span>' +
      '<button class="qpick" data-act="nav" aria-expanded="' + V.navOpen + '">Câu ' + (s.idx + 1) + ' / ' + s.order.length + I.up + '</button>' +
      '<div class="nav-r"><button class="btn sm nav-lbl" data-act="prev"' + (s.idx === 0 ? ' disabled' : '') + ' aria-label="Câu trước">' + I.left + '<span>Trước</span></button>' +
      (last ? '<button class="btn sm primary" data-act="to-check">Nộp bài</button>'
            : '<button class="btn sm primary nav-lbl" data-act="next" aria-label="Câu sau"><span>Tiếp</span>' + I.right + '</button>') +
      '</div>';
    if (V.navOpen) {
      h += '<div class="navpop" role="dialog" aria-label="Danh sách câu hỏi"><div class="navpop-head"><strong>' + esc(test.title) + '</strong>' +
        '<button class="btn sm ghost" data-act="nav">Đóng</button></div>' +
        '<div class="keyline"><span><i class="cur"></i>Câu hiện tại</span><span><i></i>Chưa làm</span><span><i class="a"></i>Đã trả lời</span><span><i class="m"></i>Đánh dấu</span></div>' +
        navGrid(s.order, function (n) { return (s.answers[n] ? 'a' : '') + (s.marked[n] ? ' m' : ''); }, s.idx) +
        '<button class="btn sm" data-act="to-check">Xem trang tổng kết &amp; nộp bài</button></div>';
    }
    h += '</footer></div>';
    app.innerHTML = h;
  }

  function renderCheck() {
    var s = S(), test = testById(s.testId);
    var blank = s.order.filter(function (n) { return !s.answers[n]; });
    var marked = s.order.filter(function (n) { return s.marked[n]; });
    var h = '<div class="exam">';
    h += '<header class="xbar"><div class="xbar-l"><b>Kiểm tra bài làm</b><span>' + esc(test.title) + '</span></div>' +
      '<div class="xbar-c"><span class="timer" id="timer"></span><button class="timer-toggle" data-act="hide-timer">' + (s.hideTimer ? 'Hiện giờ' : 'Ẩn giờ') + '</button></div>' +
      '<div class="xbar-r"><button class="btn sm ghost" data-act="exit">Thoát</button></div></header>';
    h += '<main class="checkpage"><div class="inner">' +
      '<div><h2>Trước khi nộp bài</h2><p class="muted" style="margin-top:6px">Bấm vào số câu để quay lại sửa. Khi nộp, bài sẽ được chấm ngay.</p></div>' +
      '<section class="card"><div class="keyline"><span><i></i>Chưa làm (' + blank.length + ')</span><span><i class="a"></i>Đã trả lời (' + (s.order.length - blank.length) + ')</span><span><i class="m"></i>Đánh dấu (' + marked.length + ')</span></div>' +
      navGrid(s.order, function (n) { return (s.answers[n] ? 'a' : '') + (s.marked[n] ? ' m' : ''); }, -1) + '</section>';
    if (V.confirm) {
      h += '<div class="confirm" role="alert"><strong>Bạn còn ' + blank.length + ' câu chưa trả lời.</strong><span class="small">Câu bỏ trống được tính là sai. Vẫn nộp bài?</span>' +
        '<div class="row"><button class="btn primary" data-act="submit-now">Vẫn nộp bài</button><button class="btn ghost" data-act="cancel-confirm">Quay lại làm tiếp</button></div></div>';
    } else {
      h += '<div class="row"><button class="btn" data-act="back-exam">' + I.left + 'Quay lại câu ' + s.order[s.idx] + '</button>' +
        '<button class="btn primary" data-act="submit">Nộp bài</button></div>';
    }
    h += '</div></main></div>';
    app.innerHTML = h;
  }

  /* ----- results ----- */
  function entryById(id) { for (var i = 0; i < store.history.length; i++) if (store.history[i].id === id) return store.history[i]; return null; }

  function renderResult() {
    var e = entryById(V.resultId);
    if (!e) return go('home');
    var test = testById(e.testId);
    var wrong = [], blank = [];
    e.order.forEach(function (n) {
      var p = e.answers[n];
      if (!p) blank.push(n); else if (p !== qByN(test, n).a) wrong.push(n);
    });
    var pct = e.correct / e.total;
    var full = e.total === test.questions.length;

    var h = topbar() + '<main class="result" id="main">';
    h += '<div><span class="eyebrow">Kết quả · ' + dateStr(e.date) + '</span><h1 style="font-size:clamp(1.5rem,1.2rem + 1.4vw,2rem);margin-top:4px">' + esc(test.title) +
      (e.retry ? ' · làm lại câu sai' : '') + '</h1></div>';

    var C = 2 * Math.PI * 64;
    h += '<section class="card score-card"><div class="ring" role="img" aria-label="Đúng ' + e.correct + ' trên ' + e.total + ' câu">' +
      '<svg viewBox="0 0 150 150"><circle class="track" cx="75" cy="75" r="64" fill="none" stroke-width="12"/>' +
      '<circle class="fill" cx="75" cy="75" r="64" fill="none" stroke-width="12" stroke-dasharray="' + (C * pct) + ' ' + C + '"/></svg>' +
      '<div class="ring-lbl"><b>' + e.correct + '</b><span>trên ' + e.total + ' câu</span></div></div>' +
      '<div class="score-facts"><div class="facts">' +
      (full ? '<div class="fact"><b>≈ ' + scaled(e.correct, e.total) + '</b><span>Điểm ước tính (200–800)</span></div>' : '') +
      '<div class="fact ok"><b>' + Math.round(pct * 100) + '%</b><span>Tỉ lệ đúng</span></div>' +
      '<div class="fact no"><b>' + (wrong.length + blank.length) + '</b><span>Sai hoặc bỏ trống</span></div>' +
      '<div class="fact"><b>' + mmss(e.elapsed) + '</b><span>Thời gian làm bài</span></div></div>' +
      (full ? '<p class="small muted">Điểm quy đổi chỉ mang tính tham khảo: đề thật dùng hình thức thích ứng theo module và bảng quy đổi riêng.</p>' : '') +
      '<div class="res-actions">' +
      (wrong.length + blank.length ? '<button class="btn primary" data-act="retry-wrong">' + I.redo + 'Làm lại ' + (wrong.length + blank.length) + ' câu sai</button>' : '') +
      '<button class="btn" data-act="review-first">Xem lời giải từng câu</button>' +
      '<button class="btn ghost" data-act="home">' + I.home + 'Trang chủ</button></div></div></section>';

    // domain + skill breakdown
    var dstat = {}, sstat = {};
    e.order.forEach(function (n) {
      var q = qByN(test, n), sk = q.skill, d = SKILLS[sk].d, ok = e.answers[n] === q.a;
      dstat[d] = dstat[d] || { t: 0, c: 0 }; dstat[d].t++; if (ok) dstat[d].c++;
      sstat[sk] = sstat[sk] || { t: 0, c: 0 }; sstat[sk].t++; if (ok) sstat[sk].c++;
    });
    h += '<div class="res-grid"><section class="card panel"><h3>Theo phần thi</h3><div class="meters">' +
      DOMAINS.filter(function (d) { return dstat[d.id]; }).map(function (d) {
        var st = dstat[d.id];
        return '<div class="meter"><div class="meter-top"><b><i class="d-' + d.id + '"></i>' + d.vi + '</b><span>' + st.c + '/' + st.t + '</span></div>' +
          '<div class="meter-track"><i class="d-' + d.id + '" style="width:' + (st.c / st.t * 100) + '%"></i></div>' +
          '<span class="small muted">' + d.en + '</span></div>';
      }).join('') + '</div></section>';
    h += '<section class="card panel"><h3>Theo dạng câu hỏi</h3><table class="skills"><tbody>' +
      Object.keys(SKILLS).filter(function (k) { return sstat[k]; }).map(function (k) {
        var st = sstat[k];
        return '<tr' + (st.c / st.t < 0.6 ? ' class="weak"' : '') + '><td>' + SKILLS[k].vi + '<small>' + SKILLS[k].en + '</small></td><td>' + st.c + '/' + st.t + '</td></tr>';
      }).join('') + '</tbody></table><p class="small muted">Dạng tô đỏ: đúng dưới 60%, nên ôn thêm.</p></section></div>';

    // answer sheet
    var list = e.order.filter(function (n) {
      if (V.filter === 'wrong') return wrong.indexOf(n) >= 0 || blank.indexOf(n) >= 0;
      if (V.filter === 'marked') return e.marked && e.marked[n];
      return true;
    });
    var nMarked = e.order.filter(function (n) { return e.marked && e.marked[n]; }).length;
    h += '<section class="card panel"><div class="sheet-head"><h3>Phiếu trả lời</h3><div class="filters" role="group" aria-label="Lọc câu">' +
      '<button data-act="filter" data-f="all" aria-pressed="' + (V.filter === 'all') + '">Tất cả (' + e.total + ')</button>' +
      '<button data-act="filter" data-f="wrong" aria-pressed="' + (V.filter === 'wrong') + '">Sai / bỏ trống (' + (wrong.length + blank.length) + ')</button>' +
      '<button data-act="filter" data-f="marked" aria-pressed="' + (V.filter === 'marked') + '">Đã đánh dấu (' + nMarked + ')</button>' +
      '</div></div><p class="small muted">Ô tô màu là đáp án bạn chọn, ô viền xanh là đáp án đúng. Bấm vào một dòng để xem lời giải.</p>';
    if (!list.length) h += '<p class="empty-note">Không có câu nào trong mục này.</p>';
    h += '<div class="sheet">' + list.map(function (n) {
      var q = qByN(test, n), p = e.answers[n];
      var st = !p ? 'skip' : (p === q.a ? 'ok' : 'no');
      return '<button class="srow" data-act="review" data-n="' + n + '" aria-label="Câu ' + n + ': ' + (st === 'ok' ? 'đúng' : st === 'no' ? 'sai' : 'bỏ trống') + '"><span class="no">' + n + '</span>' +
        LETTERS.map(function (L) {
          var c = 'bub';
          if (L === p) c += p === q.a ? ' pick-ok' : ' pick-no';
          else if (L === q.a) c += ' key';
          return '<span class="' + c + '">' + L + '</span>';
        }).join('') +
        '<span class="st ' + st + '">' + (e.marked && e.marked[n] ? '<i class="mk" title="Đã đánh dấu"></i>' : '') + (st === 'ok' ? I.ok : st === 'no' ? I.no : I.dash) + '</span></button>';
    }).join('') + '</div></section>';
    h += '</main>';
    app.innerHTML = h;
  }

  function renderReview() {
    var e = entryById(V.resultId);
    if (!e) return go('home');
    var test = testById(e.testId);
    var n = e.order[V.reviewIdx], q = qByN(test, n), pick = e.answers[n];
    var hasPassage = !!(q.passage || q.notes || q.table || q.chart);
    var h = '<div class="exam">';
    h += '<header class="xbar"><div class="xbar-l"><b>Xem lời giải</b><span>' + esc(test.title) + '</span></div>' +
      '<div class="xbar-c"><span class="chip review">Đúng ' + e.correct + '/' + e.total + '</span></div>' +
      '<div class="xbar-r"><button class="icon-btn" data-act="theme" aria-label="Đổi giao diện sáng/tối">' + (isDark() ? I.sun : I.moon) + '</button>' +
      '<button class="btn sm ghost" data-act="back-result">Về kết quả</button></div></header>';
    h += '<div class="xbody' + (hasPassage ? '' : ' solo') + '">' +
      '<section class="pane passage" aria-label="Đoạn văn"><div class="pane-inner">' + passageHTML(q) + '</div></section><div class="divider"></div>' +
      '<section class="pane question" aria-label="Câu hỏi"><div class="pane-inner">' +
      '<div class="qhead"><span class="qnum">' + q.n + '</span><span class="skill-tag">' + SKILLS[q.skill].vi + ' · ' + SKILLS[q.skill].en + '</span></div>' +
      '<p class="stem">' + fmt(q.q) + '</p>' + choicesHTML(q, pick, { reveal: true, locked: true }) +
      verdictHTML(pick, q.a) + explainHTML(q) + '</div></section></div>';
    var last = V.reviewIdx === e.order.length - 1;
    h += '<footer class="xfoot"><span class="who">Câu sai tô đỏ, câu đúng tô xanh</span>' +
      '<button class="qpick" data-act="nav" aria-expanded="' + V.navOpen + '">Câu ' + (V.reviewIdx + 1) + ' / ' + e.order.length + I.up + '</button>' +
      '<div class="nav-r"><button class="btn sm nav-lbl" data-act="prev"' + (V.reviewIdx === 0 ? ' disabled' : '') + ' aria-label="Câu trước">' + I.left + '<span>Trước</span></button>' +
      (last ? '<button class="btn sm primary" data-act="back-result">Xong</button>'
            : '<button class="btn sm primary nav-lbl" data-act="next" aria-label="Câu sau"><span>Tiếp</span>' + I.right + '</button>') + '</div>';
    if (V.navOpen) {
      h += '<div class="navpop" role="dialog" aria-label="Danh sách câu hỏi"><div class="navpop-head"><strong>Chọn câu</strong><button class="btn sm ghost" data-act="nav">Đóng</button></div>' +
        '<div class="keyline"><span><i class="ok"></i>Đúng</span><span><i class="no"></i>Sai</span><span><i></i>Bỏ trống</span></div>' +
        navGrid(e.order, function (m) { var p = e.answers[m]; return !p ? '' : (p === qByN(test, m).a ? 'ok' : 'no'); }, V.reviewIdx) + '</div>';
    }
    h += '</footer></div>';
    app.innerHTML = h;
  }

  /* ---------- actions ---------- */
  function scrollPanesTop() {
    var ps = app.querySelectorAll('.pane');
    for (var i = 0; i < ps.length; i++) ps[i].scrollTop = 0;
    if (window.matchMedia('(max-width: 860px)').matches) window.scrollTo(0, 0);
  }
  function move(d) {
    if (V.name === 'review') {
      var e = entryById(V.resultId);
      var ni = V.reviewIdx + d;
      if (ni < 0 || ni >= e.order.length) return;
      V.reviewIdx = ni; V.navOpen = false; render(); scrollPanesTop(); return;
    }
    var s = S(); if (!s) return;
    var i = s.idx + d;
    if (i < 0) return;
    if (i >= s.order.length) { go('check'); return; }
    s.idx = i; V.navOpen = false; save(); render(); scrollPanesTop();
  }
  function pick(L) {
    var s = S(), q = curQ();
    if (s.mode === 'practice' && s.checked[q.n]) return;
    s.answers[q.n] = L;
    if (s.elim[q.n]) delete s.elim[q.n][L];
    save(); render();
  }

  app.addEventListener('click', function (ev) {
    var b = ev.target.closest('[data-act]');
    if (!b || b.disabled) return;
    var act = b.getAttribute('data-act'), s = S();
    switch (act) {
      case 'home': if (V.name === 'exam' || V.name === 'check') { save(); } go('home'); break;
      case 'theme': toggleTheme(); break;
      case 'start': {
        var t = testById(b.getAttribute('data-test'));
        if (s) { toast('Bạn đang có một bài làm dở. Hãy làm tiếp hoặc bỏ bài đó trước.'); break; }
        startSession(t, b.getAttribute('data-mode')); break;
      }
      case 'resume': go('exam'); break;
      case 'discard':
        if (b.getAttribute('data-sure') === '1') { store.active = null; save(); go('home'); toast('Đã bỏ bài làm dở.'); }
        else { b.setAttribute('data-sure', '1'); b.textContent = 'Bấm lần nữa để bỏ'; }
        break;
      case 'exit': save(); stopTick(); go('home'); toast('Đã lưu. Bạn có thể làm tiếp bất cứ lúc nào.'); break;
      case 'hide-timer': s.hideTimer = !s.hideTimer; save(); render(); break;
      case 'pick': pick(b.getAttribute('data-l')); break;
      case 'strike': {
        var q = curQ(), L = b.getAttribute('data-l');
        s.elim[q.n] = s.elim[q.n] || {};
        if (s.elim[q.n][L]) delete s.elim[q.n][L];
        else { s.elim[q.n][L] = true; if (s.answers[q.n] === L) delete s.answers[q.n]; }
        save(); render(); break;
      }
      case 'elim-mode': s.elimMode = !s.elimMode; save(); render(); break;
      case 'mark': { var qq = curQ(); if (s.marked[qq.n]) delete s.marked[qq.n]; else s.marked[qq.n] = true; save(); render(); break; }
      case 'check': s.checked[curQ().n] = true; save(); render(); break;
      case 'reveal': s.checked[curQ().n] = true; save(); render(); break;
      case 'prev': move(-1); break;
      case 'next': move(1); break;
      case 'nav': V.navOpen = !V.navOpen; render(); break;
      case 'jump': {
        var i = +b.getAttribute('data-i');
        if (V.name === 'review') { V.reviewIdx = i; V.navOpen = false; render(); scrollPanesTop(); }
        else { s.idx = i; save(); go('exam'); scrollPanesTop(); }
        break;
      }
      case 'to-check': save(); go('check'); break;
      case 'back-exam': go('exam'); break;
      case 'submit': {
        var blanks = s.order.filter(function (n) { return !s.answers[n]; }).length;
        if (blanks) { V.confirm = true; render(); } else submit();
        break;
      }
      case 'submit-now': submit(); break;
      case 'cancel-confirm': V.confirm = false; render(); break;
      case 'open-result': go('result', { resultId: b.getAttribute('data-id'), filter: 'all' }); break;
      case 'filter': V.filter = b.getAttribute('data-f'); render(); break;
      case 'review': {
        var e = entryById(V.resultId);
        go('review', { reviewIdx: e.order.indexOf(+b.getAttribute('data-n')) }); break;
      }
      case 'review-first': go('review', { reviewIdx: 0 }); break;
      case 'back-result': go('result'); break;
      case 'retry-wrong': {
        if (s) { toast('Bạn đang có một bài làm dở. Hãy làm tiếp hoặc bỏ bài đó trước.'); break; }
        var en = entryById(V.resultId), tt = testById(en.testId);
        var sub = en.order.filter(function (n) { return en.answers[n] !== qByN(tt, n).a; });
        startSession(tt, 'practice', sub); break;
      }
    }
  });

  document.addEventListener('keydown', function (ev) {
    if (ev.ctrlKey || ev.metaKey || ev.altKey) return;
    var tag = (ev.target.tagName || '').toLowerCase();
    if (tag === 'input' || tag === 'textarea' || tag === 'select') return;
    var k = ev.key;
    if (V.name === 'review') {
      if (k === 'ArrowRight') move(1); else if (k === 'ArrowLeft') move(-1);
      else if (k === 'Escape' && V.navOpen) { V.navOpen = false; render(); }
      return;
    }
    if (V.name !== 'exam' || !S()) return;
    var s = S(), q = curQ();
    var up = k.toUpperCase();
    var li = LETTERS.indexOf(up); if (li < 0 && /^[1-4]$/.test(k)) li = +k - 1;
    if (li >= 0) { ev.preventDefault(); pick(LETTERS[li]); }
    else if (k === 'ArrowRight') move(1);
    else if (k === 'ArrowLeft') move(-1);
    else if (up === 'M') { if (s.marked[q.n]) delete s.marked[q.n]; else s.marked[q.n] = true; save(); render(); }
    else if (k === 'Escape' && V.navOpen) { V.navOpen = false; render(); }
    else if (k === 'Enter' && s.mode === 'practice' && tag !== 'button') {
      ev.preventDefault();
      if (s.checked[q.n]) move(1);
      else if (s.answers[q.n]) { s.checked[q.n] = true; save(); render(); }
    }
  });

  window.addEventListener('pagehide', save);
  document.addEventListener('visibilitychange', function () { if (document.hidden) save(); });

  render();
})();
