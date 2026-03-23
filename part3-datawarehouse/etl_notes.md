# Data Warehouse Notes

## ETL Decisions

### Decision 1 — Standardizing Date Formats
Problem: The `date` column in `retail_transactions.csv` contains three different formats: `DD/MM/YYYY` (e.g., `29/08/2023`), `DD-MM-YYYY` (e.g., `12-12-2023`), and `YYYY-MM-DD` (e.g., `2023-02-05`). This inconsistency makes it impossible to sort, filter, or join on dates reliably without first normalizing them.
Resolution: All dates were converted to the ISO standard format `YYYY-MM-DD` before loading into `dim_date`. This format is unambiguous, universally supported by SQL engines, and enables correct chronological ordering in month-over-month trend queries.

### Decision 2 — Normalizing Category Casing
Problem: The `category` column contains multiple representations of the same category: `electronics`, `Electronics`, `Grocery`, and `Groceries`. These would be treated as four distinct categories in GROUP BY queries, producing incorrect revenue totals per category.
Resolution: All category values were standardized to title case with consistent naming — `Electronics`, `Groceries`, and `Clothing`. The variants `electronics` and `Grocery` were mapped to `Electronics` and `Groceries` respectively before loading into `dim_product`.

### Decision 3 — Handling NULL store_city Values
Problem: 19 rows in the dataset have a NULL value in the `store_city` column. Since `dim_store` requires a city for each store, these NULLs cannot be loaded as-is without violating the NOT NULL constraint and making store-level reporting inaccurate.
Resolution: NULL `store_city` values were resolved by looking up the store name in non-null rows. Since each store name maps to exactly one city (e.g., `Bangalore MG` always maps to `Bangalore`), the city was derived from the store name and backfilled before loading into the warehouse.
