// // TODO

const express = require("express");
const router = express.Router();
const User = require("../models/User.model");



// router.post("/", async (request, response) => {
//   try {
//     console.log(request.body);
//     if (!request.body.name) {
//       return response.status(400).send({
//         message: "Name is required!",
//       });
//     }
//     if (!request.body.email) {
//       return response.status(400).send({
//         message: "Email is required!",
//       });
//     }
//     if (!request.body.profilePicture) {
//       return response.status(400).send({
//         message: "ProfilePicture is required!",
//       });
//     }
//     if (!request.body.dateOfBirth) {
//       return response.status(400).send({
//         message: "Date of Birth is required!",
//       });
//     }
//     if (!request.body.neighborhood) {
//       return response.status(400).send({
//         message: "Neighborhood is required!",
//       });
//     }
//     if (!request.body.interests) {
//       return response.status(400).send({
//         message: "Interests is required!",
//       });
//     }

//     const newProfile = {
//       name: request.body.name,
//       email: request.body.email,
//       profilePicture: request.body.profilePicture,
//       dateOfBirth: request.body.dateOfBirth,
//       neighborhood: request.body.neighborhood,
//       interests: request.body.interests,
//     };

//     const profile = await Profile.create(newProfile);

//     return response.status(201).send(profile);
//   } catch (error) {
//     console.log(error.message);
//     response.status(500).send({ message: error.message });
//   }
// });

// Get - Return all the users
router.get("/", async (request, response) => {
  try {
    const user = await User.find({});

    return response.status(200).json({
      data: user,
    });
  } catch (error) {
    console.log(error.message);
    response.status(500).send({ message: error.message });
  }
});

// Get - Returns an specific message
router.get("/:id", async (request, response) => {
  try {
    const { id } = request.params;
    const profile = await User.findById(id);

    return response.status(200).json(profile);
  } catch (error) {
    console.log(error.message);
    response.status(500).send({ message: error.message });
  }
});

// get - Returns the likes
router.get("/likes", async (req, res) => {
  try {
    const userId = request.payload._id;
    const user = await User.findById(userId)
    .populate("favoritePlaces")
    .populate("favoriteServices")
    .populate("favoritesProducts")

    if (!user) {
      res.status(404).json({ message: "User not found"});
    }
    const likes = {
      places: user.favoritePlaces,
      services: user.favoriteServices,
      products: user.favoritesProducts,
    }
    res.json(likes)

  } catch (error) {
    console.log(error.message);
    res.status(500).send({ message: error.message });
  }
});

// Put - Edits/Updates an specific message
router.put("/:id", async (request, response) => {
  try {
    if (!request.body.name) {
      return response.status(400).send({
        message: "Sender is required!",
      });
    }
    if (!request.body.email) {
      return response.status(400).send({
        message: "Receiver is required!",
      });
    }

    const { id } = request.params;
    const result = await User.findByIdAndUpdate(id, request.body);

    if (!result) {
      return response.status(404).json({ message: "User not found" });
    }

    return response.status(200).send({ message: "User updated successfully" });
  } catch (error) {
    console.log(error.message);
    response.status(500).send({ message: error.message });
  }
});

// Delete - Deletes an specific message
router.delete("/:id", async (request, response) => {
  try {
    const { id } = request.params;

    const result = await Profile.findByIdAndDelete(id);

    if (!result) {
      return response.status(404).json({ message: "Profile not found" });
    }

    return response
      .status(200)
      .send({ message: "Profile deleted successfully" });
  } catch (error) {
    console.log(error.message);
    response.status(500).send({ message: error.message });
  }
});

module.exports = router;
