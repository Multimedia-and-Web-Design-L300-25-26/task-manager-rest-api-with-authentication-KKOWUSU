import request from "supertest";
import app from "../src/app.js";
import dotenv from "dotenv";
import connectDB from "../src/config/db.js";
import mongoose from "mongoose";
import User from "../src/models/User.js";

dotenv.config();

beforeAll(async () => {
  await connectDB();
  await User.deleteMany({}); // clear users so registration works
});

afterAll(async () => {
  await mongoose.connection.close();
});

describe("Auth Routes", () => {
  let token;
  const email = `testuser${Date.now()}@example.com`; // unique email

  it("should register a user", async () => {
    const res = await request(app)
      .post("/api/auth/register")
      .send({
        name: "Test User",
        email: email,
        password: "123456",
        passwordConfirm: "123456"
      });

    expect(res.statusCode).toBe(201);
    expect(res.body.user.email).toBe(email);
  });

  it("should login user and return token", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({
        email: email,
        password: "123456"
      });

    expect(res.statusCode).toBe(200);
    expect(res.body.token).toBeDefined();

    token = res.body.token;
  });
});