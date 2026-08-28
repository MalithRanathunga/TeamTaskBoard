import dns from "dns";
import request from "supertest";
import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import authRoutes from "../src/routes/authRoute.js";
import User from "../src/models/User.js";

// Force Node to use Google DNS for Atlas SRV resolution
dns.setServers(["8.8.8.8", "8.8.4.4"]);
dotenv.config();

jest.setTimeout(30000);

const app = express();
app.use(express.json());
app.use("/api/auth", authRoutes);

beforeAll(async () => {
  const uri = process.env.MONGO_URI;
  if (!uri) {
    throw new Error("MONGO_URI is missing from .env");
  }

  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 20000,
    });
  }

  // Clean up existing test users
  await User.deleteMany({ email: /test_integration.*@example\.com/i });
}, 30000);

afterAll(async () => {
  try {
    if (mongoose.connection.readyState !== 0) {
      await User.deleteMany({ email: /test_integration.*@example\.com/i });
      await mongoose.disconnect();
    }
  } catch (error) {
    console.error("Cleanup error:", error);
  }
}, 30000);

describe("Auth API Integration Tests", () => {
  it("should register a new user successfully", async () => {
    const res = await request(app)
      .post("/api/auth/register")
      .send({
        name: "Test User",
        email: "test_integration_user@example.com",
        password: "password123",
      });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty("token");
    expect(res.body.email).toBe("test_integration_user@example.com");
  });

  it("should reject duplicate email registration", async () => {
    const res = await request(app)
      .post("/api/auth/register")
      .send({
        name: "Duplicate User",
        email: "test_integration_user@example.com",
        password: "password123",
      });

    expect(res.statusCode).toBe(400);
    expect(res.body.message).toMatch(/already registered|already exists/i);
  });

  it("should log in an existing user with valid credentials", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({
        email: "test_integration_user@example.com",
        password: "password123",
      });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("token");
  });

  it("should reject login with wrong password", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({
        email: "test_integration_user@example.com",
        password: "wrongpassword",
      });

    // Matches controller returning 401 Unauthorized
    expect([400, 401]).toContain(res.statusCode);
    expect(res.body.message).toMatch(/invalid credentials|invalid email or password/i);
  });
});