import { MessageEnum } from '@/types/conversation'
import z from 'zod'

export const file = () =>
  z
    .instanceof(File, { message: 'File must be a file' })
    .refine(file => file.size <= 5 * 1024 * 1024, {
      message: 'File size must be less than 5MB',
    })

export const sendMessageSchema = z
  .object({
    content: z.string().optional(),
    type: z.nativeEnum(MessageEnum).default(MessageEnum.TEXT).optional(),
    file: file().optional(),
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

    if (data.type !== MessageEnum.TEXT && !data.file) {
      ctx.addIssue({
        path: ['file'],
        message: 'File is required for non-text messages',
        code: z.ZodIssueCode.custom,
      })
    }
  })

export const getMessagesQuerySchema = z.object({
  limit: z.string().transform(Number).pipe(z.number().int().positive().max(100)).default(50),
})

export type SendMessageRequest = z.infer<typeof sendMessageSchema>
