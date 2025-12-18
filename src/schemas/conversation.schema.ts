import { ConversationType } from '@prisma/client'
import { z } from 'zod'
import { requiredString } from './helper'

export const createDirectConversationSchema = z.object({
  type: z.nativeEnum(ConversationType).default(ConversationType.DIRECT),
  participantId: z.string().cuid(),
})

export const createGroupConversationSchema = z.object({
  type: z.nativeEnum(ConversationType).default(ConversationType.GROUP),
  name: requiredString('Name').max(100, 'Name cannot exceed 100 characters'),
  picture: z.string().url().optional(),
  participantIds: z.array(z.string().cuid()).min(1, 'At least one participant is required'),
})

const HOME_TAB = {
  ALL: 'ALL',
  ...ConversationType,
} as const

export const getConversationsSchema = z.object({
  tab: z.nativeEnum(HOME_TAB).default(HOME_TAB.ALL),
})

export const searchConversationsSchema = z.object({
  q: z.string().trim().max(50, 'Query cannot exceed 50 characters').optional(),
})

export type CreateDirectConversationRequest = z.infer<typeof createDirectConversationSchema>
export type CreateGroupConversationRequest = z.infer<typeof createGroupConversationSchema>
export type SearchConversationsRequest = z.infer<typeof searchConversationsSchema>
export type GetConversationsRequest = z.infer<typeof getConversationsSchema>
