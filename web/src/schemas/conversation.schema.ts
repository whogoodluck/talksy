import { ConversationEnum } from '@/types/conversation'
import { z } from 'zod'
import { file, requiredString } from './helper'

export const createDirectConversationSchema = z.object({
  type: z.literal(ConversationEnum.DIRECT),
  participantId: z.string().cuid(),
})

export const createGroupConversationSchema = z.object({
  type: z.literal(ConversationEnum.GROUP),
  participantIds: z.array(z.string().cuid()).min(1, 'At least one participant is required'),
  name: requiredString('Group name').max(100, 'Group name cannot exceed 100 characters'),
  picture: file().optional(),
})

export const createConversationSchema = z.discriminatedUnion('type', [
  createDirectConversationSchema,
  createGroupConversationSchema,
])

export const updateGroupConversationSchema = z.object({
  name: requiredString('Group name').max(100, 'Group name cannot exceed 100 characters').optional(),
  picture: file().optional(),
})

export const addParticipantsInGroupConversationSchema = z.object({
  participantIds: z.array(z.string().cuid()).min(1, 'At least one participant is required'),
})

export type CreateDirectConversationRequest = z.infer<typeof createDirectConversationSchema>
export type CreateGroupGroupConversationRequest = z.infer<typeof createGroupConversationSchema>
export type CreateConversationRequest = z.infer<typeof createConversationSchema>
export type UpdateConversationRequest = z.infer<typeof updateGroupConversationSchema>
export type AddParticipantsInGroupConversationRequest = z.infer<
  typeof addParticipantsInGroupConversationSchema
>
