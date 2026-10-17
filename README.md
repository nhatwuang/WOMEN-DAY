# TIN4-WOMENS-DAY — Món quà 20/10 dành cho Lớp Tin 4

Website chúc mừng ngày Phụ nữ Việt Nam 20/10 dành cho **35 bạn nữ của Lớp Tin 4**. Website hoàn toàn tĩnh, miễn phí, không yêu cầu tài khoản, database, backend, API hoặc kết nối internet để hoạt động sau khi tải về.

## 1. Cấu trúc dự án

```text
TIN4-WOMENS-DAY/
├── index.html                    # 5 phần nội dung, thiệp chúc chung, SEO
├── style.css                     # giao diện, responsive, animation
├── script.js                     # tên thành viên, tìm kiếm, tương tác, nhạc
├── assets/
│   ├── images/
│   │   ├── bouquet.svg           # bó hoa SVG tự dựng
│   │   ├── favicon.svg           # favicon SVG tự dựng
│   │   └── share-preview.png     # ảnh chia sẻ 1200 × 630
│   └── audio/
│       └── .gitkeep              # không cần MP3: Web Audio tạo nhạc
└── README.md
```

## 2. Cách chạy

**Cách nhanh nhất:** giải nén và mở `index.html` bằng Chrome, Edge, Firefox hoặc Safari. Không cần cài đặt npm hay môi trường chạy.

**Cách mở qua localhost (khuyến nghị khi kiểm thử):** tại thư mục `TIN4-WOMENS-DAY`, chạy:

```bash
python -m http.server 5500
```

Truy cập `http://localhost:5500` từ máy tính. Dùng `Ctrl+C` để dừng server. Có thể thay bằng extension **Live Server** của VS Code.

## 3. Thay đổi lời chúc chung

Mở `index.html`, tìm `id="sharedWish"`. Chỉnh sửa **các thẻ `<p>` bên trong vùng này**; phần tiêu đề của thiệp nằm trong thẻ `<h3>` ngay phía trên. Chỉ có **một** thiệp chúc chung; không tạo thiệp riêng cho từng người. Lưu tệp UTF-8 để tránh lỗi dấu tiếng Việt.

## 4. Chỉnh sửa danh sách 35 thành viên

Mở `script.js`, tìm `const memberNames = Object.freeze([...])`. Mỗi thành viên là **một chuỗi**, theo thứ tự từ 1 đến 35. Không sửa ký tự dấu nháy trong `"Nay H' Iêng"` nếu chưa kiểm tra cú pháp. Nút tìm kiếm tự động hoạt động theo danh sách này, hỗ trợ `đ` / `d`, dấu / không dấu, chữ hoa / chữ thường.

Nếu chủ động thay đổi số lượng thành viên, cần cập nhật các dòng tiêu đề/nội dung nhắc đến **35** trong `index.html` để bảo đảm đồng nhất. Với dự án tặng lớp hiện tại, giữ nguyên danh sách 35 tên đã xác nhận.

## 5. Nhạc nền

Nút **Bật nhạc / Tắt nhạc** tạo giai điệu piano-like nhẹ bằng Web Audio API, **không tự phát**, không dùng MP3, không cần internet. Một số trình duyệt có thể tạm dừng âm thanh khi chuyển tab; trang tự tắt nhạc khi tab bị ẩn. Thư mục `assets/audio/` để trống cho lần mở rộng sau.

## 6. Đưa lên GitHub Pages miễn phí

1. Tạo repository công khai mới trên GitHub, ví dụ `TIN4-WOMENS-DAY`.
2. Đưa **toàn bộ nội dung thư mục dự án** lên **gốc repository** (`index.html` phải ở ngay thư mục gốc).
3. Vào **Settings → Pages**.
4. Chọn **Build and deployment → Deploy from a branch**. Chọn nhánh `main`, thư mục `/ (root)`, rồi **Save**.
5. Sau khi GitHub triển khai, truy cập `https://TEN-TAI-KHOAN.github.io/TIN4-WOMENS-DAY/` (thay `TEN-TAI-KHOAN` bằng username GitHub).

Nếu repository tên `TEN-TAI-KHOAN.github.io`, URL sẽ là `https://TEN-TAI-KHOAN.github.io/`.

## 7. Đưa lên Netlify miễn phí

