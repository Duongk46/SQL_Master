# Scripts - Fake Data Generator

Thư mục này dùng để generate **fake data** và chuẩn bị schema có relationship tốt để luyện SQL (theo hướng series của @e_opore).

## Cấu trúc hiện tại

```
scripts/
├── schemas/                    # Các schema mẫu chuẩn (relationship rõ ràng)
│   ├── northwind.sql           # Official Microsoft Northwind (đã tải sẵn)
│   └── northwind-erd.md        # ERD + giải thích relationship chi tiết
├── seed/                       # Chứa file INSERT .sql (sẽ generate sau)
├── generators/                 # Python + Faker script (dành cho dữ liệu lớn)
└── README.md
```

## Schema đang dùng

**Northwind** (Microsoft official sample) — Schema relationship rất chuẩn cho việc học:

- 8 bảng cốt lõi với đầy đủ loại relationship:
  - 1-N thông thường
  - Many-to-Many (qua bảng `Order Details` có thêm dữ liệu)
  - Self-referencing (`Employees.ReportsTo`)
- Rất phù hợp luyện **DML**, JOIN nhiều bảng, aggregation, window functions.
- Dùng tốt trên **SQL Server**.

Xem chi tiết relationship tại: [schemas/northwind-erd.md](schemas/northwind-erd.md)

## Mục tiêu

- Học relationship + viết query thực tế
- Luyện INSERT/UPDATE/DELETE đúng cách (có transaction, check constraint...)
- Có thể scale lên dữ liệu lớn (chục nghìn → trăm nghìn rows) bằng generator

## Các bước tiếp theo

1. Bạn restore `northwind.sql` vào SQL Server để có dữ liệu mẫu trước.
2. Tôi sẽ xây generator ở `generators/` để tạo thêm dữ liệu lớn hơn theo yêu cầu.
3. Sau đó tạo các file seed theo thứ tự an toàn.

---

**Lưu ý**: Nếu schema trong blob/image của bạn khác với Northwind (ví dụ: có bảng bạn muốn khác), cứ nói rõ domain hoặc liệt kê vài bảng chính là tôi sẽ điều chỉnh ngay (chọn schema khác hoặc customize).

