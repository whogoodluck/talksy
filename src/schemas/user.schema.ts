import { z } from 'zod'

const requiredString = (fieldName: string) => z.string().trim().min(1, `${fieldName} is required`)

export const usernameSchema = requiredString('Username')
  .min(3, 'Username must be atleast 3 characters')
  .max(30, 'Username cannot exceed 30 characters')
  .regex(/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers and underscores')
  .toLowerCase()

export const registerSchema = z.object({
  email: requiredString('Email')
    .email('Please provide a valid email address')
    .toLowerCase()
    .default(''),
  name: requiredString('Name').default(''),
  password: requiredString('Password').min(6, 'Password must be atleast 6 characters').default(''),
})

export const loginSchema = z.object({
  email: requiredString('Email')
    .email('Please provide a valid email address')
    .toLowerCase()
    .default(''),
  password: requiredString('Password').min(6, 'Password must be atleast 6 characters').default(''),
})

type OriginalRegisterRequest = z.infer<typeof registerSchema>

export type RegisterRequest = Omit<OriginalRegisterRequest, 'password'> & {
  hashPassword: OriginalRegisterRequest['password']
  username: string
}

type OriginalLoginRequest = z.infer<typeof loginSchema>

export type LoginSchema = Omit<OriginalLoginRequest, 'password'> & {
  hashPassword: OriginalLoginRequest['password']
}
