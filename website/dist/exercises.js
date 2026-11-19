/* Reference answers for SQL Server Northwind. Other correct queries are welcome. */
window.SQL_MODULES = [
  {
    id: "select",
    name: "SELECT cơ bản",
    summary:
      "SELECT chọn cột; FROM chọn bảng; WHERE lọc hàng. Dự đoán số hàng và chỉ lấy cột cần dùng.",
  },
  {
    id: "filter",
    name: "Lọc & sắp xếp",
    summary:
      "Luyện WHERE, LIKE, NULL, khoảng ngày, TOP và ORDER BY. Dùng thứ tự phụ để kết quả ổn định.",
  },
  {
    id: "join",
    name: "JOIN & quan hệ",
    summary:
      "Đọc khóa ngoại, chọn INNER/LEFT JOIN theo hàng cần giữ, nhận ra khi JOIN làm tăng số hàng.",
  },
  {
    id: "aggregate",
    name: "GROUP BY & thống kê",
    summary:
      "GROUP BY tạo nhóm; COUNT, AVG, SUM tính theo nhóm; HAVING lọc nhóm. Giá đơn nằm trong Order Details.",
  },
  {
    id: "cte",
    name: "Subquery & CTE",
    summary:
      "EXISTS kiểm tra sự tồn tại; CTE chia truy vấn thành bước rõ ràng; recursive CTE đi qua cây nhân viên.",
  },
  {
    id: "window",
    name: "Window functions",
    summary:
      "OVER giữ từng hàng trong kết quả và tính xếp hạng, giá trị trước, tổng lũy kế theo partition hoặc thứ tự.",
  },
  {
    id: "advanced",
    name: "T-SQL nâng cao",
    summary:
      "Áp dụng CASE, COALESCE, UNION, OUTER APPLY, bảng tạm và GROUPING SETS cho báo cáo thực tế.",
  },
  {
    id: "dml",
    name: "DML & transaction",
    summary:
      "INSERT/UPDATE/DELETE cần WHERE, constraint và transaction. Các bài thực hành dùng ROLLBACK để giữ dữ liệu mẫu.",
  },
  {
    id: "concurrency",
    name: "Giao dịch & đồng thời",
    summary:
      "Kiểm tra XACT_STATE, khóa hàng khi cập nhật tồn kho, phát hiện ghi đè và hiểu mức cô lập giữa hai phiên SQL.",
  },
  {
    id: "design",
    name: "Schema & hiệu năng",
    summary:
      "Đọc khóa, tạo ràng buộc và index phù hợp với truy vấn. So sánh Actual Execution Plan và logical reads.",
  },
  {
    id: "view",
    name: "View & tái sử dụng",
    summary:
      "View đóng gói truy vấn để tái sử dụng. Đọc định nghĩa view mẫu trước khi tạo view Practice.",
  },
  {
    id: "function",
    name: "Function & trigger",
    summary:
      "Function tái sử dụng phép tính hoặc tập kết quả; trigger phải xử lý đúng cả lệnh UPDATE nhiều hàng.",
  },
  {
    id: "procedure",
    name: "Stored procedure",
    summary:
      "Tạo procedure có tham số, OUTPUT, kiểm tra đầu vào, TRY/CATCH và transaction; gọi bằng EXEC.",
  },
];

