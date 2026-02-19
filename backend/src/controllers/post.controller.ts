import { Request, Response } from "express";
import { PostService } from "../services/post.service";
import { sendSuccess, sendError } from "../utils/apiResponse";

const postService = new PostService();

export async function createPost(req: Request, res: Response) {
  try {
    const post = await postService.create(req.userId!, req.body);
    sendSuccess(res, post, 201);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to create post";
    sendError(res, message);
  }
}

export async function getFeed(req: Request, res: Response) {
  try {
    const page = Math.max(1, parseInt(req.query.page as string) || 1);
    const limit = Math.min(50, Math.max(1, parseInt(req.query.limit as string) || 10));
    const username = req.query.username as string | undefined;

    const result = await postService.getFeed(req.userId!, page, limit, username);
    sendSuccess(res, result.posts, 200, result.pagination);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to get feed";
    sendError(res, message);
  }
}

export async function getPost(req: Request, res: Response) {
  try {
    const id = req.params.id as string;
    const post = await postService.getById(id, req.userId!);
    sendSuccess(res, post);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to get post";
    const status = message === "Post not found" ? 404 : 400;
    sendError(res, message, status);
  }
}
