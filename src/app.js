import cors from "cors";
import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import auth from "./auth/index.js";

import * as middlewares from "./middlewares.js";

const app = express();

app.use(morgan("dev"));
app.use(helmet());
app.use(cors({
  origin: ["http://localhost:5173", "http://resume.betoo.co.in/"],
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "userId"],
}));
app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    message: "🦄🌈✨👋🌎🌍🌏✨🌈🦄",
  });
});

app.use("/auth", auth);

app.use(middlewares.notFound);
app.use(middlewares.errorHandler);

export default app;
