const express = require("express");
const router = express.Router();
const Product = require("../models/Product.model");
const { isAuthenticated } = require("./../middleware/jwt.middleware.js"); 

// Post - Creates a new product
router.post("/", isAuthenticated,  async (request, response) => {
  try {
    console.log(request.body);
    if (!request.body.productName) {
      return response.status(400).send({
        message: "productName is required!",
      });
    }
    if (!request.body.category) {
      return response.status(400).send({
        message: "category is required!",
      });
    }
    if (!request.body.brand) {
      return response.status(400).send({
        message: "brand is required!",
      });
    }
    if (!request.body.description) {
      return response.status(400).send({
        message: "description is required!",
      });
    }
    if (!request.body.price) {
      return response.status(400).send({
        message: "price is required!",
      });
    }
    if (!request.body.location.storeName) {
      return response.status(400).send({
        message: "address is required!",
      });
    }
    if (!request.body.location.address) {
      return response.status(400).send({
        message: "address is required!",
      });
    }
    if (!request.body.location.city) {
      return response.status(400).send({
        message: "city is required!",
      });
    }

    const newProduct = {
      productName: request.body.productName,
      category: request.body.category,
      brand: request.body.brand,
      description: request.body.description,
      price: request.body.price,
      location: {
        storeName: request.body.location.storeName,
        address: request.body.location.address,
        city: request.body.location.city,
      },
    };

    const product = await Product.create(newProduct);
    console.log(product);

    return response.status(201).send(product);
  } catch (error) {
    console.log(error.message);
    response.status(500).send({ message: error.message });
  }
});

// Get - Returns all the places
router.get("/", async (request, response) => {
  try {
    const products = await Product.find({});

    return response.status(200).json({
      count: products.length,
      data: products,
    });
  } catch (error) {
    console.log(error.message);
    response.status(500).send({ message: error.message });
  }
});

// Get - Returns the specified product
router.get("/:id", async (request, response) => {
  try {
    const { id } = request.params;
    const product = await Product.findById(id);

    return response.status(200).json(product);
  } catch (error) {
    console.log(error.message);
    response.status(500).send({ message: error.message });
  }
});

// Put - Edits/Updates the specified product
router.put("/:id", isAuthenticated, async (request, response) => {
  try {
    if (!request.body.productName) {
      return response.status(400).send({
        message: "productName is required!",
      });
    }
    if (!request.body.category) {
      return response.status(400).send({
        message: "category is required!",
      });
    }
    if (!request.body.brand) {
      return response.status(400).send({
        message: "brand is required!",
      });
    }
    if (!request.body.description) {
      return response.status(400).send({
        message: "description is required!",
      });
    }
    if (!request.body.price) {
      return response.status(400).send({
        message: "price is required!",
      });
    }
    if (!request.body.location.storeName) {
      return response.status(400).send({
        message: "address is required!",
      });
    }
    if (!request.body.location.address) {
      return response.status(400).send({
        message: "address is required!",
      });
    }
    if (!request.body.location.city) {
      return response.status(400).send({
        message: "city is required!",
      });
    }

    const { id } = request.params;
    const result = await Product.findByIdAndUpdate(id, request.body);

    if (!result) {
      return response.status(404).json({ message: "product not found" });
    }

    return response
      .status(200)
      .send({ message: "product updated successfully" });
  } catch (error) {
    console.log(error.message);
    response.status(500).send({ message: error.message });
  }
});

// Delete - Deletes the specified product
router.delete("/:id", isAuthenticated, async (request, response) => {
  try {
    const { id } = request.params;

    const result = await Product.findByIdAndDelete(id);

    if (!result) {
      return response.status(404).json({ message: "product not found" });
    }

    return response
      .status(200)
      .send({ message: "product deleted successfully" });
  } catch (error) {
    console.log(error.message);
    response.status(500).send({ message: error.message });
  }
});

module.exports = router;
