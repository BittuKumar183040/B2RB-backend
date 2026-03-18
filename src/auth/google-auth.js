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
  (req, res, next) => {
    console.log("🔥 CALLBACK HIT", req.query);
    next();
  },
  passport.authenticate("google", {
    session: false,
    failureRedirect: `${env.FRONTEND_URL}/login`,
  }),
  (req, res) => {
    const token = req.user.token;
    console.log(req.user);
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
