const express = require("express");

const Router = express.Router();

const authRoutes = require("../modules/auth/authRoutes");
const ownerRoutes = require("../modules/owner/ownerRoutes");
const bankRoutes = require("../modules/bank/bankRoutes");

Router.use("/owners", ownerRoutes);
Router.use("/banks", bankRoutes);
Router.use("/auth", authRoutes);

module.exports = Router;
