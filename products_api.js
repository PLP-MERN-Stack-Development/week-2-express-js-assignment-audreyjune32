// server.js - Starter Express server for Week 2 assignment

// Import required modules
const express = require("express");
const bodyParser = require("body-parser");
const { v4: uuidv4 } = require("uuid");

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware setup
app.use(bodyParser.json());

// Sample in-memory products database
let products = [
  {
    id: "1",
    name: "Laptop",
    description: "High-performance laptop with 16GB RAM",
    price: 1200,
    category: "electronics",
    inStock: true,
  },
  {
    id: "2",
    name: "Smartphone",
    description: "Latest model with 128GB storage",
    price: 800,
    category: "electronics",
    inStock: true,
  },
  {
    id: "3",
    name: "Coffee Maker",
    description: "Programmable coffee maker with timer",
    price: 50,
    category: "kitchen",
    inStock: false,
  },
];

// Root route
app.get("/", (req, res) => {
  res.send(
    "Welcome to the Product API! Go to /api/products to see all products."
  );
});

// TODO: Implement the following routes:
// GET /api/products - Get all products
// GET /api/products - Get all products
app.get("/api/products", (req, res) => {
  res.json(products);
});

// GET /api/products/:id - Get a specific product
app.get("/api/products/:id", (req, res) => {
  const product = products.find((p) => p.id === req.params.id);
  if (!product) {
    return res.status(404).json({ error: "Product not found" });
  }
  res.json(product);
});

// POST /api/products - Create a new product
app.post("/api/products", (req, res) => {
  const { name, description, price, category, inStock } = req.body;

  if (!name || !description || price == null || !category || inStock == null) {
    return res.status(400).json({ error: "All fields are required" });
  }

  const newProduct = {
    id: uuidv4(),
    name,
    description,
    price,
    category,
    inStock,
  };
  products.push(newProduct);
  res.status(201).json({ message: "Product created", product: newProduct });
});

// PUT /api/products/:id - Update a product
app.put("/api/products/:id", (req, res) => {
  const index = products.findIndex((p) => p.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ error: "Product not found" });
  }

  const updatedProduct = { ...products[index], ...req.body };
  products[index] = updatedProduct;

  res.json({ message: "Product updated", product: updatedProduct });
});

// DELETE /api/products/:id - Delete a product
app.delete("/api/products/:id", (req, res) => {
  const index = products.findIndex((p) => p.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ error: "Product not found" });
  }

  const deleted = products.splice(index, 1);
  res.json({ message: "Product deleted", product: deleted[0] });
});

// Example route implementation for GET /api/products
app.get("/api/products", (req, res) => {
  res.json(products);
});

// TODO: Implement custom middleware for:
// - Request logging
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// - Authentication
app.use((req, res, next) => {
  const apiKey = req.headers["x-api-key"];
  if (!apiKey || apiKey !== "my-secret-key") {
    return res.status(401).json({ error: "Unauthorized" });
  }
  next();
});

// - Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Something went wrong" });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

// Export the app for testing purposes
module.exports = app;
