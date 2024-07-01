// ℹ️ Gets access to environment variables/settings
// https://www.npmjs.com/package/dotenv
require("dotenv").config();



// ℹ️ Connects to the database
require("./db");

// Establish Protected Routes
const { isAuthenticated } = require("./middleware/jwt.middleware");

// Handles http requests (express is node js framework)
// https://www.npmjs.com/package/express
const express = require("express");

const app = express();

// ℹ️ This function is getting exported from the config folder. It runs most pieces of middleware
require("./config")(app);

// Middleware for parsing request body
app.use(express.json());

// 👇 Start handling routes here
const authRoutes = require("./routes/auth.routes");
app.use("/api/auth", isAuthenticated, authRoutes);

const placeRoutes = require("./routes/place.routes");
app.use("/api/places", placeRoutes);

const productRoutes = require("./routes/product.routes");
app.use("/api/products", productRoutes);

const serviceRoutes = require("./routes/service.routes");
app.use("/api/services", serviceRoutes);

const messageRoutes = require("./routes/message.routes");
app.use("/api/messages", isAuthenticated, messageRoutes);

const userRoutes = require("./routes/user.routes");
app.use("/api/users", isAuthenticated, userRoutes);

// order matters
const indexRoutes = require("./routes/index.routes");
app.use("/api", isAuthenticated, indexRoutes);

const authRouter = require("./routes/auth.routes");
app.use("/auth", authRouter);

// ❗ To handle errors. Routes that don't exist or errors that you handle in specific routes
require("./error-handling")(app);

module.exports = app;
