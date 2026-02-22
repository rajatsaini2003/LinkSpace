import { AppError } from '../../middlewares/error.middleware';
import {
  CreateCollectionInput,
  UpdateCollectionInput,
  AddBookmarkInput,
} from './collections.validation';
import prisma from '../../lib/prisma';
import { randomBytes } from 'crypto';

const collectionInclude = {
  user: { select: { id: true, username: true, displayName: true, avatarUrl: true } },
  _count: { select: { bookmarks: true } },
};

function generateShareSlug(): string {
  return randomBytes(6).toString('base64url');
}

export async function getCollections(userId?: string, ownerId?: string) {
  const where: Record<string, unknown> = {};

  if (ownerId) {
    where['userId'] = ownerId;
    if (!userId || userId !== ownerId) {
      where['isPublic'] = true;
    }
  } else if (userId) {
    // If no ownerId specified, return the current user's collections
    where['userId'] = userId;
  } else {
    where['isPublic'] = true;
  }

  return prisma.collection.findMany({
    where,
    include: collectionInclude,
    orderBy: { createdAt: 'desc' },
  });
}

export async function getCollectionById(id: string, requesterId?: string) {
  const collection = await prisma.collection.findUnique({
    where: { id },
    include: {
      ...collectionInclude,
      bookmarks: {
        include: {
          bookmark: {
            include: {
              user: { select: { id: true, username: true, displayName: true, avatarUrl: true } },
              tags: { include: { tag: true } },
              _count: { select: { likes: true, comments: true } },
            },
          },
        },
        orderBy: { addedAt: 'desc' },
      },
    },
  });

  if (!collection) {
    throw new AppError('Collection not found', 404);
  }

  if (!collection.isPublic && collection.userId !== requesterId) {
    throw new AppError('Collection not found', 404);
  }

  return {
    ...collection,
    bookmarks: collection.bookmarks.map((bc) => ({
      ...bc.bookmark,
      tags: bc.bookmark.tags.map((bt) => bt.tag),
      addedAt: bc.addedAt,
    })),
  };
}

export async function getCollectionByShareSlug(slug: string, requesterId?: string) {
  const collection = await prisma.collection.findUnique({
    where: { shareSlug: slug },
    include: {
      ...collectionInclude,
      bookmarks: {
        include: {
          bookmark: {
            include: {
              user: { select: { id: true, username: true, displayName: true, avatarUrl: true } },
              tags: { include: { tag: true } },
              _count: { select: { likes: true, comments: true } },
            },
          },
        },
        orderBy: { addedAt: 'desc' },
      },
    },
  });

  if (!collection) {
    throw new AppError('Collection not found', 404);
  }

  if (!collection.isPublic && collection.userId !== requesterId) {
    throw new AppError('Collection not found', 404);
  }

  return {
    ...collection,
    bookmarks: collection.bookmarks.map((bc) => ({
      ...bc.bookmark,
      tags: bc.bookmark.tags.map((bt) => bt.tag),
      addedAt: bc.addedAt,
    })),
  };
}

export async function createCollection(userId: string, data: CreateCollectionInput) {
  return prisma.collection.create({
    data: { ...data, userId, shareSlug: generateShareSlug() },
    include: collectionInclude,
  });
}

export async function updateCollection(id: string, userId: string, data: UpdateCollectionInput) {
  const existing = await prisma.collection.findUnique({ where: { id } });

  if (!existing) {
    throw new AppError('Collection not found', 404);
  }

  if (existing.userId !== userId) {
    throw new AppError('Forbidden', 403);
  }

  return prisma.collection.update({ where: { id }, data, include: collectionInclude });
}

export async function deleteCollection(id: string, userId: string) {
  const existing = await prisma.collection.findUnique({ where: { id } });

  if (!existing) {
    throw new AppError('Collection not found', 404);
  }

  if (existing.userId !== userId) {
    throw new AppError('Forbidden', 403);
  }

  await prisma.collection.delete({ where: { id } });
}

export async function addBookmarkToCollection(
  collectionId: string,
  userId: string,
  data: AddBookmarkInput,
) {
  const collection = await prisma.collection.findUnique({ where: { id: collectionId } });

  if (!collection) {
    throw new AppError('Collection not found', 404);
  }

  if (collection.userId !== userId) {
    throw new AppError('Forbidden', 403);
  }

  const bookmark = await prisma.bookmark.findUnique({ where: { id: data.bookmarkId } });
  if (!bookmark) {
    throw new AppError('Bookmark not found', 404);
  }

  await prisma.bookmarkCollection.upsert({
    where: { bookmarkId_collectionId: { bookmarkId: data.bookmarkId, collectionId } },
    update: {},
    create: { bookmarkId: data.bookmarkId, collectionId },
  });

  return { added: true };
}

export async function removeBookmarkFromCollection(
  collectionId: string,
  bookmarkId: string,
  userId: string,
) {
  const collection = await prisma.collection.findUnique({ where: { id: collectionId } });

  if (!collection) {
    throw new AppError('Collection not found', 404);
  }

  if (collection.userId !== userId) {
    throw new AppError('Forbidden', 403);
  }

  await prisma.bookmarkCollection.delete({
    where: { bookmarkId_collectionId: { bookmarkId, collectionId } },
  });

  return { removed: true };
}

export async function cloneCollection(collectionId: string, userId: string) {
  const source = await prisma.collection.findUnique({
    where: { id: collectionId },
    include: {
      bookmarks: { select: { bookmarkId: true } },
    },
  });

  if (!source) {
    throw new AppError('Collection not found', 404);
  }

  if (!source.isPublic && source.userId !== userId) {
    throw new AppError('Collection not found', 404);
  }

  if (source.userId === userId) {
    throw new AppError('Cannot clone your own collection', 400);
  }

  const cloned = await prisma.collection.create({
    data: {
      name: source.name,
      description: source.description,
      isPublic: false,
      shareSlug: generateShareSlug(),
      userId,
      bookmarks: {
        create: source.bookmarks.map((bc) => ({ bookmarkId: bc.bookmarkId })),
      },
    },
    include: collectionInclude,
  });

  return cloned;
}

export async function regenerateShareSlug(collectionId: string, userId: string) {
  const existing = await prisma.collection.findUnique({ where: { id: collectionId } });

  if (!existing) {
    throw new AppError('Collection not found', 404);
  }

  if (existing.userId !== userId) {
    throw new AppError('Forbidden', 403);
  }

  return prisma.collection.update({
    where: { id: collectionId },
    data: { shareSlug: generateShareSlug() },
    include: collectionInclude,
  });
}
