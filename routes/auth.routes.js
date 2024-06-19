// routes/auth.routes.js

const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User.model");

const router = express.Router();

const { isAuthenticated } = require("./../middleware/jwt.middleware.js");

const saltRounds = 10;

// POST  /auth/signup
router.post("/signup", (req, res, next) => {
  const { name, email, password } = req.body;

  if (name === "" || password === "" || email === "") {
    res.status(400).json({ message: "Provide email, password and name" });
    return;
  }

  // Regex to validate the email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  if (!emailRegex.test(email)) {
    res.status(400).json({ message: "Provide a valid email address." });
    return;
  }

  // Regex to validate the password format
  const passwordRegex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/;
  if (!passwordRegex.test(password)) {
    res.status(400).json({
      message:
        "Password must have at least 6 characters and contain at least one number, one lowercase and one uppercase letter.",
    });
    return;
  }

  // Check the users collection if a user with the same email already exists
  User.findOne({ email })
    .then((foundUser) => {
      // If the user with the same email already exists, send an error response
      if (foundUser) {
        res.status(400).json({ message: "User already exists." });
        return;
      }

      // If the email is unique, proceed to hash the password
      const salt = bcrypt.genSaltSync(saltRounds);
      const hashedPassword = bcrypt.hashSync(password, salt);

      // Create a new user in the database
      // We return a pending promise, which allows us to chain another `then`
      return User.create({ email, password: hashedPassword, name });
    })
    .then((createdUser) => {
      // Deconstruct the newly created user object to omit the password
      // We should never expose passwords publicly
      const { email, name, _id } = createdUser;

      // Create a new object that doesn't expose the password
      const user = { email, name, _id };

      // Send a json response containing the user object
      res.status(201).json({ user: user });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ message: "Internal Server Error" });
    });
});

// POST  /auth/login
router.post("/login", (req, res, next) => {
  const { email, password } = req.body;

  if (email === "" || password === "") {
    res.status(400).json({ message: "Provide email and password." });
    return;
  }

  // Check the users collection if a user with the same email exists
  User.findOne({ email })
    .then((foundUser) => {
      if (!foundUser) {
        // If the user is not found, send an error response
        res.status(401).json({ message: "User not found." });
        return;
      }

      // Compare the provided password with the one saved in the database
      const passwordCorrect = bcrypt.compareSync(password, foundUser.password);

      if (passwordCorrect) {
        // Deconstruct the user object to omit the password
        const { _id, email, name } = foundUser;

        // Create an object that will be set as the token payload
        const payload = { _id, email, name };

        // Create and sign the token
        const authToken = jwt.sign(payload, process.env.TOKEN_SECRET, {
          algorithm: "HS256",
          expiresIn: "6h",
        });

        // Send the token as the response
        res.status(200).json({ authToken: authToken });
      } else {
        res.status(401).json({ message: "Unable to authenticate the user" });
      }
    })
    .catch((err) => res.status(500).json({ message: "Internal Server Error" }));
});

// GET  /auth/verify
router.get("/verify", isAuthenticated, async(req, res, next) => {
  // If JWT token is valid the payload gets decoded by the
  // isAuthenticated middleware and made available on `req.payload`
  console.log(`req.payload`, req.payload);
  try {
    const user = await User.findOne({_id: req.payload._id}).select("-password");

    if(!user) {
      return res.status(404).json({message: "User not found"})
    }

    return res.status(200).json(user);
  } catch (error) {
    console.log(error.message);
    response.status(500).send({ message: error.message });
  }
});


// // PUT  /auth/profile
// router.put("/profile/:id", isAuthenticated, async (req, res, next) => {
//   // Get the keys of the properties sent in the request body
//   const updates = Object.keys(req.body);

//   // Define which fields are allowed to be updated
//   const allowedUpdates = [
//     "name",
//     "email",
//     "profilePicture",
//     "dateOfBirth",
//     "neighborhood",
//     "interests",
//     "favoritePlaces",
//     "favoriteServices",
//     "favoritesProduct",
//   ];

//   // Check if all fields in the request body are allowed to be updated
//   const isValidOperation = updates.every((update) =>
//     allowedUpdates.includes(update)
//   );

//   // If any field is not allowed, return a 400 error
//   if (!isValidOperation) {
//     return res.status(400).send({ error: "Invalid updates!" });
//   }

//   try {
//     // Find the user by ID
//     const user = await User.findById(req.payload._id);

//     // If user not found, return a 404 error
//     if (!user) {
//       return res.status(404).send();
//     }

//     // Update only the fields provided in the request body
//     updates.forEach((update) => {
//       user[update] = req.body[update];
//     });

//     // Save the updated user
//     await user.save();

//     // Return a success message with the updated user
//     res.status(200).send({ message: "Updated successfully", user });
//   } catch (error) {
//     res.status(400).send({ message: error.message });
//   }
// });


module.exports = router;
