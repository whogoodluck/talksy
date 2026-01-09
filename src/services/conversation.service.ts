import { ConversationType, MessageType, ParticipantRole } from '@prisma/client'
import { deleteImage } from '../lib/cloudinary'
import { prisma } from '../lib/prisma'
import {
  CreateDirectConversationRequest,
  CreateGroupConversationRequest,
  GetConversationsRequest,
  SearchConversationsRequest,
  UpdateGroupConversationRequest,
} from '../schemas/conversation.schema'
import { USER_SAFE_FIELDS } from './user.service'

const createDirectConversation = async (userId: string, data: CreateDirectConversationRequest) => {
  return await prisma.conversation.create({
    data: {
      type: ConversationType.DIRECT,
      createdBy: userId,
      participants: {
        create: [
          { userId, role: ParticipantRole.CREATOR },
          { userId: data.participantId, role: ParticipantRole.ADMIN },
        ],
      },
    },
    include: {
      participants: {
        include: {
          user: {
            omit: USER_SAFE_FIELDS,
          },
        },
      },
      messages: {
        take: 1,
        orderBy: { createdAt: 'desc' },
        include: {
          readReceipts: true,
        },
      },
    },
  })
}

const createGroupConversation = async (userId: string, data: CreateGroupConversationRequest) => {
  return await prisma.conversation.create({
    data: {
      type: ConversationType.GROUP,
      name: data.name,
      picture: data.picture,
      createdBy: userId,
      participants: {
        create: [
          { userId, role: ParticipantRole.CREATOR },
          ...data.participantIds.map(id => ({ userId: id, role: ParticipantRole.MEMBER })),
        ],
      },
    },
    include: {
      participants: {
        include: {
          user: {
            omit: USER_SAFE_FIELDS,
          },
        },
      },
      messages: {
        take: 1,
        orderBy: { createdAt: 'desc' },
        include: {
          readReceipts: true,
        },
      },
    },
  })
}

const getUserConversations = async (userId: string, params?: GetConversationsRequest) => {
  const whereClause: any = {
    participants: {
      some: {
        userId,
        // leftAt: null,
      },
    },
  }

  if (params) {
    const { tab } = params

    if (tab) {
      if (tab === ConversationType.GROUP) {
        whereClause.type = ConversationType.GROUP
      } else if (tab === ConversationType.DIRECT) {
        whereClause.type = ConversationType.DIRECT
      }
    }
  }

  return await prisma.conversation.findMany({
    where: whereClause,
    include: {
      participants: {
        where: {
          leftAt: null,
        },
        include: {
          user: {
            omit: USER_SAFE_FIELDS,
          },
        },
      },
      messages: {
        take: 1,
        orderBy: { createdAt: 'desc' },
        include: {
          readReceipts: true,
        },
      },
      _count: {
        select: {
          participants: true,
        },
      },
    },
    orderBy: {
      updatedAt: 'desc',
    },
  })
}

const getUserConversationsByQuery = async (userId: string, params: SearchConversationsRequest) => {
  const { q } = params
  const whereClause: any = {
    participants: {
      some: {
        userId,
        // leftAt: null,
      },
    },
  }

  if (q) {
    whereClause.OR = [
      {
        name: {
          contains: q,
          mode: 'insensitive',
        },
      },
      {
        participants: {
          some: {
            user: {
              name: {
                contains: q,
                mode: 'insensitive',
              },
              username: {
                contains: q,
                mode: 'insensitive',
              },
              email: {
                contains: q,
                mode: 'insensitive',
              },
            },
          },
        },
      },
    ]
  }

  return await prisma.conversation.findMany({
    where: whereClause,
    include: {
      participants: {
        where: {
          leftAt: null,
        },
        include: {
          user: {
            omit: USER_SAFE_FIELDS,
          },
        },
      },
      messages: {
        take: 1,
        orderBy: { createdAt: 'desc' },
        include: {
          readReceipts: true,
        },
      },
      _count: {
        select: {
          participants: true,
        },
      },
    },
    orderBy: {
      updatedAt: 'desc',
    },
  })
}

