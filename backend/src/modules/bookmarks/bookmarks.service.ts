import { AppError } from '../../middlewares/error.middleware';
import {
  CreateBookmarkInput,
  UpdateBookmarkInput,
  BookmarkQueryInput,
} from './bookmarks.validation';
import prisma from '../../lib/prisma';

const bookmarkInclude = {
  user: { select: { id: true, username: true, displayName: true, avatarUrl: true } },
  tags: { include: { tag: true } },
  _count: { select: { likes: true, comments: true } },
};

async function upsertTags(tagNames: string[]) {
  return Promise.all(
    tagNames.map((name) =>
      prisma.tag.upsert({
        where: { name: name.toLowerCase() },
        update: {},
        create: { name: name.toLowerCase() },
      }),
    ),
  );
}

export async function getBookmarks(query: BookmarkQueryInput, requesterId?: string) {
  const { page, limit, tag, search, userId } = query;
  const skip = (page - 1) * limit;

  // Build visibility condition
  const visibilityCondition =
    userId && requesterId && requesterId === userId
      ? { userId }
      : userId
        ? { userId, isPublic: true }
        : { OR: [{ isPublic: true }, ...(requesterId ? [{ userId: requesterId }] : [])] };

  // Build search condition
  const searchCondition = search
    ? {
        OR: [
          { title: { contains: search, mode: 'insensitive' as const } },
          { description: { contains: search, mode: 'insensitive' as const } },
          { url: { contains: search, mode: 'insensitive' as const } },
        ],
      }
    : {};

  const tagCondition = tag ? { tags: { some: { tag: { name: tag.toLowerCase() } } } } : {};

  const where = { AND: [visibilityCondition, searchCondition, tagCondition] };

  const [bookmarks, total] = await Promise.all([
    prisma.bookmark.findMany({
      where,
      skip,
      take: limit,
      include: bookmarkInclude,
      orderBy: { createdAt: 'desc' },
    }),
    prisma.bookmark.count({ where }),
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
    })),
    total,
    page,
    limit,
    hasNextPage: skip + limit < total,
  };
}

export async function getBookmarkById(id: string, requesterId?: string) {
  const bookmark = await prisma.bookmark.findUnique({
    where: { id },
    include: {
      ...bookmarkInclude,
      comments: {
        include: { user: { select: { id: true, username: true, displayName: true, avatarUrl: true } } },
        orderBy: { createdAt: 'desc' },
        take: 20,
      },
    },
  });

  if (!bookmark) {
    throw new AppError('Bookmark not found', 404);
  }

  if (!bookmark.isPublic && bookmark.userId !== requesterId) {
    throw new AppError('Bookmark not found', 404);
  }

  let isLiked = false;
  if (requesterId) {
    const like = await prisma.like.findUnique({
      where: { userId_bookmarkId: { userId: requesterId, bookmarkId: id } },
    });
    isLiked = !!like;
  }

  return {
    ...bookmark,
    tags: bookmark.tags.map((bt) => bt.tag),
    isLiked,
  };
}

export async function createBookmark(userId: string, data: CreateBookmarkInput) {
  const { tags, collectionIds, ...bookmarkData } = data;

  const tagRecords = tags.length > 0 ? await upsertTags(tags) : [];

  const bookmark = await prisma.bookmark.create({
    data: {
      ...bookmarkData,
      userId,
      tags: {
        create: tagRecords.map((tag) => ({ tagId: tag.id })),
      },
      ...(collectionIds.length > 0 && {
        collections: {
          create: collectionIds.map((collectionId) => ({ collectionId })),
        },
      }),
    },
    include: bookmarkInclude,
  });

  return { ...bookmark, tags: bookmark.tags.map((bt) => bt.tag) };
}

export async function updateBookmark(id: string, userId: string, data: UpdateBookmarkInput) {
  const existing = await prisma.bookmark.findUnique({ where: { id } });

  if (!existing) {
    throw new AppError('Bookmark not found', 404);
  }

  if (existing.userId !== userId) {
    throw new AppError('Forbidden', 403);
  }

  const { tags, collectionIds, ...bookmarkData } = data;

  if (tags !== undefined) {
    await prisma.bookmarkTag.deleteMany({ where: { bookmarkId: id } });
    if (tags.length > 0) {
      const tagRecords = await upsertTags(tags);
      await prisma.bookmarkTag.createMany({
        data: tagRecords.map((tag) => ({ bookmarkId: id, tagId: tag.id })),
        skipDuplicates: true,
      });
    }
  }

  if (collectionIds !== undefined) {
    await prisma.bookmarkCollection.deleteMany({ where: { bookmarkId: id } });
    if (collectionIds.length > 0) {
      await prisma.bookmarkCollection.createMany({
        data: collectionIds.map((collectionId) => ({ bookmarkId: id, collectionId })),
        skipDuplicates: true,
      });
    }
  }

  const bookmark = await prisma.bookmark.update({
    where: { id },
    data: bookmarkData,
    include: bookmarkInclude,
  });

  return { ...bookmark, tags: bookmark.tags.map((bt) => bt.tag) };
}

export async function deleteBookmark(id: string, userId: string) {
  const existing = await prisma.bookmark.findUnique({ where: { id } });

  if (!existing) {
    throw new AppError('Bookmark not found', 404);
  }

  if (existing.userId !== userId) {
    throw new AppError('Forbidden', 403);
  }

  await prisma.bookmark.delete({ where: { id } });
}

export async function toggleLike(bookmarkId: string, userId: string) {
  const bookmark = await prisma.bookmark.findUnique({ where: { id: bookmarkId } });

  if (!bookmark) {
    throw new AppError('Bookmark not found', 404);
  }

  if (!bookmark.isPublic && bookmark.userId !== userId) {
    throw new AppError('Bookmark not found', 404);
  }

  const existing = await prisma.like.findUnique({
    where: { userId_bookmarkId: { userId, bookmarkId } },
  });

  if (existing) {
    await prisma.like.delete({ where: { userId_bookmarkId: { userId, bookmarkId } } });
    const count = await prisma.like.count({ where: { bookmarkId } });
    return { liked: false, count };
  }

  await prisma.like.create({ data: { userId, bookmarkId } });
  const count = await prisma.like.count({ where: { bookmarkId } });
  return { liked: true, count };
}
