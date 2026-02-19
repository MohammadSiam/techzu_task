import { Request, Response, NextFunction } from "express";
import { ZodSchema, ZodError } from "zod";
import { sendError } from "../utils/apiResponse";

export function validate(schema: ZodSchema) {
  return (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      const err = result.error as ZodError;
      const message = err.issues
        .map((issue) => issue.message)
        .join(", ");
      sendError(res, message, 400);
      return;
    }

    req.body = result.data;
    next();
  };
}
