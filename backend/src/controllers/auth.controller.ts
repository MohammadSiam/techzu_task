import { Request, Response } from "express";
import { AuthService } from "../services/auth.service";
import { sendSuccess, sendError } from "../utils/apiResponse";

const authService = new AuthService();

export async function signup(req: Request, res: Response) {
  try {
    const result = await authService.signup(req.body);
    sendSuccess(res, result, 201);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Signup failed";
    sendError(res, message, 409);
  }
}

export async function login(req: Request, res: Response) {
  try {
    const result = await authService.login(req.body);
    sendSuccess(res, result);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Login failed";
    sendError(res, message, 401);
  }
}

export async function refresh(req: Request, res: Response) {
  try {
    const result = await authService.refresh(req.body.refreshToken);
    sendSuccess(res, result);
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Token refresh failed";
    sendError(res, message, 401);
  }
}
