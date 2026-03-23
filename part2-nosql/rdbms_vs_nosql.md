## Database Recommendation

For a healthcare startup building a patient management system, I would recommend **MySQL** as the primary database — with a caveat for the fraud detection module.

Patient management systems deal with highly structured, sensitive data: patient demographics, diagnoses, prescriptions, appointments, and billing records.
These entities have well-defined relationships and strict consistency requirements. 
A patient's medication record must never be partially written; a billing entry must either fully commit or fully roll back.
This is precisely what **ACID compliance** guarantees in MySQL — Atomicity, Consistency, Isolation, and Durability. 
In healthcare, a BASE (Basically Available, Soft state, Eventually consistent) model as used in MongoDB is dangerous: eventual consistency means a doctor could momentarily read stale medication data, which in a clinical setting could have serious consequences.

The **CAP theorem** states that a distributed system can guarantee only two of three properties: Consistency, Availability, and Partition tolerance.
MySQL prioritizes Consistency and Partition tolerance — the right trade-off for medical records where correctness outweighs availability.
MongoDB, being AP-oriented, trades consistency for availability, which suits high-traffic web apps but not patient data.

However, if the startup adds a **fraud detection module**, the answer changes partially.
Fraud detection requires analyzing large volumes of semi-structured, high-velocity transaction logs and behavioral patterns that don't fit neatly into relational tables.
Here, **MongoDB** becomes appropriate as a secondary store — ingesting raw event streams and flagging anomalies — while MySQL continues to serve as the authoritative source for patient records.
Using both databases for their respective strengths, would be the ideal architecture.
