import jwt from "jsonwebtoken";
import { env } from "../env.js";

export function verifyToken(req, res, next) {
  try {
    const token = req.cookies?.token;
    console.info(req.method, req.path, req.cookies, "Token:", token);
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "No token provided",
      });
    }

    const decoded = jwt.verify(token, env.JWT_SECRET);
    req.user = decoded;
    next();
  }
  catch (error) {
    console.error("Token verification failed:", error);
    return res.status(401).json({
      success: false,
      message: "Invalid or expired token",
    });
  }
}

export function authMiddleware(req, res, next) {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token)
    return res.status(401).send("Unauthorized");

  try {
    const decoded = jwt.verify(token, env.JWT_SECRET);
    req.user = decoded;
    next();
  }
  catch {
    res.status(401).send("Invalid token");
  }
}
