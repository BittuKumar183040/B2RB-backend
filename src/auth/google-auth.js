import express from "express";
import { env } from "../env.js";
import passport from "./google-strategy.js";

const router = express.Router();

router.get(
  "/",
  passport.authenticate("google", { scope: ["profile", "email"] }),
);

router.get(
  "/callback",
  passport.authenticate("google", { session: false }),
  (req, res) => {
    const token = req.user.token;

    res.cookie("token", token, {
      httpOnly: true,
      secure: env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.redirect(`${env.FRONTEND_URL}/dashboard`);
  },
);

export default router;
