const { v4: uuidv4 } = require("uuid");
const { connect } = require("../../config/db");
const helperWrapper = require("../../helper/wrapper");

module.exports = {
  listAllOwners: async (request, response) => {
    try {
      let data = request.body;
      const db = await connect();
      const koleksi = db.collection("owner");

      const page = data.page || 1;
      const pageSize = data.pageSize || 5;
      const sort = data.sort || { name: 1 };
      const findwosearch = {
        requestApprovalDeleteStatus: { $not: { $eq: "approve" } },
      };
      const find = {
        $and: [
          data.search,
          { requestApprovalDeleteStatus: { $not: { $eq: "approve" } } },
        ],
      };
      const skip = page * pageSize - pageSize;

      const totalData = await koleksi.countDocuments(
        data.search ? find : findwosearch
      );

      const result = await koleksi
        .find(data.search ? find : findwosearch)
        .sort(sort)
        .skip(skip)
        .limit(pageSize)
        .toArray();
      const totalPage = Math.ceil(totalData / pageSize);
      const pagination = {
        page,
        pageSize,
        totalPage,
        totalData,
      };
      return helperWrapper.response(
        response,
        201,
        "Get all bank",
        result,
        pagination
      );
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
  createTheOwner: async (request, response) => {
    try {
      let { name } = request.body;
      const db = await connect();
      const koleksi = db.collection("user");
      const koleksiOwner = db.collection("owner");
      const username = request.decodeToken.username;
      const checkUsername = await koleksi
        .find({ username: username })
        .toArray();
      const data = {
        _id: uuidv4(),
        name: name,
        createdBy_id: checkUsername[0]._id,
        createdAt: new Date(),
        updatedBy_id: "",
        updatedAt: "",
        archivedBy_id: "",
        archivedAt: "",
        requestApprovalDeleteTo_id: "",
        requestApprovalDeleteAt: "",
        requestApprovalDeleteReason: "",
        requestApprovalDeleteReasonReject: "",
        requestApprovalDeleteStatus: "",
      };
      const result = await koleksiOwner.insertOne(data);
      return helperWrapper.response(response, 201, "Created", {
        _id: result.insertedId,
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
  retrieveTheOwner: async (request, response) => {
    try {
      let { id } = request.params;
      console.log(id);
      const db = await connect();
      const koleksi = db.collection("owner");

      const checkOwner = await koleksi.find({ _id: id }).toArray();
      if (checkOwner.length <= 0) {
        return helperWrapper.response(response, 404, "Owner not Found", null);
      }
      const data = {
        _id: checkOwner[0]._id,
        name: checkOwner[0].name,
        createdBy_id: checkOwner[0].createdBy_id,
        createdAt: checkOwner[0].createdAt,
      };
      return helperWrapper.response(response, 200, "Ok", data);
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
  updateTheOwner: async (request, response) => {
    try {
      let { id } = request.params;
      let { name } = request.body;
      console.log(id);
      const db = await connect();
      const koleksiUser = db.collection("user");
      const koleksi = db.collection("owner");
      const checkOwner = await koleksi.find({ _id: id }).toArray();
      if (checkOwner.length <= 0) {
        return helperWrapper.response(response, 404, "Owner not Found", null);
      }
      const username = request.decodeToken.username;
      const checkUsername = await koleksiUser
        .find({ username: username })
        .toArray();
      const data = {
        name: name,
        updatedBy_id: checkUsername[0]._id,
        updatedAt: new Date(),
      };
      await koleksi.updateOne({ _id: id }, { $set: data });
      return helperWrapper.response(response, 200, "Ok", null);
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
  deleteTheOwner: async (request, response) => {
    try {
      let { id } = request.params;
      console.log(id);
      const db = await connect();
      const koleksi = db.collection("owner");
      const checkOwner = await koleksi.find({ _id: id }).toArray();
      if (checkOwner.length <= 0) {
        return helperWrapper.response(response, 404, "Owner not Found", null);
      }
      await koleksi.deleteOne({ _id: id });
      return helperWrapper.response(response, 200, "Ok", null);
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
  archiveTheOwner: async (request, response) => {
    try {
      let { id } = request.params;
      const db = await connect();
      const koleksi = db.collection("user");
      const koleksiOwner = db.collection("owner");
      const checkOwner = await koleksiOwner.find({ _id: id }).toArray();
      if (checkOwner.length <= 0) {
        return helperWrapper.response(response, 404, "Owner not Found", null);
      }
      const username = request.decodeToken.username;
      const checkUsername = await koleksi
        .find({ username: username })
        .toArray();
      const data = {
        archivedBy_id: checkUsername[0]._id,
        archivedAt: new Date(),
      };
      await koleksiOwner.updateOne({ _id: id }, { $set: data });
      return helperWrapper.response(response, 200, "Ok", null);
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
  restoreTheOwner: async (request, response) => {
    try {
      let { id } = request.params;
      const db = await connect();
      const koleksiOwner = db.collection("owner");
      const checkOwner = await koleksiOwner.find({ _id: id }).toArray();
      if (checkOwner.length <= 0) {
        return helperWrapper.response(response, 404, "Owner not Found", null);
      }
      const data = {
        archivedBy_id: "",
        archivedAt: "",
      };
      await koleksiOwner.updateOne({ _id: id }, { $set: data });
      return helperWrapper.response(response, 200, "Ok", null);
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
  requestToDeleteTheOwner: async (request, response) => {
    try {
      let { id } = request.params;
      const { approvalTo, reasonDelete } = request.body;
      const db = await connect();
      const koleksi = db.collection("user");
      const koleksiOwner = db.collection("owner");
      const checkOwner = await koleksiOwner.find({ _id: id }).toArray();
      if (checkOwner.length <= 0) {
        return helperWrapper.response(response, 404, "Owner not Found", null);
      }
      const checkUser = await koleksi.find({ _id: id });
      if (checkUser.length <= 0) {
        return helperWrapper.response(response, 404, "User not Found", null);
      }
      const data = {
        requestApprovalDeleteTo_id: approvalTo,
        requestApprovalDeleteAt: new Date(),
        requestApprovalDeleteReason: reasonDelete,
        requestApprovalDeleteStatus: "pending",
      };
      await koleksiOwner.updateOne({ _id: id }, { $set: data });
      return helperWrapper.response(response, 200, "Ok", null);
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
  approveRequestToDeleteTheOwner: async (request, response) => {
    try {
      let { id } = request.params;
      const db = await connect();
      const koleksiOwner = db.collection("owner");
      const checkOwner = await koleksiOwner.find({ _id: id }).toArray();
      if (checkOwner.length <= 0) {
        return helperWrapper.response(response, 404, "Owner not Found", null);
      }

      const data = {
        requestApprovalDeleteStatus: "approved",
      };
      await koleksiOwner.updateOne({ _id: id }, { $set: data });
      return helperWrapper.response(response, 200, "Ok", null);
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
  rejectRequestToDeleteTheOwner: async (request, response) => {
    try {
      let { id } = request.params;
      const { reasonReject } = request.body;
      const db = await connect();
      const koleksiOwner = db.collection("owner");
      const checkOwner = await koleksiOwner.find({ _id: id }).toArray();
      if (checkOwner.length <= 0) {
        return helperWrapper.response(response, 404, "Owner not Found", null);
      }

      const data = {
        requestApprovalDeleteReasonReject: reasonReject,
        requestApprovalDeleteStatus: "rejected",
      };
      await koleksiOwner.updateOne({ _id: id }, { $set: data });
      return helperWrapper.response(response, 200, "Ok", null);
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
