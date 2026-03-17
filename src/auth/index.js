import express from "express";
import { env } from "../env.js";
import logger from "../logger/index.js";
import { verifyToken } from "../middleware/verify-token.js";
import service from "./service.js";

const router = express.Router();

router.get("/", (req, res) => {
  res.json({
    message: "API - 👋🌎🌍🌏",
  });
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  console.warn("Login attempt", { email, password });
  const result = await service.handleLogin(email, password);
  logger.info("Login result", { email, password, result });

  if (result.success === false) {
    return res.status(404).json({ success: false, message: result.message });
  }

  res.cookie("token", result.token, {
    httpOnly: true,
    secure: env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  return res.status(result && result.success ? 200 : 404).json({ success: "Login Successful" });
});

router.post("/register", async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return { success: false, message: "Name, email, and password are required" };
  }
  const result = await service.registerUser(name, email, password);
  return res.status(result.success ? 201 : 400).json({ success: result.success, message: result.message });
});

router.get("/me", verifyToken, async (req, res) => {
  try {
    logger.info(`Fetching user info for email: ${req.user.email}`);
    const user = await service.getUser(req.user.email);
    return res.status(200).json({
      success: true,
      user,
    });
  }
  catch (error) {
    console.info("Error in /auth/me", error.message);
    return res.status(401).json({
      success: false,
      message: "Unauthorized",
    });
  }
});

router.post("/logout", (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: env.NODE_ENV === "production",
    sameSite: "lax",
  });

  return res.status(200).json({
    success: true,
    message: "Logged out successfully",
  });
});

export default router;
