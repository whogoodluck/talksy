import { z } from 'zod'

const requiredString = (fieldName: string) => z.string().trim().min(1, `${fieldName} is required`)

export const conversationNameSchema = z.object({
  name: requiredString('Name'),
})

export type ConversationNameRequest = z.infer<typeof conversationNameSchema>
