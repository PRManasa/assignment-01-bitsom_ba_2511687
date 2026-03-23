# Data Lake Notes

## Architecture Recommendation

For a fast-growing food delivery startup collecting GPS location logs, customer text reviews, payment transactions, and restaurant menu images, I would recommend a **Data Lakehouse** architecture.

A pure Data Warehouse would be too rigid for this use case. Warehouses require structured, schema-on-write data, meaning every dataset must be cleaned and formatted before storage. 
GPS logs, text reviews, and images are semi-structured or unstructured — they cannot be forced into relational tables without major loss of raw detail. 
A warehouse also cannot store binary files like menu images.

A pure Data Lake would store everything cheaply in raw format, but it lacks the query performance and ACID guarantees needed for payment transaction reporting and management dashboards.
Data lakes are prone to becoming "data swamps" — storing everything but making it hard to reliably query or govern.

A **Data Lakehouse** combines the best of both. It stores raw files (GPS logs, images, reviews) in open formats like Parquet or Delta Lake, while providing a structured, queryable layer on top using engines like Apache Spark or DuckDB. 
This gives the startup three specific advantages. First, all four data types — structured payments, semi-structured GPS and reviews, and binary images — can be stored in a single unified platform without format restrictions. 
Second, the transactional layer supports ACID compliance for payment records, ensuring consistency in financial reporting. 
Third, the analytical layer enables both real-time operational queries (order tracking) and batch BI reporting (monthly revenue, popular cuisines) without maintaining two separate systems. 
As the startup scales, a lakehouse avoids the cost and complexity of managing a warehouse and a lake side by side.
