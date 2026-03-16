import pino from "pino";
import { env } from "../env.js";

const logger = pino({
  level: env.LOG_LEVEL || "info",
  transport: {
    target: "pino-pretty",
    options: {
      colorize: true,
      ignore: "pid,hostname",
      translateTime: "SYS:standard",
      singleLine: true,
    },
  },
});

export default logger;
