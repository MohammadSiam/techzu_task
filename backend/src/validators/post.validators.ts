import { z } from "zod";

export const createPostSchema = z.object({
  content: z
    .string()
    .min(1, "Post content is required")
    .max(500, "Post content must be at most 500 characters"),
});

export const createCommentSchema = z.object({
  content: z
    .string()
    .min(1, "Comment content is required")
    .max(500, "Comment must be at most 500 characters"),
});

export const updateFcmTokenSchema = z.object({
  fcmToken: z.string().min(1, "FCM token is required"),
});

export type CreatePostInput = z.infer<typeof createPostSchema>;
export type CreateCommentInput = z.infer<typeof createCommentSchema>;
export type UpdateFcmTokenInput = z.infer<typeof updateFcmTokenSchema>;
