# Capstone Design Justification

## Storage Systems

The hospital architecture uses four storage systems, each chosen for a specific goal.

**PostgreSQL** is the primary OLTP database for Goal 1 (readmission prediction) and underpins the entire patient record system. 
It stores structured data — patient demographics, diagnoses, treatment history, prescriptions, and billing — with full ACID compliance. 
This is non-negotiable in healthcare where partial writes to a patient record could cause clinical harm. 
The historical treatment data stored here feeds the ML readmission risk model.

**Pinecone (Vector Database)** powers Goal 2 — allowing doctors to query patient history in plain English. 
Patient records and clinical notes are chunked, embedded using a language model, and stored as vectors. 
When a doctor asks "Has this patient had a cardiac event before?", the query is embedded and matched semantically against stored vectors, retrieving relevant records regardless of exact wording. 
A relational database cannot do this.

**Redshift / BigQuery (Data Warehouse)** serves Goal 3 — monthly management reports on bed occupancy and department costs. 
Aggregated, cleaned data is loaded from PostgreSQL via nightly ETL jobs into a columnar warehouse optimized for analytical queries. 
This separation prevents heavy reporting queries from slowing down live patient record operations.

**TimescaleDB** handles Goal 4 — streaming and storing real-time ICU vitals. 
It is a time-series extension of PostgreSQL, optimized for high-frequency append-only writes from IoT monitoring devices. 
Kafka ingests the stream and TimescaleDB persists it, enabling both live dashboards and retrospective trend analysis.

## OLTP vs OLAP Boundary

The OLTP system ends at PostgreSQL — all live, transactional operations (admissions, prescriptions, appointments, billing) happen here. 
The OLAP system begins at the Data Warehouse, which receives a nightly snapshot of aggregated data from PostgreSQL via an ETL pipeline. 
This boundary ensures that analytical workloads (monthly reports, trend analysis) never compete with real-time clinical operations for database resources. 
The Vector DB and TimescaleDB sit outside both boundaries — they are specialized stores for their respective data types.

## Trade-offs

The most important trade-off in this design is **data duplication and synchronization lag**. 
Patient data lives in PostgreSQL (source of truth), but copies exist in the Vector DB (as embeddings) and the Data Warehouse (as aggregates). 
If a patient record is updated in PostgreSQL — say, a new diagnosis is added — the embeddings in Pinecone and the warehouse aggregates are not immediately updated. 
This creates a window of inconsistency where a doctor's plain-English query might miss the latest information.

The mitigation strategy is a **change data capture (CDC) pipeline** using a tool like Debezium. 
CDC monitors PostgreSQL's transaction log in real time and triggers incremental updates to downstream stores whenever a record changes — re-embedding updated clinical notes and refreshing affected warehouse rows within minutes rather than waiting for the nightly batch job. 
This significantly reduces the inconsistency window without requiring a full nightly reload.
