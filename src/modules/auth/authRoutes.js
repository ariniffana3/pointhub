const express = require("express");

const Router = express.Router();

const authController = require("./authController");

Router.post("/register", authController.register);
Router.post("/signin", authController.signin);
// Router.post("/resources", authController.resources);

module.exports = Router;
