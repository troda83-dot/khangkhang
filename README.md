# Từ Vựng SAT 500

Web học **500 từ vựng hay gặp nhất trong đề Digital SAT** (phần Reading and Writing), dành cho học sinh Việt Nam. Chạy hoàn toàn trên trình duyệt, không cần cài đặt, không cần tài khoản.

## Cách mở

- Mở trực tiếp file `index.html` bằng trình duyệt, **hoặc**
- Bật GitHub Pages: *Settings → Pages → Deploy from a branch* → chọn nhánh này, thư mục `/ (root)`.

## Chức năng

| Mục | Mô tả |
| --- | --- |
| **Tổng quan** | Mục tiêu mỗi ngày, chuỗi ngày học liên tiếp, tiến độ 500 từ, lộ trình 20 bài, biểu đồ 7 ngày. |
| **Học từ mới** | Mỗi bài 25 từ, học theo nhóm 5 từ: thẻ từ đầy đủ (nghĩa Việt, định nghĩa Anh–Anh, câu ví dụ, từ đồng nghĩa, phát âm) → kiểm tra nhanh ngay; câu sai được hỏi lại cho tới khi đúng. |
| **Ôn tập** | Thẻ ghi nhớ lật 2 mặt với lịch **lặp lại ngắt quãng** (hộp Leitner: 1 → 2 → 4 → 8 → 16 → 32 → 64 ngày). Bộ thẻ: đến hạn hôm nay, đã học, gắn sao, sổ lỗi sai, theo bài, cả 500 từ. Mặt trước có thể là tiếng Anh, tiếng Việt hoặc câu ví dụ. |
| **Kiểm tra** | 6 dạng câu: nghĩa tiếng Việt, chọn từ tiếng Anh, định nghĩa Anh–Anh, **điền từ vào câu (kiểu Words in Context)**, từ đồng nghĩa, gõ chính tả. Chọn phạm vi (bài, cấp độ, gắn sao, lỗi sai, từ đa nghĩa…) và số câu. Có chấm điểm, bấm giờ, xem lại từng câu, làm lại câu sai. |
| **Từ điển** | Tra cứu theo tiếng Anh, tiếng Việt (có dấu hoặc không dấu) hoặc từ đồng nghĩa; lọc theo cấp độ, trạng thái, bài, gắn sao; sắp xếp theo bài / A–Z / hay sai. |
| **Sổ lỗi sai** | Tự ghi lại từ trả lời sai; từ rời sổ khi trả lời đúng 2 lần liên tiếp. |
| **Cài đặt** | Mục tiêu ngày, giọng Anh–Mỹ / Anh–Anh, tốc độ đọc, tự phát âm, giao diện sáng/tối, sao lưu & khôi phục tiến độ, phím tắt. |

Tiến độ được lưu trong trình duyệt (`localStorage`). Dùng *Cài đặt → Sao lưu* để chuyển sang máy khác.

**Phím tắt:** `Space` lật thẻ · `1`–`4` chấm thẻ / chọn đáp án A–D · `Enter` tiếp tục · `P` phát âm · `S` gắn sao · `←` `→` chuyển từ · `/` tìm kiếm · `Esc` thoát.

## Danh sách từ

| Cấp độ | Số từ | Bài |
| --- | --- | --- |
| Cốt lõi — từ học thuật lặp lại nhiều nhất trong đoạn văn và đáp án | 200 | 1–8 |
| Nâng cao — thường gặp trong đề thật, độ khó trung bình–khó | 201 | 9–17 |
| Từ đa nghĩa — bẫy kinh điển của Words in Context (*novel, qualify, check, arrest, sanction…*) kèm ghi chú nghĩa SAT | 28 | 17–18 |
| Chuyên sâu — từ khó, thường là đáp án phân loại điểm cao | 71 | 18–20 |

Danh sách được tổng hợp dựa trên các phân tích từ vựng công khai của đề luyện tập chính thức College Board / Bluebook (Digital SAT) và các danh sách từ SAT phổ biến, ưu tiên từ học thuật xuất hiện nhiều trong đoạn văn và đáp án câu hỏi *Words in Context*. Nghĩa tiếng Việt, định nghĩa và câu ví dụ được biên soạn riêng cho dự án này.

Dữ liệu nằm trong `js/data/words-*.js`. Mỗi mục có dạng:

```js
["mitigate","v","giảm nhẹ, làm dịu","to make less severe or painful",
 "Planting trees can [mitigate] the effects of urban heat.","alleviate, lessen, ease"]
// [từ, loại từ, nghĩa Việt, định nghĩa Anh–Anh, câu ví dụ (từ trong [ngoặc]), đồng nghĩa, ghi chú (tuỳ chọn)]
```

## KHANGSAT — web làm đề SAT

Thư mục [`khangsat/`](khangsat/) là web **làm đề Digital SAT Reading and Writing** (mở `khangsat/index.html`, hoặc `/khangsat/` khi bật GitHub Pages).

- **Đề có sẵn:** *PrimeSAT Verbal 45*, gồm 54 câu. Đáp án và lời giải tiếng Việt do KHANGSAT biên soạn vì đề gốc không kèm đáp án.
- **Cấu trúc 2 phần:** đề chia thành Module 1 (câu 1–27) và Module 2 (câu 28–54), mỗi phần 32 phút chạy nối tiếp có màn hình chuyển phần, giống Bluebook.
- **Thi thử:** đồng hồ đếm ngược từng phần, đánh dấu câu để xem lại, gạch bỏ đáp án (ABC), trang kiểm tra trước khi nộp, tự nộp khi hết giờ.
- **Luyện tập:** không giới hạn giờ, kiểm tra đáp án và đọc lời giải ngay sau mỗi câu.
- **Kết quả:** số câu đúng, điểm quy đổi ước tính (200–800), thống kê theo 4 phần thi và 11 dạng câu, phiếu trả lời, xem lời giải từng câu, làm lại các câu sai.
- Bài làm dở và lịch sử được lưu trong trình duyệt (`localStorage`).

Thêm đề mới: tạo file `khangsat/tests/<ten-de>.js` theo mẫu `primesat-verbal-45.js` rồi thêm thẻ `<script>` vào `khangsat/index.html`.

## Cấu trúc

```
index.html          trang chính
css/style.css       giao diện (sáng/tối, responsive)
js/app.js           toàn bộ logic: học, ôn tập, kiểm tra, từ điển, lưu tiến độ
js/data/*.js        dữ liệu 500 từ
khangsat/           web làm đề SAT (index.html, khangsat.css, app.js, tests/*.js)
```
