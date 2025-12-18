import { prisma } from '../lib/prisma'
import { SendMessageRequest } from '../schemas/message.schema'
import { USER_SAFE_FIELDS } from './user.service'

const sendMessage = async (conversationId: string, senderId: string, data: SendMessageRequest) => {
  return await prisma.message.create({
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
}

const getMessages = async (conversationId: string, limit: number) => {
  return await prisma.message.findMany({
    where: {
      conversationId,
    },
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
      readReceipts: {
        include: {
          user: {
            omit: USER_SAFE_FIELDS,
          },
        },
      },
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
  updateLastRead,
}
