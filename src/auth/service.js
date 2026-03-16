import jwt from "jsonwebtoken";
import { env } from "../env.js";

export function handleLogin(email, password) {
  if (email === "" && password === "") {
    const token = jwt.sign(
      { email },
      env.JWT_SECRET || "your-secret-key",
      { expiresIn: "1h" },
    );

    return {
      success: true,
      token,
    };
  }

  return {
    success: false,
    message: "Invalid email or password",
  };
}

export default {
  handleLogin,
};
