# Normalization Notes

## Anomaly Analysis

### Insert Anomaly
**Columns affected:** `product_id`, `product_name`, `category`, `unit_price`

Product information has no table of its own — it only exists embedded inside order rows. If the company wants to add a new product (e.g., "Whiteboard", Stationery, ₹1500) before any customer orders it, there is no way to record it. A row cannot be inserted into `orders_flat.csv` without a complete order (customer, sales rep, quantity, date). Since no order exists yet for this product, the product itself cannot be stored. This is a direct insert anomaly caused by product data being dependent on the existence of an order.

### Update Anomaly
**Columns affected:** `customer_id`, `customer_name`, `customer_email`, `customer_city`

Customer `C002` (Priya Sharma, `priya@gmail.com`, Delhi) appears across **Row 2** (ORD1027), **Row 5** (ORD1002), **Row 8** (ORD1037), **Row 21** (ORD1054), **Row 36** (ORD1048), **Row 40** (ORD1094), and 18 more rows — 24 rows in total. The columns `customer_name`, `customer_email`, and `customer_city` are duplicated in every single one of these rows. If Priya's email changes, all 24 rows must be updated. Missing even one row creates two different emails for the same customer ID in the database — a data inconsistency.

### Delete Anomaly
**Columns affected:** `customer_id`, `customer_name`, `customer_email`, `customer_city`

Customer `C008` (Kavya Rao, `kavya@gmail.com`, Hyderabad) exists in the file only through her orders: **Row 18** (ORD1131), **Row 26** (ORD1025), **Row 35** (ORD1021), **Row 39** (ORD1180), **Row 48** (ORD1047), **Row 49** (ORD1090), and others. If all of Kavya's orders are deleted — for example, due to a bulk cancellation or data cleanup — every trace of her as a customer disappears from the system entirely. Her name, email, and city are not stored anywhere else, so deleting her orders means losing her customer record permanently.

---

## Normalisation Justification

Storing all retail data in one sheet can create long-term problems.

The flat file in this dataset stores customer details (name, email, city) alongside every order that customer has ever placed. Customer `C002` (Priya Sharma) appears in over twenty rows. If Priya's email changes, all twenty rows must be updated. Miss one, and the data becomes inconsistent — a direct consequence of an **update anomaly**. In a normalised schema, her email is stored exactly once in a `customers` table, and a single update fixes everything.

Similarly, products like the Laptop (`P001`, ₹55,000) and Desk Chair (`P003`, ₹8,500) have their names, categories, and prices repeated in every order row that references them. If the price of the Laptop changes, every historical order row referencing it would need to be updated — which is both dangerous and incorrect, since historical orders should reflect the price at time of purchase.

The flat file also makes it impossible to store a product or a sales representative that has not yet been associated with an order — an **insert anomaly**. And deleting all orders for a customer wipes out all knowledge of that customer — a **delete anomaly**.

Normalisation to 3NF separates concerns cleanly: customers, products, sales representatives, and orders each live in their own table. This eliminates redundancy, prevents anomalies, and makes the system easier to maintain and scale. The cost is writing JOIN queries — a trivial overhead compared to the data integrity risks of a flat file. Normalisation is not over-engineering; it is the foundation of reliable data management.
