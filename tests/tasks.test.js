import request from "supertest";
import app from "../src/app.js";
import dotenv from "dotenv";
import connectDB from "../src/config/db.js";
import mongoose from "mongoose";

dotenv.config();

let token;
let taskId;

beforeAll(async () => {
  // Connect to DB
  await connectDB();

  // Register user
  await request(app)
    .post("/api/auth/register")
    .send({
      name: "Task User",
      email: "task@example.com",
      password: "123456",
      passwordConfirm: "123456"
    });

  // Login to get token
  const res = await request(app)
    .post("/api/auth/login")
    .send({
      email: "task@example.com",
      password: "123456"
    });

  token = res.body.token;
});

afterAll(async () => {
  await mongoose.connection.close();
});

describe("Task Routes", () => {

  it("should not allow access without token", async () => {
    const res = await request(app)
      .get("/api/tasks");

    expect(res.statusCode).toBe(401);
  });

  it("should create a task", async () => {
    const res = await request(app)
      .post("/api/tasks")
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "Test Task",
        description: "Testing"
      });

    expect(res.statusCode).toBe(201);
    expect(res.body.title).toBe("Test Task"); // ✅ now res.body is the task

    taskId = res.body._id;
  });

  it("should get user tasks only", async () => {
    const res = await request(app)
      .get("/api/tasks")
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true); // ✅ res.body is now array
    expect(res.body.length).toBeGreaterThanOrEqual(1);
  });

});