import { Response } from "express";
import { ApiResponse, PaginationMeta } from "../types/api.types";

export function sendSuccess<T>(
  res: Response,
  data: T,
  statusCode = 200,
  pagination?: PaginationMeta
) {
  const response: ApiResponse<T> = { success: true, data };
  if (pagination) response.pagination = pagination;
  res.status(statusCode).json(response);
}

export function sendError(res: Response, error: string, statusCode = 400) {
  const response: ApiResponse = { success: false, error };
  res.status(statusCode).json(response);
}
