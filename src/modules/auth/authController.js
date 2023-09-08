const helperWrapper = require("../../helper/wrapper");
const { v4: uuidv4 } = require("uuid");
const bcrypt = require("bcryptjs");
const { connect } = require("../../config/db");
const jwt = require("jsonwebtoken");

module.exports = {
  register: async (request, response) => {
    try {
      let { username, password } = request.body;
      console.log(username, password);
      const db = await connect();
      const koleksi = db.collection("user");

      const checkUsername = await koleksi
        .find({ username: username })
        .toArray();
      if (checkUsername.length >= 1) {
        return helperWrapper.response(response, 422, "Username was Used", null);
      }
      if (checkUsername.length <= 0) {
        let salt = bcrypt.genSaltSync(10);
        let newPassword = bcrypt.hashSync(password, salt);
        const setData = {
          _id: uuidv4(),
          username,
          password: newPassword,
        };
        const result = await koleksi.insertOne(setData);
        return helperWrapper.response(response, 200, "Register Success", {
          _id: result.insertedId,
        });
      }
    } catch (error) {
      console.log(error);
      return helperWrapper.response(
        response,
        500,
        "Internal Server Error",
        null
      );
    }
  },
  signin: async (request, response) => {
    try {
      let { username, password } = request.body;
      const db = await connect();
      const koleksi = db.collection("user");

      const checkUsername = await koleksi
        .find({ username: username })
        .toArray();
      if (checkUsername.length <= 0) {
        return helperWrapper.response(
          response,
          422,
          "Username not Register",
          null
        );
      }
      const result = bcrypt.compareSync(password, checkUsername[0].password);
      if (!result) {
        return helperWrapper.response(response, 422, "Wrong Password", null);
      }
      const token = jwt.sign({ username: username }, "rahasia", {
        expiresIn: "1d",
      });
      return helperWrapper.response(response, 200, "Success Login", {
        id: checkUsername._id,
        token,
      });
    } catch (error) {
      console.log(error);
      return helperWrapper.response(
        response,
        500,
        "Internal Server Error",
        null
      );
    }
  },
};
