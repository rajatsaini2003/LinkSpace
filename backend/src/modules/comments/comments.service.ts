import { AppError } from '../../middlewares/error.middleware';
import { CreateCommentInput, UpdateCommentInput } from './comments.validation';
import prisma from '../../lib/prisma';

const commentInclude = {
  user: { select: { id: true, username: true, displayName: true, avatarUrl: true } },
};

export async function getCommentsByBookmark(bookmarkId: string, page: number, limit: number) {
  const skip = (page - 1) * limit;

  const bookmark = await prisma.bookmark.findUnique({
    where: { id: bookmarkId },
    select: { isPublic: true },
  });

  if (!bookmark) {
    throw new AppError('Bookmark not found', 404);
  }

  const [comments, total] = await Promise.all([
    prisma.comment.findMany({
      where: { bookmarkId },
      skip,
      take: limit,
      include: commentInclude,
      orderBy: { createdAt: 'desc' },
    }),
    prisma.comment.count({ where: { bookmarkId } }),
  ]);

  return { comments, total, page, limit, hasNextPage: skip + limit < total };
}

export async function createComment(
  bookmarkId: string,
  userId: string,
  data: CreateCommentInput,
) {
  const bookmark = await prisma.bookmark.findUnique({ where: { id: bookmarkId } });

  if (!bookmark) {
    throw new AppError('Bookmark not found', 404);
  }

  if (!bookmark.isPublic && bookmark.userId !== userId) {
    throw new AppError('Bookmark not found', 404);
  }

  return prisma.comment.create({
    data: { content: data.content, userId, bookmarkId },
    include: commentInclude,
  });
}

export async function updateComment(id: string, userId: string, data: UpdateCommentInput) {
  const existing = await prisma.comment.findUnique({ where: { id } });

  if (!existing) {
    throw new AppError('Comment not found', 404);
  }

  if (existing.userId !== userId) {
    throw new AppError('Forbidden', 403);
  }

  return prisma.comment.update({
    where: { id },
    data: { content: data.content },
    include: commentInclude,
  });
}

export async function deleteComment(id: string, userId: string) {
  const existing = await prisma.comment.findUnique({ where: { id } });

  if (!existing) {
    throw new AppError('Comment not found', 404);
  }

  if (existing.userId !== userId) {
    throw new AppError('Forbidden', 403);
  }

  await prisma.comment.delete({ where: { id } });
}