const lessons = [
  [
    "select",
    "Cơ bản",
    [
      [
        "Danh sách khách hàng",
        "Lấy CustomerID, CompanyName, City, Country của tất cả khách hàng.",
        "Chỉ chọn bốn cột cần dùng.",
        `SELECT CustomerID, CompanyName, City, Country
FROM dbo.Customers;`,
      ],
      [
        "Sản phẩm và giá",
        "Lấy ProductID, ProductName, UnitPrice. Đặt bí danh GiaBan cho UnitPrice.",
        "Dùng AS.",
        `SELECT ProductID, ProductName, UnitPrice AS GiaBan
FROM dbo.Products;`,
      ],
      [
        "Các quốc gia khách hàng",
        "Liệt kê các Country khác nhau trong Customers, bỏ NULL.",
        "DISTINCT và IS NOT NULL.",
        `SELECT DISTINCT Country
FROM dbo.Customers
WHERE Country IS NOT NULL;`,
      ],
      [
        "Sản phẩm ngừng bán",
        "Lấy tên và giá của sản phẩm có Discontinued = 1.",
        "Cột này là bit.",
        `SELECT ProductName, UnitPrice
FROM dbo.Products
WHERE Discontinued = 1;`,
      ],
      [
        "Giá sau giảm giả định",
        "Hiển thị ProductName, UnitPrice và giá sau giảm 10% tên DiscountedPrice. Không sửa dữ liệu.",
        "Tính ngay trong SELECT.",
        `SELECT ProductName, UnitPrice,
       UnitPrice * 0.90 AS DiscountedPrice
FROM dbo.Products;`,
      ],
      [
        "Số sản phẩm",
        "Đếm tất cả hàng trong Products, đặt tên ProductCount.",
        "COUNT(*).",
        `SELECT COUNT(*) AS ProductCount
FROM dbo.Products;`,
      ],
    ],
  ],
  [
    "filter",
    "Cơ bản",
    [
      [
        "Khách hàng tại Đức",
        "Lấy CompanyName và City của khách hàng ở Germany. Sắp theo tên công ty A-Z.",
        "WHERE rồi ORDER BY.",
        `SELECT CompanyName, City
FROM dbo.Customers
WHERE Country = N'Germany'
ORDER BY CompanyName;`,
      ],
      [
        "Khoảng giá",
        "Tìm sản phẩm có UnitPrice từ 20 đến 50, kể cả hai đầu.",
        "BETWEEN bao gồm hai ranh giới.",
        `SELECT ProductID, ProductName, UnitPrice
FROM dbo.Products
WHERE UnitPrice BETWEEN 20 AND 50
ORDER BY UnitPrice, ProductID;`,
      ],
      [
        "Tên bắt đầu bằng C",
        "Tìm sản phẩm có ProductName bắt đầu bằng C.",
        "LIKE với %. ",
        `SELECT ProductID, ProductName
FROM dbo.Products
WHERE ProductName LIKE N'C%';`,
      ],
      [
        "Đơn chưa giao",
        "Lấy OrderID, CustomerID, OrderDate của đơn có ShippedDate là NULL.",
        "Không dùng = NULL.",
        `SELECT OrderID, CustomerID, OrderDate
FROM dbo.Orders
WHERE ShippedDate IS NULL;`,
      ],
      [
        "Đơn trong năm 1997",
        "Lấy đơn từ đầu 1997 đến trước đầu 1998, mới nhất trước.",
        "Dùng khoảng nửa mở để xử lý phần giờ của datetime.",
        `SELECT OrderID, CustomerID, OrderDate
FROM dbo.Orders
WHERE OrderDate >= '19970101'
  AND OrderDate < '19980101'
ORDER BY OrderDate DESC, OrderID DESC;`,
      ],
      [
        "10 đơn gần nhất",
        "Lấy 10 đơn mới nhất; nếu cùng ngày, OrderID lớn hơn trước.",
        "TOP cần ORDER BY.",
        `SELECT TOP (10) OrderID, CustomerID, OrderDate
FROM dbo.Orders
ORDER BY OrderDate DESC, OrderID DESC;`,
      ],
    ],
  ],
  [
    "join",
    "Trung cấp",
    [
      [
        "Đơn và tên khách",
        "Lấy OrderID, OrderDate, CompanyName cho đơn có khách tương ứng.",
        "JOIN theo CustomerID.",
        `SELECT o.OrderID, o.OrderDate, c.CompanyName
FROM dbo.Orders AS o
JOIN dbo.Customers AS c ON c.CustomerID = o.CustomerID;`,
      ],
      [
        "Khách chưa từng đặt",
        "Tìm khách hàng chưa có đơn; trả CustomerID, CompanyName.",
        "LEFT JOIN rồi kiểm tra khóa phía phải là NULL.",
        `SELECT c.CustomerID, c.CompanyName
FROM dbo.Customers AS c
LEFT JOIN dbo.Orders AS o ON o.CustomerID = c.CustomerID
WHERE o.OrderID IS NULL;`,
      ],
      [
        "Sản phẩm và danh mục",
        "Lấy tên sản phẩm, tên category và giá. Giữ sản phẩm chưa có category.",
        "CategoryID có thể NULL.",
        `SELECT p.ProductName, c.CategoryName, p.UnitPrice
FROM dbo.Products AS p
LEFT JOIN dbo.Categories AS c ON c.CategoryID = p.CategoryID;`,
      ],
      [
        "Chi tiết đơn hàng",
        "Lấy OrderID, ProductName, Quantity, UnitPrice từ Order Details và Products.",
        "Tên bảng có dấu cách cần đặt trong [ ].",
        `SELECT od.OrderID, p.ProductName, od.Quantity, od.UnitPrice
FROM dbo.[Order Details] AS od
JOIN dbo.Products AS p ON p.ProductID = od.ProductID;`,
      ],
      [
        "Nhân viên và quản lý",
        "Lấy tên nhân viên và tên quản lý; giữ nhân viên không có quản lý.",
        "Self join Employees qua ReportsTo.",
        `SELECT e.EmployeeID,
       e.FirstName + N' ' + e.LastName AS EmployeeName,
       m.FirstName + N' ' + m.LastName AS ManagerName
FROM dbo.Employees AS e
LEFT JOIN dbo.Employees AS m ON m.EmployeeID = e.ReportsTo;`,
      ],
      [
        "Đơn hàng đầy đủ",
        "Lấy OrderID, tên khách, nhân viên và hãng vận chuyển. Giữ đơn có khóa ngoại NULL.",
        "Bắt đầu từ Orders và dùng ba LEFT JOIN.",
        `SELECT o.OrderID, c.CompanyName AS CustomerName,
       e.FirstName + N' ' + e.LastName AS EmployeeName,
       s.CompanyName AS ShipperName
FROM dbo.Orders AS o
LEFT JOIN dbo.Customers AS c ON c.CustomerID = o.CustomerID
LEFT JOIN dbo.Employees AS e ON e.EmployeeID = o.EmployeeID
LEFT JOIN dbo.Shippers AS s ON s.ShipperID = o.ShipVia;`,
      ],
    ],
  ],
  [
    "aggregate",
    "Trung cấp",
    [
      [
        "Số đơn của từng khách",
        "Hiển thị mọi khách và số đơn, kể cả 0 đơn; sắp giảm dần.",
        "COUNT(o.OrderID), không dùng COUNT(*).",
        `SELECT c.CustomerID, c.CompanyName,
       COUNT(o.OrderID) AS OrderCount
FROM dbo.Customers AS c
LEFT JOIN dbo.Orders AS o ON o.CustomerID = c.CustomerID
GROUP BY c.CustomerID, c.CompanyName
ORDER BY OrderCount DESC, c.CustomerID;`,
      ],
      [
        "Giá trung bình theo danh mục",
        "Hiển thị CategoryName, số sản phẩm có giá, giá trung bình.",
        "COUNT và AVG bỏ qua NULL.",
        `SELECT c.CategoryName,
       COUNT(p.UnitPrice) AS PricedProducts,
       AVG(p.UnitPrice) AS AveragePrice
FROM dbo.Categories AS c
LEFT JOIN dbo.Products AS p ON p.CategoryID = c.CategoryID
GROUP BY c.CategoryID, c.CategoryName;`,
      ],
      [
        "Giá trị từng đơn",
        "Tính tổng tiền hàng mỗi OrderID bằng UnitPrice * Quantity * (1 - Discount).",
        "Nhóm theo OrderID trong Order Details.",
        `SELECT OrderID,
       SUM(UnitPrice * Quantity * (1 - Discount)) AS OrderTotal
FROM dbo.[Order Details]
GROUP BY OrderID
ORDER BY OrderID;`,
      ],
      [
        "Khách có ít nhất 10 đơn",
        "Lấy CustomerID và số đơn của khách có ít nhất 10 đơn.",
        "HAVING lọc nhóm.",
        `SELECT CustomerID, COUNT(*) AS OrderCount
FROM dbo.Orders
WHERE CustomerID IS NOT NULL
GROUP BY CustomerID
HAVING COUNT(*) >= 10
ORDER BY OrderCount DESC, CustomerID;`,
      ],
      [
        "Doanh thu theo tháng",
        "Tính doanh thu theo năm và tháng đặt hàng; bỏ đơn không có ngày.",
        "JOIN Orders với Order Details rồi GROUP BY.",
        `SELECT YEAR(o.OrderDate) AS OrderYear,
       MONTH(o.OrderDate) AS OrderMonth,
       SUM(od.UnitPrice * od.Quantity * (1 - od.Discount)) AS Revenue
FROM dbo.Orders AS o
JOIN dbo.[Order Details] AS od ON od.OrderID = o.OrderID
WHERE o.OrderDate IS NOT NULL
GROUP BY YEAR(o.OrderDate), MONTH(o.OrderDate)
ORDER BY OrderYear, OrderMonth;`,
      ],
      [
        "Top 5 khách theo doanh thu",
        "Lấy 5 khách có doanh thu cao nhất: ID, tên và Revenue.",
        "JOIN ba bảng rồi nhóm theo khách.",
        `SELECT TOP (5) c.CustomerID, c.CompanyName,
       SUM(od.UnitPrice * od.Quantity * (1 - od.Discount)) AS Revenue
FROM dbo.Customers AS c
JOIN dbo.Orders AS o ON o.CustomerID = c.CustomerID
JOIN dbo.[Order Details] AS od ON od.OrderID = o.OrderID
GROUP BY c.CustomerID, c.CompanyName
ORDER BY Revenue DESC, c.CustomerID;`,
      ],
    ],
  ],
  [
    "cte",
    "Trung cấp",
    [
      [
        "Đắt hơn trung bình",
        "Tìm sản phẩm có UnitPrice lớn hơn giá trung bình toàn bộ sản phẩm.",
        "Subquery trả AVG(UnitPrice).",
        `SELECT ProductID, ProductName, UnitPrice
FROM dbo.Products
WHERE UnitPrice > (SELECT AVG(UnitPrice) FROM dbo.Products)
ORDER BY UnitPrice DESC;`,
      ],
      [
        "Khách có đơn",
        "Lấy mỗi khách có ít nhất một đơn đúng một lần.",
        "EXISTS tránh nhân bản từ JOIN.",
        `SELECT c.CustomerID, c.CompanyName
FROM dbo.Customers AS c
WHERE EXISTS (
    SELECT 1 FROM dbo.Orders AS o
    WHERE o.CustomerID = c.CustomerID
);`,
      ],
      [
        "Sản phẩm chưa bán",
        "Lấy ProductID và ProductName của sản phẩm chưa xuất hiện trong Order Details.",
        "NOT EXISTS theo ProductID.",
        `SELECT p.ProductID, p.ProductName
FROM dbo.Products AS p
WHERE NOT EXISTS (
    SELECT 1 FROM dbo.[Order Details] AS od
    WHERE od.ProductID = p.ProductID
);`,
      ],
      [
        "Đơn vượt trung bình",
        "Dùng CTE tính tổng mỗi đơn rồi lấy đơn có tổng lớn hơn trung bình các đơn.",
        "CTE OrderTotals rồi so với AVG.",
        `WITH OrderTotals AS (
    SELECT OrderID,
           SUM(UnitPrice * Quantity * (1 - Discount)) AS OrderTotal
    FROM dbo.[Order Details]
    GROUP BY OrderID
)
SELECT OrderID, OrderTotal
FROM OrderTotals
WHERE OrderTotal > (SELECT AVG(OrderTotal) FROM OrderTotals)
ORDER BY OrderTotal DESC;`,
      ],
      [
        "Khách chi tiêu trên 10000",
        "Dùng CTE tính tổng chi tiêu mỗi khách rồi lấy khách chi tiêu hơn 10000.",
        "Tổng hợp trước, JOIN lấy tên sau.",
        `WITH CustomerSpend AS (
    SELECT o.CustomerID,
           SUM(od.UnitPrice * od.Quantity * (1 - od.Discount)) AS Spend
    FROM dbo.Orders AS o
    JOIN dbo.[Order Details] AS od ON od.OrderID = o.OrderID
    WHERE o.CustomerID IS NOT NULL
    GROUP BY o.CustomerID
)
SELECT c.CustomerID, c.CompanyName, s.Spend
FROM CustomerSpend AS s
JOIN dbo.Customers AS c ON c.CustomerID = s.CustomerID
WHERE s.Spend > 10000
ORDER BY s.Spend DESC;`,
      ],
      [
        "Cây quản lý nhân viên",
        "Dùng recursive CTE liệt kê nhân viên, quản lý và cấp bậc từ người không có quản lý.",
        "Anchor ReportsTo IS NULL; member nối ReportsTo với EmployeeID.",
        `WITH EmployeeTree AS (
    SELECT EmployeeID, FirstName + N' ' + LastName AS EmployeeName,
           ReportsTo, 0 AS LevelNo
    FROM dbo.Employees WHERE ReportsTo IS NULL
    UNION ALL
    SELECT e.EmployeeID, e.FirstName + N' ' + e.LastName,
           e.ReportsTo, t.LevelNo + 1
    FROM dbo.Employees AS e
    JOIN EmployeeTree AS t ON e.ReportsTo = t.EmployeeID
)
SELECT EmployeeID, EmployeeName, ReportsTo, LevelNo
FROM EmployeeTree
ORDER BY LevelNo, EmployeeID
OPTION (MAXRECURSION 100);`,
      ],
    ],
  ],
  [
    "window",
    "Nâng cao",
    [
      [
        "Đánh số đơn theo khách",
        "Đánh số đơn mới nhất trong từng khách hàng.",
        "ROW_NUMBER với PARTITION BY CustomerID.",
        `SELECT OrderID, CustomerID, OrderDate,
       ROW_NUMBER() OVER (
           PARTITION BY CustomerID
           ORDER BY OrderDate DESC, OrderID DESC
       ) AS OrderRank
FROM dbo.Orders
WHERE CustomerID IS NOT NULL;`,
      ],
      [
        "Đơn mới nhất mỗi khách",
        "Lấy đúng một đơn mới nhất của mỗi khách. Nếu ngày bằng nhau, lấy OrderID lớn hơn.",
        "CTE dùng ROW_NUMBER rồi lọc rn = 1.",
        `WITH RankedOrders AS (
    SELECT OrderID, CustomerID, OrderDate,
           ROW_NUMBER() OVER (
               PARTITION BY CustomerID
               ORDER BY OrderDate DESC, OrderID DESC
           ) AS rn
    FROM dbo.Orders WHERE CustomerID IS NOT NULL
)
SELECT CustomerID, OrderID, OrderDate
FROM RankedOrders WHERE rn = 1;`,
      ],
      [
        "Top 3 giá mỗi danh mục",
        "Trong mỗi category, lấy 3 sản phẩm đắt nhất; nếu cùng giá, ProductID nhỏ hơn trước.",
        "ROW_NUMBER theo CategoryID.",
        `WITH RankedProducts AS (
    SELECT ProductID, ProductName, CategoryID, UnitPrice,
           ROW_NUMBER() OVER (
               PARTITION BY CategoryID
               ORDER BY UnitPrice DESC, ProductID
           ) AS rn
    FROM dbo.Products
)
SELECT CategoryID, ProductID, ProductName, UnitPrice
FROM RankedProducts
WHERE rn <= 3
ORDER BY CategoryID, rn;`,
      ],
      [
        "Doanh thu lũy kế",
        "Tính doanh thu mỗi tháng và tổng lũy kế đến tháng đó.",
        "Tổng hợp theo tháng rồi SUM OVER với ROWS.",
        `WITH MonthlyRevenue AS (
    SELECT YEAR(o.OrderDate) AS OrderYear,
           MONTH(o.OrderDate) AS OrderMonth,
           SUM(od.UnitPrice * od.Quantity * (1 - od.Discount)) AS Revenue
    FROM dbo.Orders AS o
    JOIN dbo.[Order Details] AS od ON od.OrderID = o.OrderID
    WHERE o.OrderDate IS NOT NULL
    GROUP BY YEAR(o.OrderDate), MONTH(o.OrderDate)
)
SELECT OrderYear, OrderMonth, Revenue,
       SUM(Revenue) OVER (
           ORDER BY OrderYear, OrderMonth
           ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW
       ) AS RunningRevenue
FROM MonthlyRevenue
ORDER BY OrderYear, OrderMonth;`,
      ],
      [
        "So với tháng trước",
        "Tính chênh lệch doanh thu tháng này so với tháng trước có dữ liệu.",
        "LAG(Revenue) theo năm và tháng.",
        `WITH MonthlyRevenue AS (
    SELECT YEAR(o.OrderDate) AS OrderYear,
           MONTH(o.OrderDate) AS OrderMonth,
           SUM(od.UnitPrice * od.Quantity * (1 - od.Discount)) AS Revenue
    FROM dbo.Orders AS o
    JOIN dbo.[Order Details] AS od ON od.OrderID = o.OrderID
    WHERE o.OrderDate IS NOT NULL
    GROUP BY YEAR(o.OrderDate), MONTH(o.OrderDate)
), WithPrevious AS (
    SELECT *, LAG(Revenue) OVER (
        ORDER BY OrderYear, OrderMonth
    ) AS PreviousRevenue
    FROM MonthlyRevenue
)
SELECT OrderYear, OrderMonth, Revenue, PreviousRevenue,
       Revenue - PreviousRevenue AS ChangeFromPrevious
FROM WithPrevious
ORDER BY OrderYear, OrderMonth;`,
      ],
      [
        "Hạng doanh thu khách",
        "Xếp hạng khách hàng theo doanh thu; doanh thu bằng nhau cùng hạng.",
        "DENSE_RANK trên CTE tổng doanh thu.",
        `WITH CustomerRevenue AS (
    SELECT o.CustomerID,
           SUM(od.UnitPrice * od.Quantity * (1 - od.Discount)) AS Revenue
    FROM dbo.Orders AS o
    JOIN dbo.[Order Details] AS od ON od.OrderID = o.OrderID
    WHERE o.CustomerID IS NOT NULL
    GROUP BY o.CustomerID
)
SELECT CustomerID, Revenue,
       DENSE_RANK() OVER (ORDER BY Revenue DESC) AS RevenueRank
FROM CustomerRevenue
ORDER BY RevenueRank, CustomerID;`,
      ],
    ],
  ],
  [
    "advanced",
    "Nâng cao",
    [
      [
        "Trạng thái vận chuyển",
        "Hiển thị OrderID và trạng thái: Chua giao nếu ShippedDate NULL, Giao tre nếu sau RequiredDate, còn lại Dung han.",
        "CASE WHEN; RequiredDate có thể NULL.",
        `SELECT OrderID,
       CASE
         WHEN ShippedDate IS NULL THEN N'Chua giao'
         WHEN RequiredDate IS NOT NULL AND ShippedDate > RequiredDate THEN N'Giao tre'
         ELSE N'Dung han'
       END AS ShippingStatus
FROM dbo.Orders;`,
      ],
      [
        "Tên vùng thay thế",
        "Lấy CustomerID, City và Region; nếu Region NULL, trả Chua co vung dưới tên RegionDisplay.",
        "COALESCE.",
        `SELECT CustomerID, City,
       COALESCE(Region, N'Chua co vung') AS RegionDisplay
FROM dbo.Customers;`,
      ],
      [
        "Danh sách thành phố",
        "Liệt kê mỗi City khác NULL từ Customers và Suppliers thành một danh sách không trùng.",
        "UNION loại trùng; UNION ALL giữ trùng.",
        `SELECT City FROM dbo.Customers WHERE City IS NOT NULL
UNION
SELECT City FROM dbo.Suppliers WHERE City IS NOT NULL
ORDER BY City;`,
      ],
      [
        "Thống kê đơn theo trạng thái",
        "Đếm tổng đơn, số đơn đã giao và chưa giao cho mỗi CustomerID.",
        "SUM(CASE WHEN ... THEN 1 ELSE 0 END).",
        `SELECT CustomerID,
       COUNT(*) AS TotalOrders,
       SUM(CASE WHEN ShippedDate IS NOT NULL THEN 1 ELSE 0 END) AS ShippedOrders,
       SUM(CASE WHEN ShippedDate IS NULL THEN 1 ELSE 0 END) AS OpenOrders
FROM dbo.Orders
WHERE CustomerID IS NOT NULL
GROUP BY CustomerID;`,
      ],
      [
        "Đơn cuối qua OUTER APPLY",
        "Lấy mỗi khách và đơn mới nhất của họ; giữ khách chưa có đơn.",
        "OUTER APPLY với TOP 1 ORDER BY.",
        `SELECT c.CustomerID, c.CompanyName,
       lastOrder.OrderID, lastOrder.OrderDate
FROM dbo.Customers AS c
OUTER APPLY (
    SELECT TOP (1) o.OrderID, o.OrderDate
    FROM dbo.Orders AS o
    WHERE o.CustomerID = c.CustomerID
    ORDER BY o.OrderDate DESC, o.OrderID DESC
) AS lastOrder;`,
      ],
      [
        "Bảng tạm cho báo cáo",
        "Dùng #OrderTotals lưu tổng tiền mỗi đơn; lấy 10 đơn lớn nhất rồi xóa bảng tạm.",
        "SELECT ... INTO #OrderTotals.",
        `SELECT OrderID,
       SUM(UnitPrice * Quantity * (1 - Discount)) AS OrderTotal
INTO #OrderTotals
FROM dbo.[Order Details]
GROUP BY OrderID;

SELECT TOP (10) OrderID, OrderTotal
FROM #OrderTotals
ORDER BY OrderTotal DESC, OrderID;

DROP TABLE #OrderTotals;`,
      ],
      [
        "Sản phẩm đắt nhất mỗi danh mục",
        "Lấy tất cả sản phẩm cùng mức giá cao nhất trong từng category, kể cả khi đồng hạng.",
        "Dùng DENSE_RANK thay vì ROW_NUMBER.",
        `WITH Ranked AS (
    SELECT ProductID, ProductName, CategoryID, UnitPrice,
           DENSE_RANK() OVER (
             PARTITION BY CategoryID ORDER BY UnitPrice DESC
           ) AS PriceRank
    FROM dbo.Products
    WHERE UnitPrice IS NOT NULL
)
SELECT ProductID, ProductName, CategoryID, UnitPrice
FROM Ranked WHERE PriceRank = 1
ORDER BY CategoryID, ProductID;`,
      ],
      [
        "Tổng hợp theo năm và quốc gia",
        "Lấy doanh thu mỗi năm theo ShipCountry và thêm dòng tổng toàn bộ mỗi năm.",
        "GROUPING SETS: (year, country) và (year).",
        `SELECT YEAR(o.OrderDate) AS OrderYear,
       CASE WHEN GROUPING(o.ShipCountry) = 1 THEN N'Tat ca'
            ELSE COALESCE(o.ShipCountry, N'Khong ro') END AS ShipCountry,
       SUM(od.UnitPrice * od.Quantity * (1 - od.Discount)) AS Revenue
FROM dbo.Orders AS o
JOIN dbo.[Order Details] AS od ON od.OrderID = o.OrderID
WHERE o.OrderDate IS NOT NULL
GROUP BY GROUPING SETS (
    (YEAR(o.OrderDate), o.ShipCountry),
    (YEAR(o.OrderDate))
)
ORDER BY OrderYear, ShipCountry;`,
      ],
    ],
  ],
  [
    "dml",
    "Trung cấp",
    [
      [
        "Thêm khách thử nghiệm",
        "Trong transaction thêm khách PRACT / Practice Customer, kiểm tra hàng mới rồi ROLLBACK.",
        "CustomerID là nchar(5).",
        `BEGIN TRANSACTION;
INSERT INTO dbo.Customers (CustomerID, CompanyName)
VALUES (N'PRACT', N'Practice Customer');
SELECT CustomerID, CompanyName
FROM dbo.Customers WHERE CustomerID = N'PRACT';
ROLLBACK TRANSACTION;`,
      ],
      [
        "Cập nhật có điều kiện",
        "Trong transaction tăng 5% giá ProductID = 1; OUTPUT giá cũ và mới; ROLLBACK.",
        "UPDATE ... OUTPUT deleted, inserted.",
        `BEGIN TRANSACTION;
UPDATE dbo.Products
SET UnitPrice = UnitPrice * 1.05
OUTPUT deleted.ProductID, deleted.UnitPrice AS OldPrice,
       inserted.UnitPrice AS NewPrice
WHERE ProductID = 1;
ROLLBACK TRANSACTION;`,
      ],
      [
        "Xóa khách không có đơn",
        "Xóa khách PRACT chỉ khi họ không có đơn. Dùng transaction và ROLLBACK.",
        "NOT EXISTS với Orders.",
        `BEGIN TRANSACTION;
DELETE c FROM dbo.Customers AS c
WHERE c.CustomerID = N'PRACT'
  AND NOT EXISTS (
      SELECT 1 FROM dbo.Orders AS o
      WHERE o.CustomerID = c.CustomerID
  );
SELECT @@ROWCOUNT AS DeletedRows;
ROLLBACK TRANSACTION;`,
      ],
      [
        "Tạo đơn và chi tiết",
        "Trong transaction thêm đơn của ALFKI và hai dòng cho ProductID 1, 2; lấy OrderID mới; ROLLBACK.",
        "SCOPE_IDENTITY, TRY/CATCH, giá từ Products.",
        `SET XACT_ABORT ON;
BEGIN TRY
    BEGIN TRANSACTION;
    INSERT INTO dbo.Orders (CustomerID, OrderDate)
    VALUES (N'ALFKI', GETDATE());
    DECLARE @OrderID int = CONVERT(int, SCOPE_IDENTITY());
    INSERT INTO dbo.[Order Details]
        (OrderID, ProductID, UnitPrice, Quantity, Discount)
    SELECT @OrderID, ProductID, UnitPrice, 1, 0
    FROM dbo.Products
    WHERE ProductID IN (1, 2) AND UnitPrice IS NOT NULL;
    SELECT @OrderID AS NewOrderID;
    ROLLBACK TRANSACTION;
END TRY
BEGIN CATCH
    IF @@TRANCOUNT > 0 ROLLBACK TRANSACTION;
    THROW;
END CATCH;`,
      ],
      [
        "Kiểm tra constraint",
        "Thử thêm Order Details có Quantity = 0; bắt lỗi CHECK và rollback.",
        "CK_Quantity yêu cầu Quantity > 0.",
        `BEGIN TRY
    BEGIN TRANSACTION;
    DECLARE @ExistingOrderID int =
        (SELECT MIN(OrderID) FROM dbo.Orders);
    INSERT INTO dbo.[Order Details]
        (OrderID, ProductID, UnitPrice, Quantity, Discount)
    VALUES (@ExistingOrderID, 1, 10, 0, 0);
    ROLLBACK TRANSACTION;
END TRY
BEGIN CATCH
    SELECT ERROR_MESSAGE() AS ConstraintError;
    IF @@TRANCOUNT > 0 ROLLBACK TRANSACTION;
END CATCH;`,
      ],
      [
        "Xóa theo quan hệ",
        "Viết SQL xóa một đơn thử nghiệm cùng các dòng chi tiết theo thứ tự an toàn; ROLLBACK.",
        "Xóa bảng con trước rồi bảng cha.",
        `BEGIN TRANSACTION;
DECLARE @OrderID int = -1; -- thay bằng ID đơn thử nghiệm
DELETE FROM dbo.[Order Details] WHERE OrderID = @OrderID;
DELETE FROM dbo.Orders WHERE OrderID = @OrderID;
ROLLBACK TRANSACTION;`,
      ],
    ],
  ],
  [
    "concurrency",
    "Nâng cao",
    [
      [
        "XACT_STATE khi có lỗi",
        "Trong transaction, thử INSERT Order Details với Quantity = 0. Bắt lỗi, xem XACT_STATE rồi rollback an toàn.",
        "Dùng TRY/CATCH và SET XACT_ABORT ON.",
        `SET XACT_ABORT ON;
BEGIN TRY
    BEGIN TRANSACTION;
    DECLARE @OrderID int = (SELECT MIN(OrderID) FROM dbo.Orders);
    INSERT INTO dbo.[Order Details]
        (OrderID, ProductID, UnitPrice, Quantity, Discount)
    VALUES (@OrderID, 1, 10, 0, 0);
    COMMIT TRANSACTION;
END TRY
BEGIN CATCH
    SELECT XACT_STATE() AS TransactionState,
           ERROR_MESSAGE() AS ErrorMessage;
    IF XACT_STATE() <> 0 ROLLBACK TRANSACTION;
END CATCH;`,
      ],
      [
        "Giữ khóa khi trừ tồn kho",
        "Trong transaction, đọc UnitsInStock của ProductID 1 với khóa cập nhật, kiểm tra đủ 1 đơn vị, giảm tồn kho rồi rollback.",
        "UPDLOCK và HOLDLOCK trong SELECT; TRY/CATCH.",
        `SET XACT_ABORT ON;
BEGIN TRY
    BEGIN TRANSACTION;
    DECLARE @Stock smallint;
    SELECT @Stock = UnitsInStock
    FROM dbo.Products WITH (UPDLOCK, HOLDLOCK)
    WHERE ProductID = 1;
    IF @Stock IS NULL OR @Stock < 1
        THROW 51020, 'Insufficient stock.', 1;
    UPDATE dbo.Products
    SET UnitsInStock = UnitsInStock - 1
    WHERE ProductID = 1;
    SELECT ProductID, UnitsInStock
    FROM dbo.Products WHERE ProductID = 1;
    ROLLBACK TRANSACTION;
END TRY
BEGIN CATCH
    IF XACT_STATE() <> 0 ROLLBACK TRANSACTION;
    THROW;
END CATCH;`,
      ],
      [
        "Phát hiện ghi đè",
        "Đọc giá ProductID 1, rồi UPDATE chỉ khi giá vẫn bằng giá đã đọc. Nếu 0 hàng được sửa, báo xung đột; rollback.",
        "So giá trong WHERE và kiểm tra @@ROWCOUNT.",
        `DECLARE @ExpectedPrice money =
    (SELECT UnitPrice FROM dbo.Products WHERE ProductID = 1);
BEGIN TRY
    BEGIN TRANSACTION;
    UPDATE dbo.Products
    SET UnitPrice = UnitPrice + 1
    WHERE ProductID = 1 AND UnitPrice = @ExpectedPrice;
    IF @@ROWCOUNT <> 1
        THROW 51021, 'Price changed; retry the operation.', 1;
    ROLLBACK TRANSACTION;
END TRY
BEGIN CATCH
    IF XACT_STATE() <> 0 ROLLBACK TRANSACTION;
    THROW;
END CATCH;`,
      ],
      [
        "Quan sát dirty read",
        "Mở hai cửa sổ query SSMS trên cùng database. A sửa giá ProductID 1 mà chưa commit; B đọc với READ UNCOMMITTED; sau đó A rollback.",
        "Chạy các phần có nhãn ở hai cửa sổ khác nhau.",
        `-- Cửa sổ A: chạy trước, giữ transaction mở
BEGIN TRANSACTION;
UPDATE dbo.Products SET UnitPrice = UnitPrice + 1
WHERE ProductID = 1;
-- Dừng tại đây, chuyển sang cửa sổ B.

-- Cửa sổ B: chạy riêng trong cửa sổ khác
SET TRANSACTION ISOLATION LEVEL READ UNCOMMITTED;
SELECT ProductID, UnitPrice FROM dbo.Products WHERE ProductID = 1;
SET TRANSACTION ISOLATION LEVEL READ COMMITTED;

-- Trở lại cửa sổ A
ROLLBACK TRANSACTION;`,
      ],
      [
        "Rollback một phần với savepoint",
        "Trong transaction, sửa tồn kho ProductID 1, tạo savepoint, sửa thêm giá; rollback về savepoint, kiểm tra hai cột rồi rollback toàn bộ.",
        "SAVE TRANSACTION và ROLLBACK TRANSACTION tên savepoint.",
        `BEGIN TRANSACTION;
UPDATE dbo.Products SET UnitsInStock = UnitsInStock + 1
WHERE ProductID = 1;
SAVE TRANSACTION BeforePriceChange;
UPDATE dbo.Products SET UnitPrice = UnitPrice + 1
WHERE ProductID = 1;
ROLLBACK TRANSACTION BeforePriceChange;
SELECT ProductID, UnitsInStock, UnitPrice
FROM dbo.Products WHERE ProductID = 1;
ROLLBACK TRANSACTION;`,
      ],
    ],
  ],
  [
    "design",
    "Nâng cao",
    [
      [
        "Đọc khóa ngoại",
        "Liệt kê tên foreign key, bảng nguồn và bảng đích trong database hiện tại.",
        "sys.foreign_keys nối sys.tables.",
        `SELECT fk.name AS ForeignKeyName,
       child.name AS FromTable, parent.name AS ToTable
FROM sys.foreign_keys AS fk
JOIN sys.tables AS child ON child.object_id = fk.parent_object_id
JOIN sys.tables AS parent ON parent.object_id = fk.referenced_object_id
ORDER BY FromTable, ForeignKeyName;`,
      ],
      [
        "Bảng có unique key",
        "Tạo dbo.PracticeTags với TagID identity primary key và TagName nvarchar(50) unique not null.",
        "CREATE TABLE với PRIMARY KEY và UNIQUE.",
        `CREATE TABLE dbo.PracticeTags (
    TagID int IDENTITY(1,1) NOT NULL PRIMARY KEY,
    TagName nvarchar(50) NOT NULL UNIQUE
);`,
      ],
      [
        "Index đơn theo khách",
        "Kiểm tra index hiện có. Tạo index ghép phục vụ lọc CustomerID, sắp OrderDate mới nhất.",
        "Khóa (CustomerID, OrderDate DESC); có thể INCLUDE OrderID.",
        `SELECT i.name, c.name AS ColumnName, ic.key_ordinal
FROM sys.indexes AS i
JOIN sys.index_columns AS ic
  ON ic.object_id = i.object_id AND ic.index_id = i.index_id
JOIN sys.columns AS c
  ON c.object_id = ic.object_id AND c.column_id = ic.column_id
WHERE i.object_id = OBJECT_ID(N'dbo.Orders')
ORDER BY i.name, ic.key_ordinal;

CREATE INDEX IX_Practice_Orders_Customer_Date
ON dbo.Orders (CustomerID, OrderDate DESC)
INCLUDE (OrderID);`,
      ],
      [
        "Phân trang đơn",
        "Lấy trang 3, mỗi trang 20 đơn, mới nhất trước; thứ tự phải ổn định.",
        "OFFSET 40 ROWS FETCH NEXT 20 ROWS ONLY.",
        `SELECT OrderID, CustomerID, OrderDate
FROM dbo.Orders
ORDER BY OrderDate DESC, OrderID DESC
OFFSET 40 ROWS FETCH NEXT 20 ROWS ONLY;`,
      ],
      [
        "So execution plan",
        "So hai cách lọc đơn năm 1997: YEAR(OrderDate) và khoảng ngày. Bật STATISTICS IO, xem Actual Execution Plan.",
        "Kiểm tra logical reads và index seek/scan.",
        `SET STATISTICS IO ON;
SELECT OrderID FROM dbo.Orders
WHERE YEAR(OrderDate) = 1997;
SELECT OrderID FROM dbo.Orders
WHERE OrderDate >= '19970101'
  AND OrderDate < '19980101';
SET STATISTICS IO OFF;`,
      ],
    ],
  ],
  [
    "view",
    "Trung cấp",
    [
      [
        "Đọc view có sẵn",
        "Dùng dbo.[Order Subtotals] lấy 10 đơn có Subtotal cao nhất.",
        "Tên view có dấu cách cần [ ].",
        `SELECT TOP (10) OrderID, Subtotal
FROM dbo.[Order Subtotals]
ORDER BY Subtotal DESC, OrderID;`,
      ],
      [
        "Tạo view tổng tiền",
        "Tạo hoặc cập nhật dbo.vPracticeOrderTotals trả OrderID, OrderTotal.",
        "CREATE OR ALTER VIEW đứng đầu batch.",
        `CREATE OR ALTER VIEW dbo.vPracticeOrderTotals AS
SELECT OrderID,
       SUM(UnitPrice * Quantity * (1 - Discount)) AS OrderTotal
FROM dbo.[Order Details]
GROUP BY OrderID;
GO`,
      ],
      [
        "Dùng view tính chi tiêu",
        "Dùng vPracticeOrderTotals lấy CustomerID, CompanyName, tổng chi tiêu.",
        "JOIN view với Orders, Customers; SUM mỗi đơn một lần.",
        `SELECT c.CustomerID, c.CompanyName,
       SUM(v.OrderTotal) AS Spend
FROM dbo.vPracticeOrderTotals AS v
JOIN dbo.Orders AS o ON o.OrderID = v.OrderID
JOIN dbo.Customers AS c ON c.CustomerID = o.CustomerID
GROUP BY c.CustomerID, c.CompanyName
ORDER BY Spend DESC;`,
      ],
      [
        "Đọc định nghĩa view",
        "Lấy tên và SQL định nghĩa của dbo.vPracticeOrderTotals.",
        "sys.views nối sys.sql_modules.",
        `SELECT v.name, m.definition
FROM sys.views AS v
JOIN sys.sql_modules AS m ON m.object_id = v.object_id
WHERE v.object_id = OBJECT_ID(N'dbo.vPracticeOrderTotals');`,
      ],
    ],
  ],
  [
    "function",
    "Nâng cao",
    [
      [
        "Scalar function tổng đơn",
        "Tạo fn_PracticeOrderTotal(@OrderID) trả tổng tiền của đơn, hoặc 0 nếu đơn chưa có chi tiết. Gọi thử với OrderID nhỏ nhất.",
        "Function trả một giá trị money.",
        `CREATE OR ALTER FUNCTION dbo.fn_PracticeOrderTotal
    (@OrderID int)
RETURNS money
AS
BEGIN
    DECLARE @Total money;
    SELECT @Total = SUM(CONVERT(money,
        UnitPrice * Quantity * (1 - Discount)))
    FROM dbo.[Order Details]
    WHERE OrderID = @OrderID;
    RETURN COALESCE(@Total, 0);
END;
GO
DECLARE @FirstOrderID int = (SELECT MIN(OrderID) FROM dbo.Orders);
SELECT dbo.fn_PracticeOrderTotal(@FirstOrderID) AS OrderTotal;`,
      ],
      [
        "Inline table-valued function",
        "Tạo fn_PracticeOrdersByCustomer(@CustomerID) trả các đơn của khách đó; SELECT thử với ALFKI.",
        "RETURNS TABLE AS RETURN (SELECT ...).",
        `CREATE OR ALTER FUNCTION dbo.fn_PracticeOrdersByCustomer
    (@CustomerID nchar(5))
RETURNS TABLE
AS
RETURN (
    SELECT OrderID, CustomerID, OrderDate, ShippedDate
    FROM dbo.Orders
    WHERE CustomerID = @CustomerID
);
GO
SELECT * FROM dbo.fn_PracticeOrdersByCustomer(N'ALFKI')
ORDER BY OrderDate DESC, OrderID DESC;`,
      ],
      [
        "Bảng ghi lịch sử giá",
        "Tạo dbo.PracticePriceAudit với AuditID identity PK, ProductID, OldPrice, NewPrice, ChangedAt datetime2. Chỉ tạo nếu chưa có.",
        "Bảng này dùng cho bài trigger kế tiếp.",
        `IF OBJECT_ID(N'dbo.PracticePriceAudit', N'U') IS NULL
BEGIN
    CREATE TABLE dbo.PracticePriceAudit (
        AuditID int IDENTITY(1,1) NOT NULL PRIMARY KEY,
        ProductID int NOT NULL,
        OldPrice money NULL,
        NewPrice money NULL,
        ChangedAt datetime2 NOT NULL
            CONSTRAINT DF_PracticePriceAudit_ChangedAt
            DEFAULT SYSUTCDATETIME()
    );
END;`,
      ],
      [
        "Trigger ghi thay đổi giá",
        "Sau khi tạo PracticePriceAudit, tạo trigger AFTER UPDATE trên Products. Ghi một audit row cho mỗi sản phẩm có UnitPrice thực sự thay đổi.",
        "JOIN inserted với deleted; viết theo tập hợp, không giả định chỉ một hàng.",
        `CREATE OR ALTER TRIGGER dbo.trg_PracticeProductsPriceAudit
ON dbo.Products
AFTER UPDATE
AS
BEGIN
    SET NOCOUNT ON;
    INSERT INTO dbo.PracticePriceAudit
        (ProductID, OldPrice, NewPrice)
    SELECT i.ProductID, d.UnitPrice, i.UnitPrice
    FROM inserted AS i
    JOIN deleted AS d ON d.ProductID = i.ProductID
    WHERE ISNULL(i.UnitPrice, -1) <> ISNULL(d.UnitPrice, -1);
END;
GO`,
      ],
      [
        "Thử trigger nhiều hàng",
        "Trong transaction, tăng giá ProductID 1 và 2; kiểm tra audit mới có hai hàng rồi rollback toàn bộ.",
        "Ghi MAX(AuditID) trước UPDATE để chỉ xem audit mới.",
        `BEGIN TRANSACTION;
DECLARE @BeforeAuditID int =
    (SELECT ISNULL(MAX(AuditID), 0) FROM dbo.PracticePriceAudit);
UPDATE dbo.Products
SET UnitPrice = UnitPrice + 1
WHERE ProductID IN (1, 2);
SELECT AuditID, ProductID, OldPrice, NewPrice
FROM dbo.PracticePriceAudit
WHERE AuditID > @BeforeAuditID
ORDER BY AuditID;
ROLLBACK TRANSACTION;`,
      ],
    ],
  ],
  [
    "procedure",
    "Nâng cao",
    [
      [
        "Procedure nhận tham số",
        "Tạo usp_PracticeOrdersByCustomer nhận @CustomerID nchar(5), trả đơn mới nhất trước. EXEC với ALFKI.",
        "CREATE OR ALTER PROCEDURE và GO trước EXEC.",
        `CREATE OR ALTER PROCEDURE dbo.usp_PracticeOrdersByCustomer
    @CustomerID nchar(5)
AS
BEGIN
    SET NOCOUNT ON;
    SELECT OrderID, OrderDate
    FROM dbo.Orders
    WHERE CustomerID = @CustomerID
    ORDER BY OrderDate DESC, OrderID DESC;
END;
GO
EXEC dbo.usp_PracticeOrdersByCustomer @CustomerID = N'ALFKI';`,
      ],
      [
        "Tham số mặc định",
        "Tạo usp_PracticeProductsByCategory nhận @CategoryID int = NULL; NULL trả mọi sản phẩm, ID cụ thể lọc theo category.",
        "WHERE @CategoryID IS NULL OR ...",
        `CREATE OR ALTER PROCEDURE dbo.usp_PracticeProductsByCategory
    @CategoryID int = NULL
AS
BEGIN
    SET NOCOUNT ON;
    SELECT ProductID, ProductName, CategoryID, UnitPrice
    FROM dbo.Products
    WHERE @CategoryID IS NULL OR CategoryID = @CategoryID
    ORDER BY ProductID;
END;
GO
EXEC dbo.usp_PracticeProductsByCategory @CategoryID = 1;`,
      ],
      [
        "Kiểm tra đầu vào",
        "Tạo usp_PracticeCustomerOrders: nếu CustomerID không tồn tại thì THROW, nếu tồn tại thì trả đơn.",
        "IF NOT EXISTS rồi THROW 50001.",
        `CREATE OR ALTER PROCEDURE dbo.usp_PracticeCustomerOrders
    @CustomerID nchar(5)
AS
BEGIN
    SET NOCOUNT ON;
    IF NOT EXISTS (SELECT 1 FROM dbo.Customers WHERE CustomerID = @CustomerID)
        THROW 50001, 'Customer does not exist.', 1;
    SELECT OrderID, OrderDate, ShippedDate
    FROM dbo.Orders
    WHERE CustomerID = @CustomerID
    ORDER BY OrderDate DESC, OrderID DESC;
END;
GO`,
      ],
      [
        "Tham số OUTPUT",
        "Tạo usp_PracticeOrderCount nhận CustomerID và trả số đơn qua @OrderCount OUTPUT. Viết ví dụ gọi.",
        "Gán OUTPUT bằng SELECT COUNT(*).",
        `CREATE OR ALTER PROCEDURE dbo.usp_PracticeOrderCount
    @CustomerID nchar(5),
    @OrderCount int OUTPUT
AS
BEGIN
    SET NOCOUNT ON;
    SELECT @OrderCount = COUNT(*)
    FROM dbo.Orders
    WHERE CustomerID = @CustomerID;
END;
GO
DECLARE @Count int;
EXEC dbo.usp_PracticeOrderCount N'ALFKI', @Count OUTPUT;
SELECT @Count AS OrderCount;`,
      ],
      [
        "Procedure tạo đơn an toàn",
        "Tạo usp_PracticeCreateOrder nhận CustomerID, ProductID, Quantity, trả OrderID OUTPUT. Kiểm tra đầu vào; tạo Orders và Order Details trong transaction.",
        "TRY/CATCH, XACT_ABORT, SCOPE_IDENTITY; giá từ Products.",
        `CREATE OR ALTER PROCEDURE dbo.usp_PracticeCreateOrder
    @CustomerID nchar(5), @ProductID int,
    @Quantity smallint, @OrderID int OUTPUT
AS
BEGIN
    SET NOCOUNT ON;
    SET XACT_ABORT ON;
    IF @Quantity IS NULL OR @Quantity <= 0
        THROW 50002, 'Quantity must be positive.', 1;
    IF NOT EXISTS (SELECT 1 FROM dbo.Customers WHERE CustomerID = @CustomerID)
        THROW 50003, 'Customer does not exist.', 1;
    IF NOT EXISTS (SELECT 1 FROM dbo.Products
                   WHERE ProductID = @ProductID AND UnitPrice IS NOT NULL)
        THROW 50004, 'Product does not exist or has no price.', 1;
    BEGIN TRY
        BEGIN TRANSACTION;
        INSERT INTO dbo.Orders (CustomerID, OrderDate)
        VALUES (@CustomerID, GETDATE());
        SET @OrderID = CONVERT(int, SCOPE_IDENTITY());
        INSERT INTO dbo.[Order Details]
            (OrderID, ProductID, UnitPrice, Quantity, Discount)
        SELECT @OrderID, ProductID, UnitPrice, @Quantity, 0
        FROM dbo.Products WHERE ProductID = @ProductID;
        COMMIT TRANSACTION;
    END TRY
    BEGIN CATCH
        IF @@TRANCOUNT > 0 ROLLBACK TRANSACTION;
        THROW;
    END CATCH;
END;
GO`,
      ],
      [
        "Procedure phân trang",
        "Tạo usp_PracticePagedOrders nhận @Page, @PageSize; kiểm tra > 0 và PageSize <= 100; trả đơn mới nhất.",
        "OFFSET và FETCH NEXT.",
        `CREATE OR ALTER PROCEDURE dbo.usp_PracticePagedOrders
    @Page int = 1, @PageSize int = 20
AS
BEGIN
    SET NOCOUNT ON;
    IF @Page IS NULL OR @Page < 1 OR @PageSize IS NULL
       OR @PageSize < 1 OR @PageSize > 100
        THROW 50005, 'Invalid page or page size.', 1;
    SELECT OrderID, CustomerID, OrderDate
    FROM dbo.Orders
    ORDER BY OrderDate DESC, OrderID DESC
    OFFSET (@Page - 1) * @PageSize ROWS
    FETCH NEXT @PageSize ROWS ONLY;
END;
GO`,
      ],
      [
        "Procedure doanh thu theo ngày",
        "Tạo usp_PracticeRevenueByDate nhận hai date, trả doanh thu theo CustomerID trong khoảng ngày bao gồm hai đầu; kiểm tra ngày hợp lệ.",
        "Dùng khoảng nửa mở vì OrderDate là datetime.",
        `CREATE OR ALTER PROCEDURE dbo.usp_PracticeRevenueByDate
    @FromDate date, @ToDate date
AS
BEGIN
    SET NOCOUNT ON;
    IF @FromDate IS NULL OR @ToDate IS NULL OR @FromDate > @ToDate
        THROW 50006, 'Invalid date range.', 1;
    SELECT o.CustomerID,
           SUM(od.UnitPrice * od.Quantity * (1 - od.Discount)) AS Revenue
    FROM dbo.Orders AS o
    JOIN dbo.[Order Details] AS od ON od.OrderID = o.OrderID
    WHERE o.OrderDate >= @FromDate
      AND o.OrderDate < DATEADD(day, 1, @ToDate)
      AND o.CustomerID IS NOT NULL
    GROUP BY o.CustomerID
    ORDER BY Revenue DESC, o.CustomerID;
END;
GO`,
      ],
      [
        "Đọc procedure có sẵn",
        "Đọc định nghĩa Northwind dbo.CustOrderHist rồi EXEC với ALFKI. So sánh với query tự viết.",
        "OBJECT_DEFINITION và EXEC.",
        `SELECT OBJECT_DEFINITION(OBJECT_ID(N'dbo.CustOrderHist'))
       AS ProcedureDefinition;
GO
EXEC dbo.CustOrderHist @CustomerID = N'ALFKI';`,
      ],
    ],
  ],
];

let sequence = 0;
window.SQL_EXERCISES = lessons.flatMap(([module, level, entries]) =>
  entries.map(([title, prompt, hint, answer]) => ({
    id: String(++sequence).padStart(2, "0"),
    module,
    level,
    topic: window.SQL_MODULES.find((item) => item.id === module).name,
    title,
    prompt,
    hint,
    answer,
    explain:
      "Đây là một lời giải tham khảo. Hãy chạy trên SQL Server, kiểm tra kết quả và giải thích vì sao bạn chọn cách này.",
  })),
);
