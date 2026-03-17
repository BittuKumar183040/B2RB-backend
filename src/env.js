import { z } from "zod/v4";

if (process.env.NODE_ENV !== "production") {
  const dotenv = await import("dotenv");
  dotenv.config();
}

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
  PORT: z.coerce.number().default(3000),

  JWT_SECRET: z.string(),
  FRONTEND_URL: z.string(),

  GOOGLE_CLIENT_ID: z.string(),
  GOOGLE_CLIENT_SECRET: z.string(),

  DB_HOST: z.string(),
  DB_PORT: z.coerce.number().default(5432),
  DB_NAME: z.string(),
  DB_USER: z.string(),
  DB_PASSWORD: z.string(),
});

// eslint-disable-next-line import/no-mutable-exports
let env;

try {
  env = envSchema.parse(process.env);
}
catch (error) {
  if (error instanceof z.ZodError) {
    console.error(
      "Environment validation failed:\n",
      error.issues.map(i => `• ${i.path}: ${i.message}`).join("\n"),
    );
  }
  else {
    console.error(error);
  }
  process.exit(1);
}

export { env };
