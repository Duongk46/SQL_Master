"""Import the bundled Northwind SQL script into an existing SQL Server database.

The script resets Northwind objects. Use a dedicated practice database.
"""

import argparse
import re
import sys
from pathlib import Path


SQL_FILE = Path(__file__).resolve().parent.parent / "schemas" / "northwind.sql"
VERIFY_FILE = SQL_FILE.with_name("verify_northwind.sql")


def split_sql_batches(sql_text: str) -> list[str]:
    """Split sqlcmd GO lines while preserving all SQL within each batch."""
    return [part.strip() for part in re.split(r"^\s*GO\s*$", sql_text.lstrip("\ufeff"), flags=re.I | re.M) if part.strip()]


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--server", required=True, help=r"SQL Server name, e.g. .\SQLEXPRESS")
    parser.add_argument("--database", default="NorthwindPractice", help="Existing practice database")
    parser.add_argument("--driver", default="ODBC Driver 17 for SQL Server", help="Installed SQL Server ODBC driver")
    parser.add_argument("--allow-reset", action="store_true", help="Confirm Northwind objects may be dropped/recreated")
    args = parser.parse_args()

    if not args.allow_reset:
        parser.error("--allow-reset is required: northwind.sql drops and recreates Northwind objects")

    try:
        import pyodbc
    except ImportError:
        print("pyodbc is required: python -m pip install pyodbc", file=sys.stderr)
        return 1

    batches = split_sql_batches(SQL_FILE.read_text(encoding="utf-8"))
    connection_string = (
        f"Driver={{{args.driver}}};Server={args.server};Database={args.database};"
        "Trusted_Connection=yes;Encrypt=no;"
    )
    print(f"Importing {len(batches)} batches into {args.server} / {args.database}")

    try:
        with pyodbc.connect(connection_string, autocommit=False) as connection:
            cursor = connection.cursor()
            cursor.execute("SELECT DB_NAME()")
            current_database = cursor.fetchone()[0]
            if current_database.lower() != args.database.lower():
                raise RuntimeError(f"Connected to unexpected database: {current_database}")

            for number, batch in enumerate(batches, 1):
                try:
                    cursor.execute(batch)
                    while cursor.nextset():
                        pass
                except Exception as error:
                    connection.rollback()
                    raise RuntimeError(f"Batch {number}/{len(batches)} failed: {error}") from error

            cursor.execute(VERIFY_FILE.read_text(encoding="utf-8"))
            database_name, customer_count, order_count, detail_count, product_count = cursor.fetchone()
            while cursor.nextset():
                pass

            connection.commit()
            print(
                f"Import complete in {database_name}: {customer_count} customers, "
                f"{order_count} orders, {detail_count} details, {product_count} products"
            )
            return 0
    except Exception as error:
        print(f"Import failed: {error}", file=sys.stderr)
        return 1


if __name__ == "__main__":
    raise SystemExit(main())
