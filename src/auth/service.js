import jwt from "jsonwebtoken";
import { env } from "../env.js";
import logger from "../logger/index.js";
import { checkEmailPassword, insertUser } from "../repo/user.js";

export async function handleLogin(email, password) {
  if (!email || !password) {
    return { success: false, message: "Invalid email or password" };
  }
  if (email && password) {
    const { valid } = await checkEmailPassword(email, password);
    if (!valid) {
      return { success: false, message: "Invalid email or password" };
    }
    const token = jwt.sign({ email }, env.JWT_SECRET, { expiresIn: "1h" });
    return { success: true, token };
  }
  return { success: false, message: "Invalid email or password" };
}

export async function registerUser(name, email, password) {
  logger.info(`Registering user with name: ${name}, email: ${email}`);
  await insertUser({ email, name, password });
  return { success: true, message: "User registered successfully" };
}

export default {
  handleLogin,
  registerUser,
};
