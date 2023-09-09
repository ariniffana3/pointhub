const { v4: uuidv4 } = require("uuid");
const { connect } = require("../../config/db");
const helperWrapper = require("../../helper/wrapper");

module.exports = {
  listAllBanks: async (request, response) => {
    try {
      let data = request.body;
      const db = await connect();
      const koleksi = db.collection("bank");

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
        "get all bank",
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
  createTheBank: async (request, response) => {
    let data = request.body;
    console.log(data);
    const db = await connect();
    const koleksi = db.collection("user");
    const koleksibank = db.collection("bank");
    const username = request.decodeToken.username;
    const checkUsername = await koleksi.find({ username: username }).toArray();
    const newData = {
      _id: uuidv4(),
      code: data.code,
      name: data.name,
      address: data.address,
      phone: data.phone,
      fax: data.fax,
      notes: data.notes,
      accounts: data.accounts,
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
    const result = await koleksibank.insertOne(newData);
    return helperWrapper.response(response, 201, "Created", {
      _id: result.insertedId,
    });
  },
  retrieveTheBank: async (request, response) => {
    try {
      let { id } = request.params;
      console.log(id);
      const db = await connect();
      const koleksi = db.collection("bank");

      const checkbank = await koleksi.find({ _id: id }).toArray();
      if (checkbank.length <= 0) {
        return helperWrapper.response(response, 404, "bank not Found", null);
      }
      const data = {
        _id: checkbank[0]._id,
        code: checkbank[0].code,
        name: checkbank[0].name,
        address: checkbank[0].address,
        phone: checkbank[0].phone,
        fax: checkbank[0].fax,
        notes: checkbank[0].notes,
        accounts: checkbank[0].accounts,
        createdBy_id: checkbank[0].createdBy_id,
        createdAt: checkbank[0].createdAt,
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
  updateTheBank: async (request, response) => {
    try {
      let { id } = request.params;
      let { name } = request.body;
      console.log(id);
      const db = await connect();
      const koleksiUser = db.collection("user");
      const koleksi = db.collection("bank");
      const checkbank = await koleksi.find({ _id: id }).toArray();
      if (checkbank.length <= 0) {
        return helperWrapper.response(response, 404, "bank not Found", null);
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
  deleteTheBank: async (request, response) => {
    try {
      let { id } = request.params;
      console.log(id);
      const db = await connect();
      const koleksi = db.collection("bank");
      const checkbank = await koleksi.find({ _id: id }).toArray();
      if (checkbank.length <= 0) {
        return helperWrapper.response(response, 404, "bank not Found", null);
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
  archiveTheBank: async (request, response) => {
    try {
      let { id } = request.params;
      const db = await connect();
      const koleksi = db.collection("user");
      const koleksibank = db.collection("bank");
      const checkbank = await koleksibank.find({ _id: id }).toArray();
      if (checkbank.length <= 0) {
        return helperWrapper.response(response, 404, "bank not Found", null);
      }
      const username = request.decodeToken.username;
      const checkUsername = await koleksi
        .find({ username: username })
        .toArray();
      const data = {
        archivedBy_id: checkUsername[0]._id,
        archivedAt: new Date(),
      };
      await koleksibank.updateOne({ _id: id }, { $set: data });
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
  restoreTheBank: async (request, response) => {
    try {
      let { id } = request.params;
      const db = await connect();
      const koleksibank = db.collection("bank");
      const checkbank = await koleksibank.find({ _id: id }).toArray();
      if (checkbank.length <= 0) {
        return helperWrapper.response(response, 404, "bank not Found", null);
      }
      const data = {
        archivedBy_id: "",
        archivedAt: "",
      };
      await koleksibank.updateOne({ _id: id }, { $set: data });
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
  requestToDeleteTheBank: async (request, response) => {
    try {
      let { id } = request.params;
      const { approvalTo, reasonDelete } = request.body;
      const db = await connect();
      const koleksi = db.collection("user");
      const koleksibank = db.collection("bank");
      const checkbank = await koleksibank.find({ _id: id }).toArray();
      if (checkbank.length <= 0) {
        return helperWrapper.response(response, 404, "bank not Found", null);
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
      await koleksibank.updateOne({ _id: id }, { $set: data });
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
  approveRequestToDeleteTheBank: async (request, response) => {
    try {
      let { id } = request.params;
      const db = await connect();
      const koleksibank = db.collection("bank");
      const checkbank = await koleksibank.find({ _id: id }).toArray();
      if (checkbank.length <= 0) {
        return helperWrapper.response(response, 404, "bank not Found", null);
      }

      const data = {
        requestApprovalDeleteStatus: "approved",
      };
      await koleksibank.updateOne({ _id: id }, { $set: data });
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
  rejectRequestToDeleteTheBank: async (request, response) => {
    try {
      let { id } = request.params;
      const { reasonReject } = request.body;
      const db = await connect();
      const koleksibank = db.collection("bank");
      const checkbank = await koleksibank.find({ _id: id }).toArray();
      if (checkbank.length <= 0) {
        return helperWrapper.response(response, 404, "bank not Found", null);
      }

      const data = {
        requestApprovalDeleteReasonReject: reasonReject,
        requestApprovalDeleteStatus: "rejected",
      };
      await koleksibank.updateOne({ _id: id }, { $set: data });
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
