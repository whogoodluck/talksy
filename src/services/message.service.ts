import { ConversationParticipant } from '@prisma/client'
import { prisma } from '../lib/prisma'
import { SendMessageRequest } from '../schemas/message.schema'
import { USER_SAFE_FIELDS } from './user.service'

const sendMessage = async (conversationId: string, senderId: string, data: SendMessageRequest) => {
  const message = await prisma.message.create({
    data: {
      conversationId,
      senderId,
      content: data.content ?? '',
      ...data,
    },
    include: {
      sender: {
        omit: USER_SAFE_FIELDS,
      },
      replyTo: {
        include: {
          sender: {
            omit: USER_SAFE_FIELDS,
          },
        },
      },
    },
  })

  await prisma.conversation.update({
    where: {
      id: conversationId,
    },
    data: {
      updatedAt: new Date(),
    },
  })

  return message
}

const getMessages = async (participant: Partial<ConversationParticipant>, limit: number) => {
  const whereClause: any = {
    conversationId: participant.conversationId,
    createdAt: {
      gte: participant.joinedAt,
    },
  }

  if (participant.leftAt) {
    whereClause.createdAt = {
      ...whereClause.createdAt,
      lte: participant.leftAt,
    }
  }

  return await prisma.message.findMany({
    where: whereClause,
    take: limit,
    orderBy: {
      createdAt: 'desc',
    },
    include: {
      sender: {
        omit: USER_SAFE_FIELDS,
      },
      replyTo: {
        include: {
          sender: {
            omit: USER_SAFE_FIELDS,
          },
        },
      },
      readReceipts: true,
    },
  })
}

const getLastMessage = async (participant: Partial<ConversationParticipant>) => {
  return await prisma.message.findFirst({
    where: {
      conversationId: participant.conversationId,
      createdAt: {
        gte: participant.joinedAt,
        ...(participant.leftAt && { lte: participant.leftAt }),
      },
    },
    include: {
      readReceipts: true,
    },
    orderBy: { createdAt: 'desc' },
  })
}

const getMessageById = async (messageId: string) => {
  return await prisma.message.findUnique({
    where: {
      id: messageId,
    },
  })
}

const markAsRead = async (messageId: string, userId: string) => {
  return await prisma.readReceipt.upsert({
    where: {
      messageId_userId: {
        messageId,
        userId,
      },
    },
    create: {
      messageId,
      userId,
    },
    update: {
      readAt: new Date(),
    },
  })
}

const updateLastRead = async (conversationId: string, userId: string) => {
  return await prisma.conversationParticipant.updateMany({
    where: {
      conversationId,
      userId,
    },
    data: {
      lastReadAt: new Date(),
    },
  })
}

export default {
  sendMessage,
  getMessages,
  getLastMessage,
  getMessageById,
  markAsRead,
  updateLastRead,
}
