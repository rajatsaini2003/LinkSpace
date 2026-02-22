import { AppError } from '../../middlewares/error.middleware';
import prisma from '../../lib/prisma';

const bookmarkInclude = {
  user: { select: { id: true, username: true, displayName: true, avatarUrl: true } },
  tags: { include: { tag: true } },
  _count: { select: { likes: true, comments: true } },
};

export async function getTrendingFeed(page: number, limit: number, requesterId?: string) {
  const skip = (page - 1) * limit;
  const since = new Date();
  since.setDate(since.getDate() - 7); // Last 7 days

  const [bookmarks, total] = await Promise.all([
    prisma.bookmark.findMany({
      where: { isPublic: true, createdAt: { gte: since } },
      skip,
      take: limit,
      include: {
        ...bookmarkInclude,
        likes: { select: { id: true } },
      },
      orderBy: [{ likes: { _count: 'desc' } }, { comments: { _count: 'desc' } }, { createdAt: 'desc' }],
    }),
    prisma.bookmark.count({ where: { isPublic: true, createdAt: { gte: since } } }),
  ]);

  let likedBookmarkIds = new Set<string>();
  if (requesterId && bookmarks.length > 0) {
    const likes = await prisma.like.findMany({
      where: { userId: requesterId, bookmarkId: { in: bookmarks.map((b) => b.id) } },
      select: { bookmarkId: true },
    });
    likedBookmarkIds = new Set(likes.map((l) => l.bookmarkId));
  }

  return {
    bookmarks: bookmarks.map((b) => ({
      ...b,
      tags: b.tags.map((bt) => bt.tag),
      isLiked: likedBookmarkIds.has(b.id),
      likes: undefined,
    })),
    total,
    page,
    limit,
    hasNextPage: skip + limit < total,
  };
}

export async function getFollowingFeed(userId: string, page: number, limit: number) {
  const skip = (page - 1) * limit;

  const follows = await prisma.follow.findMany({
    where: { followerId: userId },
    select: { followingId: true },
  });

  if (follows.length === 0) {
    return { bookmarks: [], total: 0, page, limit, hasNextPage: false };
  }

  const followingIds = follows.map((f) => f.followingId);

  const [bookmarks, total] = await Promise.all([
    prisma.bookmark.findMany({
      where: { userId: { in: followingIds }, isPublic: true },
      skip,
      take: limit,
      include: bookmarkInclude,
      orderBy: { createdAt: 'desc' },
    }),
    prisma.bookmark.count({ where: { userId: { in: followingIds }, isPublic: true } }),
  ]);

  const likedBookmarkIds =
    bookmarks.length > 0
      ? new Set(
          (
            await prisma.like.findMany({
              where: { userId, bookmarkId: { in: bookmarks.map((b) => b.id) } },
              select: { bookmarkId: true },
            })
          ).map((l) => l.bookmarkId),
        )
      : new Set<string>();

  return {
    bookmarks: bookmarks.map((b) => ({
      ...b,
      tags: b.tags.map((bt) => bt.tag),
      isLiked: likedBookmarkIds.has(b.id),
    })),
    total,
    page,
    limit,
    hasNextPage: skip + limit < total,
  };
}
