import test from "node:test";
import assert from "node:assert/strict";
import { getCookieOptions } from "../src/controllers/auth.controller.js";
import { authorizeRoles } from "../src/middlewares/authorizeRoles.js";

function createMockResponse() {
  return {
    statusCode: 200,
    payload: null,
    status(code) {
      this.statusCode = code;
      return this;
    },
    json(payload) {
      this.payload = payload;
      return this;
    },
  };
}

test("production cookies use cross-site settings for SPA auth", () => {
  process.env.NODE_ENV = "production";

  const options = getCookieOptions();

  assert.equal(options.sameSite, "none");
  assert.equal(options.secure, true);
  assert.equal(options.httpOnly, true);
});

test("authorizeRoles rejects users without the required role", () => {
  const req = { user: { roles: ["Guest"] } };
  const res = createMockResponse();
  let nextCalled = false;

  authorizeRoles("Host", "Admin")(req, res, () => {
    nextCalled = true;
  });

  assert.equal(res.statusCode, 403);
  assert.equal(nextCalled, false);
});

test("authorizeRoles allows users with the required role", () => {
  const req = { user: { roles: ["Host"] } };
  const res = createMockResponse();
  let nextCalled = false;

  authorizeRoles("Host", "Admin")(req, res, () => {
    nextCalled = true;
  });

  assert.equal(res.statusCode, 200);
  assert.equal(nextCalled, true);
});
