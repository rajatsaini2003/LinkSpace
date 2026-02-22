import { AppError } from '../../middlewares/error.middleware';
import { TagQueryInput } from './tags.validation';
import prisma from '../../lib/prisma';

export async function getTags(query: TagQueryInput) {
  const { search, limit } = query;

  const where = search ? { name: { contains: search.toLowerCase() } } : {};

  const tags = await prisma.tag.findMany({
    where,
    take: limit,
    orderBy: { bookmarks: { _count: 'desc' } },
    include: { _count: { select: { bookmarks: true } } },
  });

  return tags.map((tag) => ({ ...tag, bookmarkCount: tag._count.bookmarks }));
}

export async function getTagByName(name: string) {
  const tag = await prisma.tag.findUnique({
    where: { name: name.toLowerCase() },
    include: { _count: { select: { bookmarks: true } } },
  });

  if (!tag) {
    throw new AppError('Tag not found', 404);
  }

  return { ...tag, bookmarkCount: tag._count.bookmarks };
}

export async function getTrendingTags(limit = 20) {
  const tags = await prisma.tag.findMany({
    take: limit,
    orderBy: { bookmarks: { _count: 'desc' } },
    include: { _count: { select: { bookmarks: true } } },
  });

  return tags.map((tag) => ({ ...tag, bookmarkCount: tag._count.bookmarks }));
}
