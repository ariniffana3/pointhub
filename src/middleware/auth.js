const jwt = require("jsonwebtoken");
const helperWrapper = require("../helper/wrapper");

module.exports = {
  authentication: async (request, response, next) => {
    try {
      let token = request.headers.authorization;

      if (!token) {
        return helperWrapper.response(
          response,
          403,
          "please login first",
          null
        );
      }
      token = token.split(" ")[1];

      jwt.verify(token, "rahasia", async (error, result) => {
        if (error) {
          return helperWrapper.response(response, 403, error.message, null);
        }
        request.decodeToken = result;
        return next();
      });
    } catch (error) {
      if (error) {
        console.log(error);
        return helperWrapper.response(
          response,
          500,
          "Internal Server Error",
          null
        );
      }
    }
  },
};
