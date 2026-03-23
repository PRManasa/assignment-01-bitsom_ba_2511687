// OP1: insertMany() — insert all 3 documents from sample_documents.json
db.products.insertMany([
  {
    _id: "prod_e001",
    category: "Electronics",
    name: "Sony WH-1000XM5 Headphones",
    brand: "Sony",
    price: 29990,
    stock: 45,
    specs: {
      battery_life_hours: 30,
      connectivity: ["Bluetooth 5.2", "3.5mm Jack"],
      noise_cancellation: true,
      voltage: "5V DC",
      warranty_years: 1
    },
    tags: ["wireless", "noise-cancelling", "premium"]
  },
  {
    _id: "prod_c001",
    category: "Clothing",
    name: "Men's Slim Fit Chinos",
    brand: "Levis",
    price: 2499,
    stock: 120,
    specs: {
      material: "98% Cotton, 2% Elastane",
      sizes_available: ["28", "30", "32", "34", "36"],
      colors: ["Beige", "Olive", "Navy"],
      fit: "Slim",
      care_instructions: "Machine wash cold"
    },
    tags: ["casual", "slim-fit", "cotton"]
  },
  {
    _id: "prod_g001",
    category: "Groceries",
    name: "Amul Full Cream Milk",
    brand: "Amul",
    price: 68,
    stock: 300,
    specs: {
      volume_ml: 1000,
      expiry_date: new Date("2024-12-15"),
      nutritional_info: {
        calories_per_100ml: 61,
        protein_g: 3.2,
        fat_g: 3.5,
        carbs_g: 4.8
      },
      storage: "Refrigerate below 4 degrees C",
      organic: false
    },
    tags: ["dairy", "fresh", "daily-essential"]
  }
]);

// OP2: find() — retrieve all Electronics products with price > 20000
db.products.find({
  category: "Electronics",
  price: { $gt: 20000 }
});

// OP3: find() — retrieve all Groceries expiring before 2025-01-01
db.products.find({
  category: "Groceries",
  "specs.expiry_date": { $lt: new Date("2025-01-01") }
});

// OP4: updateOne() — add a "discount_percent" field to a specific product
db.products.updateOne(
  { _id: "prod_e001" },
  { $set: { discount_percent: 10 } }
);

// OP5: createIndex() — create an index on category field and explain why
// Reason: category is the most common filter field used in queries (OP2, OP3). Indexing it allows MongoDB to avoid full collection scans and speeds up lookups as the product catalog grows.
db.products.createIndex({ category: 1 });
