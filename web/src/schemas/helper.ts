import z from 'zod'

export const requiredString = (fieldName: string) =>
  z.string().trim().min(1, `${fieldName} is required`)

export const file = () =>
  z
    .instanceof(File, { message: 'File must be a file' })
    .refine(file => file.size <= 5 * 1024 * 1024, {
      message: 'File size must be less than 5MB',
    })
