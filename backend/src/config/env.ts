import dotenv from "dotenv";
dotenv.config();

const DB_HOST = process.env.DB_HOST || "localhost";
const DB_PORT = process.env.DB_PORT || "5432";
const DB_NAME = process.env.DB_NAME || "social_feed";
const DB_USER = process.env.DB_USER || "postgres";
const DB_PASSWORD = process.env.DB_PASSWORD || "postgres";

export const env = {
  PORT: parseInt(process.env.PORT || "3000", 10),
  DATABASE_URL: `postgresql://${DB_USER}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_NAME}?schema=public`,
  JWT_ACCESS_SECRET: process.env.JWT_ACCESS_SECRET!,
  JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET!,
  FIREBASE_PROJECT_ID: process.env.FIREBASE_PROJECT_ID || "",
  FIREBASE_CLIENT_EMAIL: process.env.FIREBASE_CLIENT_EMAIL || "",
  FIREBASE_PRIVATE_KEY: (process.env.FIREBASE_PRIVATE_KEY || "").replace(
    /\\n/g,
    "\n"
  ),
};
