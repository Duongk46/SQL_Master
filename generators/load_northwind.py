"""
Load Northwind schema + data into learning_sql database.
Handles GO batch separators properly (sqlcmd style).
"""

import pyodbc
import re
from pathlib import Path

def split_sql_batches(sql_text: str):
    """
    Split SQL script by GO statements (sqlcmd style).
    Handles common variations of GO.
    """
    # Remove BOM if present
    if sql_text.startswith('\ufeff'):
        sql_text = sql_text[1:]

    # Split on GO as a standalone word on its own line
    # This matches sqlcmd behavior
    pattern = re.compile(r'^\s*GO\s*$', re.IGNORECASE | re.MULTILINE)
    batches = pattern.split(sql_text)

    # Clean up batches
    cleaned = []
    for batch in batches:
        batch = batch.strip()
        if batch:
            cleaned.append(batch)
    return cleaned


def main():
    sql_file = Path(__file__).parent.parent / "schemas" / "northwind.sql"

    if not sql_file.exists():
        print(f"ERROR: File not found: {sql_file}")
        return

    print(f"Reading Northwind script from: {sql_file}")
    sql_text = sql_file.read_text(encoding="utf-8", errors="ignore")
    print(f"Script size: {len(sql_text):,} characters")

    batches = split_sql_batches(sql_text)
    print(f"Found {len(batches)} batches to execute.\n")

    conn_str = (
        "Driver={ODBC Driver 17 for SQL Server};"
        "Server=DESKTOP0122\\SQLEXPRESS;"
        "Database=learning_sql;"
        "Trusted_Connection=yes;"
        "Encrypt=no;"
    )

    print("Connecting to learning_sql...")
    conn = pyodbc.connect(conn_str, autocommit=False)
    cursor = conn.cursor()

    success_count = 0
    error_count = 0

    for i, batch in enumerate(batches, 1):
        try:
            # Show first 60 chars as preview
            preview = " ".join(batch.split()[:8])
            if len(preview) > 70:
                preview = preview[:67] + "..."
            print(f"[{i:3d}/{len(batches)}] {preview}")

            cursor.execute(batch)
            conn.commit()
            success_count += 1

        except Exception as e:
            error_count += 1
            print(f"    ERROR: {str(e)[:120]}")
            # Rollback current transaction and continue
            try:
                conn.rollback()
            except:
                pass

    conn.close()

    print("\n" + "=" * 50)
    print(f"Finished loading Northwind.")
    print(f"Successful batches: {success_count}")
    print(f"Failed batches:     {error_count}")

    # Final verification
    conn = pyodbc.connect(conn_str)
    cur = conn.cursor()
    cur.execute("SELECT COUNT(*) FROM sys.tables")
    table_count = cur.fetchone()[0]
    print(f"Tables in learning_sql: {table_count}")
    conn.close()


if __name__ == "__main__":
    main()
