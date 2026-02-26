import { AppError } from '../../middlewares/error.middleware';
import prisma from '../../lib/prisma';

const userSelect = { id: true, username: true, displayName: true, avatarUrl: true };

export async function getOrCreateConversation(userId: string, participantId: string) {
  if (userId === participantId) {
    throw new AppError('Cannot start a conversation with yourself', 400);
  }

  const participant = await prisma.user.findUnique({ where: { id: participantId } });
  if (!participant) {
    throw new AppError('User not found', 404);
  }

  // Check if a conversation already exists between these two users
  const existing = await prisma.conversation.findFirst({
    where: {
      AND: [
        { participants: { some: { userId } } },
        { participants: { some: { userId: participantId } } },
      ],
    },
    include: {
      participants: { include: { user: { select: userSelect } } },
      messages: {
        orderBy: { createdAt: 'desc' },
        take: 1,
        include: { sender: { select: userSelect } },
      },
    },
  });

  if (existing) {
    return {
      ...existing,
      participants: existing.participants.map((p) => p.user),
      lastMessage: existing.messages[0] || null,
    };
  }

  // Create new conversation
  const conversation = await prisma.conversation.create({
    data: {
      participants: {
        create: [{ userId }, { userId: participantId }],
      },
    },
    include: {
      participants: { include: { user: { select: userSelect } } },
      messages: {
        orderBy: { createdAt: 'desc' },
        take: 1,
        include: { sender: { select: userSelect } },
      },
    },
  });

  return {
    ...conversation,
    participants: conversation.participants.map((p) => p.user),
    lastMessage: conversation.messages[0] || null,
  };
}

export async function getConversations(userId: string) {
  const conversations = await prisma.conversation.findMany({
    where: { participants: { some: { userId } } },
    include: {
      participants: { include: { user: { select: userSelect } } },
      messages: {
        orderBy: { createdAt: 'desc' },
        take: 1,
        include: { sender: { select: userSelect } },
      },
    },
    orderBy: { updatedAt: 'desc' },
  });

  return conversations.map((c) => ({
    ...c,
    participants: c.participants.map((p) => p.user),
    lastMessage: c.messages[0] || null,
  }));
}

export async function getMessages(conversationId: string, userId: string, page: number, limit: number) {
  // Verify user is a participant
  const participant = await prisma.conversationParticipant.findUnique({
    where: { conversationId_userId: { conversationId, userId } },
  });

  if (!participant) {
    throw new AppError('Conversation not found', 404);
  }

  const skip = (page - 1) * limit;

  const [messages, total] = await Promise.all([
    prisma.message.findMany({
      where: { conversationId },
      include: { sender: { select: userSelect } },
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit,
    }),
    prisma.message.count({ where: { conversationId } }),
  ]);

  return {
    messages: messages.reverse(),
    total,
    page,
    limit,
    hasNextPage: skip + limit < total,
  };
}

export async function sendMessage(conversationId: string, senderId: string, content: string) {
  // Verify sender is a participant
  const participant = await prisma.conversationParticipant.findUnique({
    where: { conversationId_userId: { conversationId, userId: senderId } },
  });

  if (!participant) {
    throw new AppError('Conversation not found', 404);
  }

  const message = await prisma.message.create({
    data: { content, conversationId, senderId },
    include: { sender: { select: userSelect } },
  });

  // Update conversation timestamp
  await prisma.conversation.update({
    where: { id: conversationId },
    data: { updatedAt: new Date() },
  });

  return message;
}

export async function getConversationById(conversationId: string, userId: string) {
  const conversation = await prisma.conversation.findFirst({
    where: {
      id: conversationId,
      participants: { some: { userId } },
    },
    include: {
      participants: { include: { user: { select: userSelect } } },
    },
  });

  if (!conversation) {
    throw new AppError('Conversation not found', 404);
  }

  return {
    ...conversation,
    participants: conversation.participants.map((p) => p.user),
  };
}
