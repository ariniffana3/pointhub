const express = require("express");

const Router = express.Router();

const bankControllers = require("./bankController");
const middlewareAuth = require("../../middleware/auth");

Router.get("/", middlewareAuth.authentication, bankControllers.listAllBanks);
Router.post("/", middlewareAuth.authentication, bankControllers.createTheBank);
Router.get(
  "/:id",
  middlewareAuth.authentication,
  bankControllers.retrieveTheBank
);
Router.patch(
  "/:id",
  middlewareAuth.authentication,
  bankControllers.updateTheBank
);
Router.delete(
  "/:id",
  middlewareAuth.authentication,
  bankControllers.deleteTheBank
);
Router.post(
  "/:id/archive",
  middlewareAuth.authentication,
  bankControllers.archiveTheBank
);
Router.post(
  "/:id/restore",
  middlewareAuth.authentication,
  bankControllers.restoreTheBank
);
Router.post(
  "/:id/request-delete",
  middlewareAuth.authentication,
  bankControllers.requestToDeleteTheBank
);
Router.post(
  "/:id/request-delete/approve",
  middlewareAuth.authentication,
  bankControllers.approveRequestToDeleteTheBank
);
Router.post(
  "/:id/request-delete/reject",
  middlewareAuth.authentication,
  bankControllers.rejectRequestToDeleteTheBank
);

module.exports = Router;
