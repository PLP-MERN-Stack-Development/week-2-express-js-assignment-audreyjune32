// server.js
const express = require("express");
const bodyParser = require("body-parser");
const productRoutes = require("./routes/products");
const logger = require("./middleware/logger");
const auth = require("./middleware/auth");
const errorHandler = require("./middleware/errorHandler");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(logger);
app.use(auth);
app.use(bodyParser.json());

app.use("/api/products", productRoutes);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// routes/products.js
//const express = require('express');
const router = express.Router();
const {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  searchProducts,
  getProductStats,
} = require("../controllers/productsController");
const validateProduct = require("../middleware/validateProduct");

router.get("/", getProducts);
router.get("/search", searchProducts);
router.get("/stats", getProductStats);
router.get("/:id", getProductById);
router.post("/", validateProduct, createProduct);
router.put("/:id", validateProduct, updateProduct);
router.delete("/:id", deleteProduct);

module.exports = router;

// controllers/productsController.js
const { NotFoundError, ValidationError } = require("../utils/customErrors");

let products = [];

exports.getProducts = (req, res) => {
  const { category, page = 1, limit = 10 } = req.query;
  let results = [...products];

  if (category) {
    results = results.filter((p) => p.category === category);
  }

  const start = (page - 1) * limit;
  const paginated = results.slice(start, start + parseInt(limit));

  res.json(paginated);
};

exports.getProductById = (req, res, next) => {
  const product = products.find((p) => p.id === req.params.id);
  if (!product) return next(new NotFoundError("Product not found"));
  res.json(product);
};

exports.createProduct = (req, res) => {
  const { name, description, price, category, inStock } = req.body;
  const product = {
    id: "1",
    name,
    description,
    price,
    category,
    inStock,
  };
  products.push(product);
  res.status(201).json(product);
};

exports.updateProduct = (req, res, next) => {
  const index = products.findIndex((p) => p.id === req.params.id);
  if (index === -1) return next(new NotFoundError("Product not found"));

  products[index] = { ...products[index], ...req.body };
  res.json(products[index]);
};

exports.deleteProduct = (req, res, next) => {
  const index = products.findIndex((p) => p.id === req.params.id);
  if (index === -1) return next(new NotFoundError("Product not found"));

  const deleted = products.splice(index, 1);
  res.json(deleted[0]);
};

exports.searchProducts = (req, res) => {
  const { name } = req.query;
  const result = products.filter((p) =>
    p.name.toLowerCase().includes(name.toLowerCase())
  );
  res.json(result);
};

exports.getProductStats = (req, res) => {
  const stats = {};
  for (const product of products) {
    stats[product.category] = (stats[product.category] || 0) + 1;
  }
  res.json(stats);
};

// middleware/logger.js
module.exports = (req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
};

// middleware/auth.js
module.exports = (req, res, next) => {
  const apiKey = req.headers["x-api-key"];
  if (!apiKey || apiKey !== "my-secret-key") {
    return res.status(401).json({ error: "Unauthorized" });
  }
  next();
};

// middleware/validateProduct.js
const { ValidationError } = require("../utils/customErrors");

module.exports = (req, res, next) => {
  const { name, description, price, category, inStock } = req.body;
  if (!name || !description || price == null || !category || inStock == null) {
    return next(new ValidationError("All fields are required"));
  }
  if (typeof price !== "number" || typeof inStock !== "boolean") {
    return next(new ValidationError("Invalid data types"));
  }
  next();
};

// middleware/errorHandler.js
module.exports = (err, req, res, next) => {
  console.error(err);
  res.status(err.statusCode || 500).json({ error: err.message });
};

// utils/customErrors.js
class NotFoundError extends Error {
  constructor(message) {
    super(message);
    this.name = "NotFoundError";
    this.statusCode = 404;
  }
}

class ValidationError extends Error {
  constructor(message) {
    super(message);
    this.name = "ValidationError";
    this.statusCode = 400;
  }
}

module.exports = {
  NotFoundError,
  ValidationError,
};
