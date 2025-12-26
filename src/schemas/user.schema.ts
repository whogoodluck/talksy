import { z } from 'zod'
import { requiredString } from './helper'

export const usernameSchema = requiredString('Username')
  .min(3, 'Username must be atleast 3 characters')
  .max(30, 'Username cannot exceed 30 characters')
  .regex(/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers and underscores')
  .toLowerCase()

export const signupSchema = z.object({
  email: requiredString('Email')
    .email('Please provide a valid email address')
    .toLowerCase()
    .default(''),
  name: requiredString('Name').default(''),
  password: requiredString('Password').min(6, 'Password must be atleast 6 characters').default(''),
})

export const signinSchema = z.object({
  email: requiredString('Email')
    .email('Please provide a valid email address')
    .toLowerCase()
    .default(''),
  password: requiredString('Password').min(6, 'Password must be atleast 6 characters').default(''),
})

export const verifyEmailSchema = z.object({
  email: requiredString('Email').email('Please provide a valid email address'),
  code: requiredString('code')
    .length(6, 'Code must be 6 digits')
    .regex(/^\d+$/, 'Code must contain only numbers'),
})

export const resendCodeSchema = z.object({
  email: requiredString('Email').email('Please provide a valid email address'),
})

type OriginalSignupRequest = z.infer<typeof signupSchema>

export type SignupRequest = Omit<OriginalSignupRequest, 'password'> & {
  hashPassword: OriginalSignupRequest['password']
  username: string
}

export const searchUsersSchema = z.object({
  q: z.string().trim().max(50, 'Query cannot exceed 50 characters').optional(),
})

type OriginalSigninRequest = z.infer<typeof signinSchema>

export type SigninRequest = Omit<OriginalSigninRequest, 'password'> & {
  hashPassword: OriginalSigninRequest['password']
}

export type VerifyEmailRequest = z.infer<typeof verifyEmailSchema>

export type ResendCodeRequest = z.infer<typeof resendCodeSchema>

export type SearchUsersRequest = z.infer<typeof searchUsersSchema>
