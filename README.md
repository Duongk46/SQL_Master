# SQL Master · Northwind Practice

Luyện T-SQL trên database Northwind cho phỏng vấn full-stack mức middle. Repository gồm schema có dữ liệu mẫu, ERD, **website 77 bài tập** từ SELECT đến stored procedure, và công cụ import tùy chọn.

## Bắt đầu trong SQL Server

1. Tạo **database riêng** tên `NorthwindPractice` bằng SQL Server Management Studio (SSMS). Không dùng database có dữ liệu cần giữ: `schemas/northwind.sql` **xóa rồi tạo lại** các bảng/view/procedure Northwind khi chạy.
2. Trong SSMS, mở `schemas/northwind.sql`, chọn database `NorthwindPractice` trong thanh chọn database, rồi **Execute**. Đây là file `.sql` cần chạy, không phải file backup để Restore.
3. Mở và chạy [`schemas/verify_northwind.sql`](schemas/verify_northwind.sql) trong cùng database. Script chỉ đọc, kiểm tra đủ 13 bảng, view/procedure mẫu và các dữ liệu dùng trong bài tập. Có thể kiểm tra nhanh bằng:

```sql
SELECT DB_NAME() AS CurrentDatabase;
SELECT COUNT(*) AS CustomerCount FROM dbo.Customers;
SELECT COUNT(*) AS OrderCount FROM dbo.Orders;
SELECT COUNT(*) AS DetailCount FROM dbo.[Order Details];
```

`CurrentDatabase` phải là `NorthwindPractice` và ba count phải lớn hơn 0. Script có 8 bảng chính và 5 bảng bổ sung, cùng các view/procedure mẫu. [ERD](schemas/northwind-erd.md) giải thích quan hệ.

Nếu dùng `sqlcmd` thay cho SSMS, tạo database trước rồi chạy (sửa `SERVER_NAME` cho máy của bạn):

```powershell
sqlcmd -S "SERVER_NAME" -E -d NorthwindPractice -b -i "schemas\northwind.sql"
```

`-b` giúp lệnh trả lỗi nếu SQL thất bại. File có các batch `GO`, vì thế không gửi toàn bộ file như một câu lệnh SQL đơn lẻ.

## Website bài tập

Ôn nhanh trước phỏng vấn tại [sổ tay HTML](website/dist/review.html): mô hình Northwind, 13 chủ đề, ví dụ T-SQL, lỗi thường gặp, hỏi đáp và liên kết tới từng bài trong bộ 77 bài. Trang mở trực tiếp, có tìm kiếm chủ đề và nút in/lưu PDF.

Mở [website/dist/index.html](website/dist/index.html) bằng trình duyệt. Website chạy tĩnh, không cần cài package hoặc tài khoản. Bạn cũng có thể phục vụ thư mục `website/dist` bằng một static HTTP server.

- 13 chủ đề, 77 bài tập: SELECT, lọc, JOIN, tổng hợp, subquery/CTE, window functions, T-SQL nâng cao, DML, giao dịch/đồng thời, schema/hiệu năng, view, function/trigger, stored procedure.
- Mỗi bài có vùng tự gõ SQL, gợi ý, đáp án ẩn và nút đánh dấu hoàn thành.
- Bản nháp và tiến độ lưu trong `localStorage` của trình duyệt hiện tại.
- Website **không chạy SQL** và **không tự chấm**. Chạy câu lệnh trong SSMS, đối chiếu dữ liệu và giải thích cách làm. Có thể có nhiều đáp án đúng.

### Cách học đề xuất

1. Đọc đề và tự gõ câu lệnh trong SSMS. Dự đoán số hàng trước khi chạy.
2. Kiểm tra kết quả và các tình huống `NULL`, trùng hàng, thứ tự sắp xếp.
3. Khi bí, mở gợi ý; chỉ mở đáp án sau khi đã thử.
4. Giải thích vì sao chọn JOIN, điều kiện lọc, GROUP BY hoặc index. Với bài ghi dữ liệu, kiểm tra `ROLLBACK` trước khi chạy.

Các bài view, function, trigger và stored procedure sử dụng tiền tố `Practice` để tránh đụng object mẫu. Chúng tạo object trong database luyện tập. Làm các bài có phụ thuộc theo đúng thứ tự (ví dụ tạo bảng audit trước trigger). Cách sạch nhất để bắt đầu lại là tạo mới database luyện tập.

## Import bằng Python (tùy chọn)

`generators/load_northwind.py` là loader dùng `pyodbc`. Nó cần ODBC Driver for SQL Server và database đã tạo. Xem `python generators/load_northwind.py --help`. SSMS hoặc `sqlcmd` là cách đơn giản hơn cho lần đầu.

## Cấu trúc

```text
schemas/northwind.sql          Schema và dữ liệu mẫu SQL Server
schemas/verify_northwind.sql   Kiểm tra import và dữ liệu cần cho bài tập
schemas/northwind-erd.md       Sơ đồ quan hệ
generators/load_northwind.py   Import tùy chọn bằng Python
website/dist/                  Website bài tập tĩnh
```
