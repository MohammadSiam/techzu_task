import { prisma } from "../lib/prisma";
import { CreatePostInput } from "../validators/post.validators";

export class PostService {
  async create(userId: string, input: CreatePostInput) {
    const post = await prisma.post.create({
      data: {
        content: input.content,
        userId,
      },
      include: {
        user: { select: { id: true, username: true } },
        _count: { select: { likes: true, comments: true } },
      },
    });

    return {
      ...post,
      likesCount: post._count.likes,
      commentsCount: post._count.comments,
      isLiked: false,
      _count: undefined,
    };
  }

  async getFeed(
    userId: string,
    page: number,
    limit: number,
    username?: string
  ) {
    const where = username
      ? { user: { username: { contains: username, mode: "insensitive" as const } } }
      : {};

    const [posts, total] = await Promise.all([
      prisma.post.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
        include: {
          user: { select: { id: true, username: true } },
          _count: { select: { likes: true, comments: true } },
          likes: {
            where: { userId },
            select: { id: true },
          },
        },
      }),
      prisma.post.count({ where }),
    ]);

    const formatted = posts.map((post: typeof posts[number]) => ({
      id: post.id,
      content: post.content,
      userId: post.userId,
      createdAt: post.createdAt,
      updatedAt: post.updatedAt,
      user: post.user,
      likesCount: post._count.likes,
      commentsCount: post._count.comments,
      isLiked: post.likes.length > 0,
    }));

    return {
      posts: formatted,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async getById(postId: string, userId: string) {
    const post = await prisma.post.findUnique({
      where: { id: postId },
      include: {
        user: { select: { id: true, username: true } },
        _count: { select: { likes: true, comments: true } },
        likes: {
          where: { userId },
          select: { id: true },
        },
      },
    });

    if (!post) {
      throw new Error("Post not found");
    }

    return {
      id: post.id,
      content: post.content,
      userId: post.userId,
      createdAt: post.createdAt,
      updatedAt: post.updatedAt,
      user: post.user,
      likesCount: post._count.likes,
      commentsCount: post._count.comments,
      isLiked: post.likes.length > 0,
    };
  }
}
