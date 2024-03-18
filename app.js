// ℹ️ Gets access to environment variables/settings
// https://www.npmjs.com/package/dotenv


require("dotenv").config();

// ℹ️ Connects to the database
require("./db");

// Handles http requests (express is node js framework)
// https://www.npmjs.com/package/express
const express = require("express");
const cors = require("cors");
const app = express();

app.use(cors());

// ℹ️ This function is getting exported from the config folder. It runs most pieces of middleware
require("./config")(app);

const { isAuthenticated } = require("./middleware/jwt.middleware");

// 👇 Start handling routes here
const indexRoutes = require("./routes/index.routes");
app.use("/api", indexRoutes);

const authRoutes = require("./routes/auth.routes");
app.use("/api/auth", authRoutes);

const restaurantsRoutes = require("./routes/restaurants.routes");
app.use("/api/restaurants", restaurantsRoutes);

const usersRoutes = require("./routes/users.routes");
app.use("/api/users", isAuthenticated, usersRoutes);

const ratingsRoutes = require("./routes/ratings.routes");
app.use("/api/ratings", isAuthenticated, ratingsRoutes);

const commentsRoutes = require("./routes/comments.routes");
app.use("/api/comments", isAuthenticated, commentsRoutes);

const menusRoutes = require("./routes/menus.routes");
app.use("/api/menus", isAuthenticated, menusRoutes);

const favoritesRoutes = require("./routes/favorites.routes");
app.use("/api/favorites", isAuthenticated, favoritesRoutes);



// ❗ To handle errors. Routes that don't exist or errors that you handle in specific routes
require("./error-handling")(app);

module.exports = app;
