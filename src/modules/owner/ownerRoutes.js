const express = require("express");

const Router = express.Router();

const ownerControllers = require("./ownerController");
const middlewareAuth = require("../../middleware/auth");

Router.get("/", middlewareAuth.authentication, ownerControllers.listAllOwners);
Router.post(
  "/",
  middlewareAuth.authentication,
  ownerControllers.createTheOwner
);
Router.get(
  "/:id",
  middlewareAuth.authentication,
  ownerControllers.retrieveTheOwner
);
Router.patch(
  "/:id",
  middlewareAuth.authentication,
  ownerControllers.updateTheOwner
);
Router.delete(
  "/:id",
  middlewareAuth.authentication,
  ownerControllers.deleteTheOwner
);
Router.post(
  "/:id/archive",
  middlewareAuth.authentication,
  ownerControllers.archiveTheOwner
);
Router.post(
  "/:id/restore",
  middlewareAuth.authentication,
  ownerControllers.restoreTheOwner
);
Router.post(
  "/:id/request-delete",
  middlewareAuth.authentication,
  ownerControllers.requestToDeleteTheOwner
);
Router.post(
  "/:id/request-delete/approve",
  middlewareAuth.authentication,
  ownerControllers.approveRequestToDeleteTheOwner
);
Router.post(
  "/:id/request-delete/reject",
  middlewareAuth.authentication,
  ownerControllers.rejectRequestToDeleteTheOwner
);

module.exports = Router;
