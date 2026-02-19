import express from "express";
import cors from "cors";
import helmet from "helmet";
import { errorHandler } from "./middleware/error";
import { apiLimiter } from "./middleware/rateLimiter";
import authRoutes from "./routes/auth.routes";
import postRoutes from "./routes/post.routes";
import userRoutes from "./routes/user.routes";

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(apiLimiter);

app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.use("/auth", authRoutes);
app.use("/posts", postRoutes);
app.use("/users", userRoutes);

app.use(errorHandler);

export default app;
