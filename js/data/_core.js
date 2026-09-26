/* Kho từ vựng SAT. Mỗi mục: [từ, loại từ, nghĩa tiếng Việt, định nghĩa Anh–Anh,
   câu ví dụ (từ cần học đặt trong [ngoặc vuông]), từ đồng nghĩa, ghi chú (tuỳ chọn)] */
window.SAT_WORDS = [];
window.addWords = function (level, rows, opts) {
  opts = opts || {};
  rows.forEach(function (r) {
    window.SAT_WORDS.push({
      w: r[0], pos: r[1], vi: r[2], en: r[3], ex: r[4], syn: r[5],
      note: r[6] || '', level: level, multi: !!opts.multi
    });
  });
};