const getConversationByIdAndUserId = async (conversationId: string, userId: string) => {
  return await prisma.conversation.findFirst({
    where: {
      id: conversationId,
      participants: {
        some: {
          userId,
          // leftAt: null,
        },
      },
    },
    include: {
      participants: {
        where: {
          leftAt: null,
        },
        include: {
          user: {
            omit: USER_SAFE_FIELDS,
          },
        },
        orderBy: {
          role: 'asc',
        },
      },
      _count: {
        select: {
          messages: true,
        },
      },
    },
  })
}

const getDirectConversationByCurrentUserIdAndOtherUserId = async (
  currentUserId: string,
  participantId: string
) => {
  return await prisma.conversation.findFirst({
    where: {
      type: ConversationType.DIRECT,
      participants: {
        every: {
          userId: {
            in: [currentUserId, participantId],
          },
        },
      },
    },
  })
}

const getParticipantByConversationIdAndUserId = async (
  conversationId: string,
  participantId: string
) => {
  return await prisma.conversationParticipant.findFirst({
    where: {
      conversationId,
      userId: participantId,
    },
  })
}

const updateGroupInfo = async (conversationId: string, data: UpdateGroupConversationRequest) => {
  return await prisma.conversation.update({
    where: { id: conversationId },
    data: {
      name: data.name,
    },
    include: {
      participants: {
        where: {
          leftAt: null,
        },
        include: {
          user: {
            omit: USER_SAFE_FIELDS,
          },
        },
      },
      messages: {
        take: 1,
        orderBy: { createdAt: 'desc' },
        include: {
          readReceipts: true,
        },
      },
    },
  })
}

const updateGroupPicture = async (conversaionId: string, picture: string) => {
  return await prisma.conversation.update({
    where: { id: conversaionId },
    data: {
      picture,
    },
    include: {
      participants: {
        where: {
          leftAt: null,
        },
        include: {
          user: {
            omit: USER_SAFE_FIELDS,
          },
        },
      },
      messages: {
        take: 1,
        orderBy: { createdAt: 'desc' },
        include: {
          readReceipts: true,
        },
      },
    },
  })
}

const addParticipant = async (conversationId: string, userId: string) => {
  return await prisma.conversationParticipant.create({
    data: {
      conversationId,
      userId: userId,
    },
  })
}

const removeParticipant = async (conversationId: string, userId: string) => {
  return await prisma.conversationParticipant.update({
    where: {
      conversationId_userId: {
        conversationId,
        userId,
      },
    },
    data: {
      leftAt: new Date(),
      role: ParticipantRole.MEMBER,
    },
  })
}

const addParticipantAgain = async (conversationId: string, userId: string) => {
  return await prisma.conversationParticipant.update({
    where: {
      conversationId_userId: {
        conversationId,
        userId,
      },
    },
    data: {
      leftAt: null,
    },
  })
}

const makeAdmin = async (conversationId: string, userId: string) => {
  return await prisma.conversationParticipant.update({
    where: {
      conversationId_userId: {
        conversationId,
        userId,
      },
    },
    data: {
      role: ParticipantRole.ADMIN,
    },
  })
}

const makeAdminToMember = async (conversationId: string, userId: string) => {
  return await prisma.conversationParticipant.update({
    where: {
      conversationId_userId: {
        conversationId,
        userId,
      },
    },
    data: {
      role: ParticipantRole.MEMBER,
    },
  })
}

const deleteConversationParticipant = async (conversationId: string, userId: string) => {
  return await prisma.conversationParticipant.delete({
    where: {
      conversationId_userId: {
        conversationId,
        userId,
      },
    },
  })
}

const deleteConversation = async (conversationId: string) => {
  const messages = await prisma.message.findMany({
    where: {
      conversationId,
    },
  })

  for (const message of messages) {
    if (message.type === MessageType.IMAGE) {
      if (message.fileUrl) await deleteImage(message.fileUrl)
    }
  }

  return await prisma.conversation.delete({
    where: {
      id: conversationId,
    },
  })
}

export default {
  createDirectConversation,
  createGroupConversation,
  getUserConversations,
  getUserConversationsByQuery,
  getConversationByIdAndUserId,
  getDirectConversationByCurrentUserIdAndOtherUserId,
  getParticipantByConversationIdAndUserId,
  addParticipant,
  updateGroupInfo,
  updateGroupPicture,
  removeParticipant,
  addParticipantAgain,
  makeAdmin,
  makeAdminToMember,
  deleteConversationParticipant,
  deleteConversation,
}
