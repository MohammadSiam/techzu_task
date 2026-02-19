import { Request, Response, NextFunction } from "express";
import { sendError } from "../utils/apiResponse";

export function errorHandler(
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
) {
  console.error("Unhandled error:", err);
  sendError(res, "Internal server error", 500);
}