1. Đăng nhập [Netlify](https://www.netlify.com/).
2. Chọn **Add new project → Deploy manually** (tên mục có thể thay đổi).
3. Kéo **thư mục đã giải nén** `TIN4-WOMENS-DAY/` (không phải tệp ZIP) vào vùng deploy.
4. Đợi triển khai hoàn tất rồi lấy URL miễn phí dạng `https://ten-trang.netlify.app`.
5. Có thể tùy chỉnh tên site trong phần cài đặt của Netlify.

**Metadata khi chia sẻ:** tệp `share-preview.png` đã có sẵn và được tham chiếu từ `index.html`. Để ảnh preview được Facebook/Zalo và các nền tảng hỗ trợ ổn định, **sau khi có domain**, thay `content="./assets/images/share-preview.png"` trong hai thẻ `og:image` và `twitter:image` bằng URL HTTPS tuyệt đối, ví dụ `https://TEN-TAI-KHOAN.github.io/TIN4-WOMENS-DAY/assets/images/share-preview.png`. Có thể bổ sung thẻ `og:url` bằng URL website chính thức. Việc hiển thị thẻ chia sẻ phụ thuộc bộ thu thập thông tin/cache của từng nền tảng; không thể kiểm chứng trước khi site có domain công khai.

## 8. Tùy chỉnh hình ảnh, màu và hiệu ứng

- Màu: thay CSS variables trong `:root` của `style.css`.
- Hình bó hoa: thay `assets/images/bouquet.svg` bằng một SVG cùng tên, hoặc cập nhật cả đường dẫn hình tại `index.html`.
- Hiệu ứng số lượng cánh hoa: tìm `buildAmbientPetals()` trong `script.js`.
- Nhịp âm thanh: sửa mảng `notes` và âm lượng giới hạn bởi `masterGain` trong `script.js`.
- Chuyển động giảm: đã hỗ trợ cài đặt hệ thống **Reduce motion** (`prefers-reduced-motion: reduce`).

## 9. Checklist kiểm thử thủ công

- [ ] Website mở mà không cần backend hoặc internet (từ thư mục đã giải nén).
- [ ] Không phát âm thanh khi mới truy cập; bật/tắt sau khi bấm nút.
- [ ] Nút **Mở món quà đặc biệt** cuộn đến khu vực thiệp.
- [ ] Thiệp mở, hiển thị đủ lời chúc chung; nút đóng hoạt động.
- [ ] Đủ 35 thành viên với họ tên, dấu và thứ tự chính xác.
- [ ] Tìm kiếm `nguyen`, `huyen`, `Nay H Ieng` cho kết quả đúng.
- [ ] Tìm kiếm không có kết quả hiển thị hướng dẫn đặt lại.
- [ ] Chạm thẻ thành viên tạo hiệu ứng, không mở lời chúc riêng.
- [ ] Nút **Gửi ngàn lời yêu thương** có thể bấm liên tục; không tăng vô hạn số particle.
- [ ] Tab/Shift+Tab truy cập được các nút và ô tìm kiếm.
- [ ] Trên màn hình 320px, 375px, 768px, 1024px và desktop không có thanh cuộn ngang hoặc tên bị cắt.
- [ ] Với hệ thống chọn Reduce motion, các chuyển động được giảm.
- [ ] Trên link đã công khai, social preview hiển thị đúng sau khi cập nhật đường dẫn ảnh tuyệt đối.

## 10. Giới hạn được chủ động thiết kế

- Không có nhạc MP3: giai điệu được phát bằng API sẵn có của trình duyệt, có thể khác nhẹ giữa hệ điều hành và thiết bị.
- Không có hình ảnh người thật, không cần ảnh bên thứ ba hoặc tệp chứa bản quyền.
- Tính năng `Share preview` trên mạng xã hội chỉ có thể kiểm chứng đầy đủ khi website đã được triển khai và truy cập công khai.

**Bản quyền nguồn:** các file SVG, PNG, HTML, CSS và JS trong gói dự án được tạo riêng cho website này. Không có thư viện hay phông chữ đi kèm phải mua bản quyền.

## 11. Kết quả kiểm tra kỹ thuật trước bàn giao

Đã kiểm tra tự động trên **Chromium headless** với mã HTML/CSS/JavaScript và ảnh SVG được nhúng trực tiếp (môi trường kiểm tra chặn điều hướng HTTP/file nội bộ). Kết quả:

- **Đạt:** 35 thẻ thành viên, 35 tên duy nhất, đúng thứ tự và các vị trí đầu/cuối đối chiếu; trang không tràn ngang ở các viewport **1440 × 900**, **768 × 1024**, **375 × 812** và **320 × 680**.
- **Đạt:** mở/đóng thiệp; chỉ một vùng lời chúc chung gồm 5 đoạn; tìm kiếm `nguyen le bao`, `Nay H Ieng`; trạng thái không tìm thấy và nút khôi phục danh sách.
- **Đạt:** kích hoạt particle trên thẻ; bấm nút ăn mừng nhiều lần; số particle đang hiện không vượt giới hạn 90; nhấn bật/tắt nhạc đổi trạng thái điều khiển; hệ thống reduce motion không dựng cánh hoa bay.
- **Đạt:** không có JavaScript exception trong các ca kiểm thử; các hình SVG đều được nạp khi nhúng vào trình duyệt kiểm tra.
- **Chưa kiểm chứng trực tiếp:** đường truyền HTTP công khai từ GitHub Pages/Netlify, kết quả rich preview trên các mạng xã hội, âm thanh nghe qua loa ngoài, và trải nghiệm thực tế trên Safari/Firefox hoặc điện thoại vật lý.

Các mục chưa kiểm chứng cần thực hiện thêm khi triển khai website công khai. Không diễn giải thay đổi trạng thái nút nhạc là phép đo chất lượng âm thanh thực tế.
