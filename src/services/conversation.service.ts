import { ConversationType } from '@prisma/client'
import { prisma } from '../lib/prisma'
import {
  CreateDirectConversationRequest,
  CreateGroupConversationRequest,
  GetConversationsRequest,
  SearchConversationsRequest,
  TAB,
} from '../schemas/conversation.schema'
import { USER_SAFE_FIELDS } from './user.service'

const createDirectConversation = async (userId: string, data: CreateDirectConversationRequest) => {
  const existingConversation = await prisma.conversation.findFirst({
    where: {
      type: ConversationType.DIRECT,
      participants: {
        every: {
          userId: {
            in: [userId, data.participantId],
          },
        },
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
          sender: {
            omit: USER_SAFE_FIELDS,
          },
        },
      },
    },
  })

  if (existingConversation) {
    return existingConversation
  }

  return await prisma.conversation.create({
    data: {
      type: ConversationType.DIRECT,
      createdBy: userId,
      participants: {
        create: [
          { userId, isAdmin: true },
          { userId: data.participantId, isAdmin: true },
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
          sender: {
            omit: USER_SAFE_FIELDS,
          },
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
          { userId, isAdmin: true },
          ...data.participantIds.map(id => ({ userId: id, isAdmin: false })),
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
          sender: {
            omit: USER_SAFE_FIELDS,
          },
        },
      },
    },
  })
}

const getUserConversations = async (userId: string, params: GetConversationsRequest) => {
  const { tab } = params
  const whereClause: any = {
    participants: {
      some: {
        userId,
        leftAt: null,
      },
    },
  }

  if (tab) {
    if (tab === TAB.GROUP) {
      whereClause.type = ConversationType.GROUP
    } else if (tab === TAB.DIRECT) {
      whereClause.type = ConversationType.DIRECT
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
          sender: {
            omit: USER_SAFE_FIELDS,
          },
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
        leftAt: null,
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
          sender: {
            omit: USER_SAFE_FIELDS,
          },
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

export default {
  createDirectConversation,
  createGroupConversation,
  getUserConversations,
  getUserConversationsByQuery,
}
