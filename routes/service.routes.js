const express = require("express");
const router = express.Router();
const Service = require("../models/Service.model");
const { isAuthenticated } = require("./../middleware/jwt.middleware.js"); 
const User = require("../models/User.model");


// Post - Like button
router.post("/like/:id", isAuthenticated, async (req, res) => {
  try {
    const serviceId = req.params.id;
    const userId = req.payload._id;

    const service = await Service.findById(serviceId);
    if (!service) {
      return res.status(404).json({ message: "Service not found" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // toggle the "like" feature 
    const liked = service.likes.includes(userId);
    console.log({ liked });
    if (liked) {
      // remove service and user´s like
      service.likes = service.likes.filter(
        (id) => id.toString() !== userId.toString()
      );
      user.favoritesProducts = user.favoritesProducts.filter(
        (id) => id.toString() !== serviceId.toString()
      );
    } else {
      // add service and user´s like
      service.likes.push(userId);
      user.favoritesProducts.push(serviceId);
    }

    // saves the changes in the DB
    await service.save();
    await user.save();
    res.json({ ...service._doc, liked: !liked });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


// Post - Creates a new service
router.post("/", isAuthenticated,  async (request, response) => {
  try {
    console.log(request.body);
    if (!request.body.providerName) {
      return response.status(400).send({
        message: "providerName is required!",
      });
    }
    if (!request.body.serviceType) {
      return response.status(400).send({
        message: "serviceType is required!",
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
    if (!request.body.contact.phone) {
      return response.status(400).send({
        message: "phone is required!",
      });
    }
    if (!request.body.contact.email) {
      return response.status(400).send({
        message: "email is required!",
      });
    }
    if (!request.body.contact.socialMedia) {
      return response.status(400).send({
        message: "socialMedia is required!",
      });
    }

    const newService = {
      providerName: request.body.providerName,
      serviceType: request.body.serviceType,
      description: request.body.description,
      price: request.body.price,
      location: {
        address: request.body.location.address,
        city: request.body.location.city,
      },
      contact: {
        phone: request.body.contact.phone,
        email: request.body.contact.email,
        socialMedia: request.body.contact.socialMedia,
      },
      createdBy: request.payload._id,
    };

    const service = await Service.create(newService);
    console.log(service);

    return response.status(201).send(service);
  } catch (error) {
    console.log(error.message);
    response.status(500).send({ message: error.message });
  }
});

// Get - Returns all the places
router.get("/", async (request, response) => {
  try {
    const services = await Service.find({});

    return response.status(200).json({
      count: services.length,
      data: services,
    });
  } catch (error) {
    console.log(error.message);
    response.status(500).send({ message: error.message });
  }
});

// Get - Returns the specified service
router.get("/:id", async (request, response) => {
  try {
    const { id } = request.params;
    const service = await Service.findById(id);

    return response.status(200).json(service);
  } catch (error) {
    console.log(error.message);
    response.status(500).send({ message: error.message });
  }
});

// Put - Edits/Updates the specified service
router.put("/:id", isAuthenticated, async (request, response) => {
  try {
    if (!request.body.providerName) {
      return response.status(400).send({
        message: "providerName is required!",
      });
    }
    if (!request.body.serviceType) {
      return response.status(400).send({
        message: "serviceType is required!",
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
    if (!request.body.contact.phone) {
      return response.status(400).send({
        message: "phone is required!",
      });
    }
    if (!request.body.contact.email) {
      return response.status(400).send({
        message: "email is required!",
      });
    }
    if (!request.body.contact.socialMedia) {
      return response.status(400).send({
        message: "socialMedia is required!",
      });
    }

    const { id } = request.params;
    const result = await Service.findByIdAndUpdate(id, request.body);

    if (!result) {
      return response.status(404).json({ message: "service not found" });
    }

    return response
      .status(200)
      .send({ message: "service updated successfully" });
  } catch (error) {
    console.log(error.message);
    response.status(500).send({ message: error.message });
  }
});

// Delete - Deletes the specified service
router.delete("/:id", isAuthenticated, async (request, response) => {
  try {
    const { id } = request.params;

    const result = await Service.findByIdAndDelete(id);

    if (!result) {
      return response.status(404).json({ message: "service not found" });
    }

    return response
      .status(200)
      .send({ message: "service deleted successfully" });
  } catch (error) {
    console.log(error.message);
    response.status(500).send({ message: error.message });
  }
});

module.exports = router;
