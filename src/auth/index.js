import express from "express";
import { env } from "../env.js";
import { verifyToken } from "../middleware/verify-token.js";
import service from "./service.js";

const router = express.Router();

router.get("/", (req, res) => {
  res.json({
    message: "API - 👋🌎🌍🌏",
  });
});

router.post("/register", (req, res) => {
  res.json({
    message: "User registered successfully",
  });
});

router.post("/login", (req, res) => {
  const { email, password } = req.body;
  console.warn("Login attempt", { email, password });
  const result = service.handleLogin(email, password);

  res.cookie("token", result.token, {
    httpOnly: true,
    secure: env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  return res.status(result && result.success ? 200 : 404).json(result);
});

router.get("/me", verifyToken, (req, res) => {
  try {
    return res.status(200).json({
      success: true,
      user: req.user,
    });
  }
  catch (error) {
    console.info("Error in /auth/me", error);
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
