import { AppError } from '../../middlewares/error.middleware';
import { UpdateUserInput } from './users.validation';
import prisma from '../../lib/prisma';

const userPublicSelect = {
  id: true,
  username: true,
  displayName: true,
  bio: true,
  avatarUrl: true,
  isPublic: true,
  createdAt: true,
};

export async function getUserByUsername(username: string, requesterId?: string) {
  const user = await prisma.user.findUnique({
    where: { username },
    select: {
      ...userPublicSelect,
      _count: {
        select: {
          bookmarks: { where: { isPublic: true } },
          followers: true,
          following: true,
        },
      },
    },
  });

  if (!user) {
    throw new AppError('User not found', 404);
  }

  let isFollowing = false;
  if (requesterId) {
    const follow = await prisma.follow.findUnique({
      where: { followerId_followingId: { followerId: requesterId, followingId: user.id } },
    });
    isFollowing = !!follow;
  }

  return { ...user, isFollowing };
}

export async function updateProfile(userId: string, data: UpdateUserInput) {
  const user = await prisma.user.update({
    where: { id: userId },
    data,
    select: userPublicSelect,
  });
  return user;
}

export async function followUser(followerId: string, followingId: string) {
  if (followerId === followingId) {
    throw new AppError('You cannot follow yourself', 400);
  }

  const target = await prisma.user.findUnique({ where: { id: followingId } });
  if (!target) {
    throw new AppError('User not found', 404);
  }

  const existing = await prisma.follow.findUnique({
    where: { followerId_followingId: { followerId, followingId } },
  });

  if (existing) {
    // Unfollow
    await prisma.follow.delete({
      where: { followerId_followingId: { followerId, followingId } },
    });
    return { following: false };
  }

  // Follow
  await prisma.follow.create({ data: { followerId, followingId } });
  return { following: true };
}

export async function getFollowers(userId: string, page: number, limit: number) {
  const skip = (page - 1) * limit;

  const [followers, total] = await Promise.all([
    prisma.follow.findMany({
      where: { followingId: userId },
      skip,
      take: limit,
      include: { follower: { select: userPublicSelect } },
      orderBy: { createdAt: 'desc' },
    }),
    prisma.follow.count({ where: { followingId: userId } }),
  ]);

  return {
    followers: followers.map((f) => f.follower),
    total,
    page,
    limit,
    hasNextPage: skip + limit < total,
  };
}

export async function getFollowing(userId: string, page: number, limit: number) {
  const skip = (page - 1) * limit;

  const [following, total] = await Promise.all([
    prisma.follow.findMany({
      where: { followerId: userId },
      skip,
      take: limit,
      include: { following: { select: userPublicSelect } },
      orderBy: { createdAt: 'desc' },
    }),
    prisma.follow.count({ where: { followerId: userId } }),
  ]);

  return {
    following: following.map((f) => f.following),
    total,
    page,
    limit,
    hasNextPage: skip + limit < total,
  };
}
