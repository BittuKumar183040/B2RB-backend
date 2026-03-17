import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import session from "express-session";
import helmet from "helmet";
import morgan from "morgan";
import googleAuth from "./auth/google-auth.js";
import passport from "./auth/google-strategy.js";
import auth from "./auth/index.js";
import { testDbConnection } from "./db/test-connection.js";
import logger from "./logger/index.js";
import * as middlewares from "./middlewares.js";

const app = express();

app.use(morgan("dev"));
app.use(helmet());
app.use(cookieParser());

app.use(cors({
  origin: ["http://localhost:5173", "https://resume.betoo.co.in"],
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "userId"],
}));

app.use(
  session({
    secret: "secret",
    resave: false,
    saveUninitialized: true,
  }),
);

app.use(express.json());

app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((user, done) => done(null, user));

app.get("/", (req, res) => {
  logger.info("Root endpoint hit");
  res.json({
    message: "🦄🌈✨👋🌎🌍🌏✨🌈🦄",
  });
});

// testDbConnection();

app.use("/auth/google", googleAuth);
app.use("/auth", auth);

app.use(middlewares.notFound);
app.use(middlewares.errorHandler);

export default app;
