const moduleOwner = require("../src/modules/owner/ownerController");
// const axios = require("axios");
// jest.mock("axios");

test("expected to have status code 201", async () => {
  const result = await moduleOwner.listAllOwners();
  expect(result.response).toBe(201);
});
