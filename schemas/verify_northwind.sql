-- Run in the practice database after schemas/northwind.sql.
-- This script reads data only and raises a clear error if import is incomplete.
SET NOCOUNT ON;

IF OBJECT_ID(N'dbo.Customers', N'U') IS NULL
    THROW 51000, 'Missing dbo.Customers. Import northwind.sql first.', 1;
IF OBJECT_ID(N'dbo.Orders', N'U') IS NULL
    THROW 51001, 'Missing dbo.Orders. Import northwind.sql first.', 1;
IF OBJECT_ID(N'dbo.[Order Details]', N'U') IS NULL
    THROW 51002, 'Missing dbo.Order Details. Import northwind.sql first.', 1;
IF OBJECT_ID(N'dbo.Products', N'U') IS NULL
    THROW 51003, 'Missing dbo.Products. Import northwind.sql first.', 1;
IF OBJECT_ID(N'dbo.Employees', N'U') IS NULL
    THROW 51004, 'Missing dbo.Employees. Import northwind.sql first.', 1;
IF OBJECT_ID(N'dbo.Categories', N'U') IS NULL
    THROW 51005, 'Missing dbo.Categories. Import northwind.sql first.', 1;
IF OBJECT_ID(N'dbo.Suppliers', N'U') IS NULL
    THROW 51006, 'Missing dbo.Suppliers. Import northwind.sql first.', 1;
IF OBJECT_ID(N'dbo.Shippers', N'U') IS NULL
    THROW 51007, 'Missing dbo.Shippers. Import northwind.sql first.', 1;
IF OBJECT_ID(N'dbo.Region', N'U') IS NULL
    THROW 51008, 'Missing dbo.Region. Import may have stopped before the final batches.', 1;
IF OBJECT_ID(N'dbo.Territories', N'U') IS NULL
    THROW 51009, 'Missing dbo.Territories. Import may have stopped before the final batches.', 1;
IF OBJECT_ID(N'dbo.EmployeeTerritories', N'U') IS NULL
    THROW 51010, 'Missing dbo.EmployeeTerritories.', 1;
IF OBJECT_ID(N'dbo.CustomerDemographics', N'U') IS NULL
    THROW 51011, 'Missing dbo.CustomerDemographics.', 1;
IF OBJECT_ID(N'dbo.CustomerCustomerDemo', N'U') IS NULL
    THROW 51012, 'Missing dbo.CustomerCustomerDemo.', 1;
IF OBJECT_ID(N'dbo.[Order Subtotals]', N'V') IS NULL
    THROW 51013, 'Missing dbo.Order Subtotals view.', 1;
IF OBJECT_ID(N'dbo.CustOrderHist', N'P') IS NULL
    THROW 51014, 'Missing dbo.CustOrderHist procedure.', 1;

IF NOT EXISTS (SELECT 1 FROM dbo.Customers WHERE CustomerID = N'ALFKI')
    THROW 51015, 'Missing ALFKI customer used in exercises.', 1;
IF NOT EXISTS (SELECT 1 FROM dbo.Products WHERE ProductID = 1 AND UnitPrice IS NOT NULL)
    THROW 51016, 'Missing priced ProductID 1 used in exercises.', 1;
IF NOT EXISTS (SELECT 1 FROM dbo.Products WHERE ProductID = 2 AND UnitPrice IS NOT NULL)
    THROW 51017, 'Missing priced ProductID 2 used in exercises.', 1;
IF NOT EXISTS (SELECT 1 FROM dbo.Orders)
    THROW 51018, 'Orders table has no sample rows.', 1;
IF NOT EXISTS (SELECT 1 FROM dbo.[Order Details])
    THROW 51019, 'Order Details table has no sample rows.', 1;

SELECT DB_NAME() AS DatabaseName,
       (SELECT COUNT(*) FROM dbo.Customers) AS CustomerCount,
       (SELECT COUNT(*) FROM dbo.Orders) AS OrderCount,
       (SELECT COUNT(*) FROM dbo.[Order Details]) AS DetailCount,
       (SELECT COUNT(*) FROM dbo.Products) AS ProductCount;

PRINT N'Northwind is ready for the SQL Master exercises.';
