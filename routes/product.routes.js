const express = require("express");
const router = express.Router();
const Product = require("../models/Product.model");
const { isAuthenticated } = require("./../middleware/jwt.middleware.js"); 
const User = require("../models/User.model");



// Post - Like button
router.post("/like/:id", isAuthenticated, async (req, res) => {
  try {
    const productId = req.params.id;
    const userId = req.payload._id;

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const liked = product.likes.includes(userId);
    console.log({ liked });
    if (liked) {
      // remove product and user
      product.likes = product.likes.filter(
        (id) => id.toString() !== userId.toString()
      );
      user.favoritesProducts = user.favoritesProducts.filter(
        (id) => id.toString() !== productId.toString()
      );
    } else {
      // add product and user
      product.likes.push(userId);
      user.favoritesProducts.push(productId);
    }

    // saves the changes in the DB
    await product.save();
    await user.save();
    res.json({ ...product._doc, liked: !liked });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

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
      createdBy: request.payload._id,
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
    
    if (!request.body.price) {
      return response.status(400).send({
        message: "price is required!",
      });
    }
    if (!request.body.location.storeName) {
      return response.status(400).send({
        message: "Name of the store is required!",
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
