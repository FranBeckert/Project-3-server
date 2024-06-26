// // TODO

const express = require("express");
const router = express.Router();
const User = require("../models/User.model");
// ********* require fileUploader in order to use it *********
const fileUploader = require("../config/cloudinary.config");

 
// POST "/api/upload" => Route that receives the image, sends it to Cloudinary via the fileUploader and returns the image URL
router.post("/upload", fileUploader.single("profilePicture"), (req, res, next) => {
  // console.log("file is: ", req.file)
 
  if (!req.file) {
    next(new Error("No file uploaded!"));
    return;
  }
  
  // Get the URL of the uploaded file and send it as a response.
  // 'fileUrl' can be any name, just make sure you remember to use the same when accessing it on the frontend
  
  res.json({ fileUrl: req.file.path });
});




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

// Get - Returns an specific user
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

// Put - Edits/Updates an specific user
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

// Delete - Deletes an specific user
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
