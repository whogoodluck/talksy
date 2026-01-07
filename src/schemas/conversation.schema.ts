import { ConversationType } from '@prisma/client'
import { z } from 'zod'

export const createDirectConversationSchema = z.object({
  type: z.nativeEnum(ConversationType).default(ConversationType.DIRECT),
  participantId: z.string().cuid(),
})

export const createGroupConversationSchema = z.object({
  type: z.nativeEnum(ConversationType).default(ConversationType.GROUP),
  name: z.string().trim().max(100, 'Name cannot exceed 100 characters'),
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

export const updateGroupConversationSchema = z.object({
  name: z.string().trim().max(100, 'Name cannot exceed 100 characters').optional(),
})

export const addParticipantsInGroupConversationSchema = z.object({
  participantIds: z.array(z.string().cuid()).min(1, 'At least one participant is required'),
})

export type CreateDirectConversationRequest = z.infer<typeof createDirectConversationSchema>
export type CreateGroupConversationRequest = z.infer<typeof createGroupConversationSchema> & {
  picture?: string | undefined
}
export type SearchConversationsRequest = z.infer<typeof searchConversationsSchema>
export type GetConversationsRequest = z.infer<typeof getConversationsSchema>
export type UpdateGroupConversationRequest = z.infer<typeof updateGroupConversationSchema>
