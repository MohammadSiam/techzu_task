import { prisma } from "../lib/prisma";
import { CreateCommentInput } from "../validators/post.validators";
import { NotificationService } from "./notification.service";

const notificationService = new NotificationService();

export class InteractionService {
  async toggleLike(userId: string, postId: string) {
    const post = await prisma.post.findUnique({
      where: { id: postId },
      select: { id: true, userId: true },
    });

    if (!post) {
      throw new Error("Post not found");
    }

    const existing = await prisma.like.findUnique({
      where: { userId_postId: { userId, postId } },
    });

    if (existing) {
      await prisma.like.delete({ where: { id: existing.id } });
      const count = await prisma.like.count({ where: { postId } });
      return { liked: false, likesCount: count };
    }

    await prisma.like.create({ data: { userId, postId } });
    const count = await prisma.like.count({ where: { postId } });

    // Send notification to post author (if not self-like)
    if (post.userId !== userId) {
      const liker = await prisma.user.findUnique({
        where: { id: userId },
        select: { username: true },
      });
      notificationService.sendToUser(
        post.userId,
        "New Like",
        `${liker?.username} liked your post`
      );
    }

    return { liked: true, likesCount: count };
  }

  async addComment(userId: string, postId: string, input: CreateCommentInput) {
    const post = await prisma.post.findUnique({
      where: { id: postId },
      select: { id: true, userId: true },
    });

    if (!post) {
      throw new Error("Post not found");
    }

    const comment = await prisma.comment.create({
      data: {
        content: input.content,
        userId,
        postId,
      },
      include: {
        user: { select: { id: true, username: true } },
      },
    });

    // Send notification to post author (if not self-comment)
    if (post.userId !== userId) {
      notificationService.sendToUser(
        post.userId,
        "New Comment",
        `${comment.user.username} commented on your post`
      );
    }

    return comment;
  }

  async getComments(postId: string, page: number, limit: number) {
    const post = await prisma.post.findUnique({
      where: { id: postId },
      select: { id: true },
    });

    if (!post) {
      throw new Error("Post not found");
    }

    const [comments, total] = await Promise.all([
      prisma.comment.findMany({
        where: { postId },
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
        include: {
          user: { select: { id: true, username: true } },
        },
      }),
      prisma.comment.count({ where: { postId } }),
    ]);

    return {
      comments,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async updateFcmToken(userId: string, fcmToken: string) {
    await prisma.user.update({
      where: { id: userId },
      data: { fcmToken },
    });
  }
}
