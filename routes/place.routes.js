const express = require("express");
const router = express.Router();
const Place = require("../models/Place.model");
const { isAuthenticated } = require("./../middleware/jwt.middleware.js");
const User = require("../models/User.model");

// Post - Like button
router.post("/like/:id", isAuthenticated, async (req, res) => {
  try {
    const placeId = req.params.id;
    const userId = req.payload._id;

    const place = await Place.findById(placeId);
    if (!place) {
      return res.status(404).json({ message: "Place not found" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const liked = place.likes.includes(userId);
    console.log({ liked });
    if (liked) {
      // remove place and user
      place.likes = place.likes.filter(
        (id) => id.toString() !== userId.toString()
      );
      user.favoritePlaces = user.favoritePlaces.filter(
        (id) => id.toString() !== placeId.toString()
      );
    } else {
      // add place and user
      place.likes.push(userId);
      user.favoritePlaces.push(placeId);
    }

    // saves the changes in the DB
    await place.save();
    await user.save();
    res.json({ ...place._doc, liked: !liked });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Post - Creates a new place
router.post("/", isAuthenticated, async (request, response) => {
  try {
    console.log(request.body);
    if (!request.body.placeName) {
      return response.status(400).send({
        message: "PlaceName is required!",
      });
    }
    if (!request.body.placeType) {
      return response.status(400).send({
        message: "placeType is required!",
      });
    }

    if (
      request.body.placeType === "Doctor" ||
      request.body.placeType === "Veterinarian" ||
      request.body.placeType === "Dentist"
    ) {
      if (!request.body.speciality) {
        return response.status(400).send({
          message: "speciality is required!",
        });
      }
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
    if (!request.body.contact.website) {
      return response.status(400).send({
        message: "website is required!",
      });
    }

    const newPlace = {
      placeName: request.body.placeName,
      placeType: request.body.placeType,
      speciality: request.body.speciality,
      location: {
        address: request.body.location.address,
        city: request.body.location.city,
      },
      contact: {
        phone: request.body.contact.phone,
        email: request.body.contact.email,
        website: request.body.contact.website,
      },
      createdBy: request.payload._id,
    };

    const place = await Place.create(newPlace);
    console.log(place);

    return response.status(201).send(place);
  } catch (error) {
    console.log(error.message);
    response.status(500).send({ message: error.message });
  }
});

// Get - Returns all the places
router.get("/", async (request, response) => {
  try {
    const places = await Place.find({});

    return response.status(200).json({
      count: places.length,
      data: places,
    });
  } catch (error) {
    console.log(error.message);
    response.status(500).send({ message: error.message });
  }
});

// Get - Returns the specified place
router.get("/:id", async (request, response) => {
  try {
    const { id } = request.params;
    const place = await Place.findById(id);

    return response.status(200).json(place);
  } catch (error) {
    console.log(error.message);
    response.status(500).send({ message: error.message });
  }
});

// Put - Edits/Updates the specified place
router.put("/:id", isAuthenticated, async (request, response) => {
  try {
    if (!request.body.placeName) {
      return response.status(400).send({
        message: "PlaceName is required!",
      });
    }
    if (!request.body.placeType) {
      return response.status(400).send({
        message: "placeType is required!",
      });
    }

    if (
      request.body.placeType === "Doctor" ||
      request.body.placeType === "Veterinarian" ||
      request.body.placeType === "Dentist"
    ) {
      if (!request.body.speciality) {
        return response.status(400).send({
          message: "speciality is required!",
        });
      }
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
    if (!request.body.contact.website) {
      return response.status(400).send({
        message: "website is required!",
      });
    }

    const { id } = request.params;
    const result = await Place.findByIdAndUpdate(id, request.body);

    if (!result) {
      return response.status(404).json({ message: "Place not found" });
    }

    return response.status(200).send({ message: "Place updated successfully" });
  } catch (error) {
    console.log(error.message);
    response.status(500).send({ message: error.message });
  }
});

// Delete - Deletes the specified place
router.delete("/:id", isAuthenticated, async (request, response) => {
  try {
    const { id } = request.params;

    const result = await Place.findByIdAndDelete(id);

    if (!result) {
      return response.status(404).json({ message: "Place not found" });
    }

    return response.status(200).send({ message: "Place deleted successfully" });
  } catch (error) {
    console.log(error.message);
    response.status(500).send({ message: error.message });
  }
});

module.exports = router;
