import { Request, Response } from "express";
import { InteractionService } from "../services/interaction.service";
import { sendSuccess, sendError } from "../utils/apiResponse";

const interactionService = new InteractionService();

export async function toggleLike(req: Request, res: Response) {
  try {
    const id = req.params.id as string;
    const result = await interactionService.toggleLike(req.userId!, id);
    sendSuccess(res, result);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to toggle like";
    const status = message === "Post not found" ? 404 : 400;
    sendError(res, message, status);
  }
}

export async function addComment(req: Request, res: Response) {
  try {
    const id = req.params.id as string;
    const comment = await interactionService.addComment(
      req.userId!,
      id,
      req.body
    );
    sendSuccess(res, comment, 201);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to add comment";
    const status = message === "Post not found" ? 404 : 400;
    sendError(res, message, status);
  }
}

export async function getComments(req: Request, res: Response) {
  try {
    const id = req.params.id as string;
    const page = Math.max(1, parseInt(req.query.page as string) || 1);
    const limit = Math.min(50, Math.max(1, parseInt(req.query.limit as string) || 10));

    const result = await interactionService.getComments(id, page, limit);
    sendSuccess(res, result.comments, 200, result.pagination);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to get comments";
    const status = message === "Post not found" ? 404 : 400;
    sendError(res, message, status);
  }
}

export async function updateFcmToken(req: Request, res: Response) {
  try {
    await interactionService.updateFcmToken(req.userId!, req.body.fcmToken);
    sendSuccess(res, { message: "FCM token updated" });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to update FCM token";
    sendError(res, message);
  }
}
