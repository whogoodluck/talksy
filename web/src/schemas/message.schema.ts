import z from 'zod'
import  { MessageEnum } from '@/types/conversation'

export const sendMessageSchema = z
  .object({
    content: z.string().min(1),
    type: z.nativeEnum(MessageEnum).default(MessageEnum.TEXT),
    fileUrl: z.string().url().optional(),
    fileName: z.string().optional(),
    fileSize: z.number().int().positive().optional(),
    replyToId: z.string().cuid().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.type === MessageEnum.TEXT && !data.content) {
      ctx.addIssue({
        path: ['content'],
        message: 'Content is required for text messages',
        code: z.ZodIssueCode.custom,
      })
    }

    if (data.type !== MessageEnum.TEXT && !data.fileUrl) {
      ctx.addIssue({
        path: ['fileUrl'],
        message: 'File URL is required for non-text messages',
        code: z.ZodIssueCode.custom,
      })
    }
  })

export const getMessagesQuerySchema = z.object({
  limit: z.string().transform(Number).pipe(z.number().int().positive().max(100)).default(50),
})

export type SendMessageRequest = z.infer<typeof sendMessageSchema>
