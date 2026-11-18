# TT78 XML Invoice Parser (Node.js & n8n)

Module nhẹ bằng Node.js (`fast-xml-parser`) giúp bóc tách chính xác 100% dữ liệu hoá đơn điện tử chuẩn **Nghị định 123 / Thông tư 78** từ file `.xml` gốc.

## Tính năng chính
- Loại bỏ UTF-8 BOM (`\uFEFF`) và XML Namespace prefix (`inv:`, `ds:`).
- Giữ nguyên số `0` đầu cho Mã số thuế (`0312...`) và Số hoá đơn (`00001234`) nhờ `parseTagValue: false`.
- Tự ép mảng `HHDVu` & `LTSuat` ngay cả khi hoá đơn chỉ có 1 dòng hàng.
- Tạo `uniqueKey` (`MST_Ban|MauSo|KyHieu|SoHD`) chống hạch toán trùng và kiểm toán chéo số học `TongTruocThue + VAT = TongThanhToan`.

## Tài liệu chi tiết & Kiến trúc n8n + OCR Fallback
- Hướng dẫn từng bước & n8n Code Node: **[Bóc Tách XML Hoá Đơn Thông Tư 78 Bằng n8n & Node.js](https://seotrum.com/blog/boc-tach-xml-hoa-don-thong-tu-78-bang-n8n-va-nodejs)**
- Giải pháp trọn gói cho doanh nghiệp (XML + Vision OCR đẩy MISA/Excel): **[AI Trích Xuất Hoá Đơn GTGT PDF/XML Nhập MISA & Excel | Sèo Trum](https://seotrum.com/giai-phap/ai-doc-hoa-don-ke-toan-pdf)**
- Tác giả: **[Kỹ sư Trần Như Ý](https://seotrum.com/tran-nhu-y)**
