import { z } from 'zod'
import { requiredString } from './helper'

export const usernameSchema = requiredString('Username')
  .min(3, 'Username must be atleast 3 characters')
  .max(30, 'Username cannot exceed 30 characters')
  .regex(/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers and underscores')
  .toLowerCase()

export const signupSchema = z.object({
  email: requiredString('Email').email('Please provide a valid email address').toLowerCase(),
  name: requiredString('Name'),
  password: requiredString('Password').min(6, 'Password must be atleast 6 characters'),
})

export const signinSchema = z.object({
  email: requiredString('Email').email('Please provide a valid email address').toLowerCase(),
  password: requiredString('Password').min(6, 'Password must be atleast 6 characters'),
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

export const updateProfileSchema = z.object({
  name: requiredString('Name').max(100, 'Name must be less than 100 characters').optional(),
  username: usernameSchema.optional(),
  bio: z.string().max(500, 'Bio must be less than 500 characters').optional(),
  location: z.string().max(100, 'Location must be less than 100 characters').optional(),
})

export type SignupRequest = z.infer<typeof signupSchema>
export type SigninRequest = z.infer<typeof signinSchema>
export type VerifyEmailRequest = z.infer<typeof verifyEmailSchema>
export type ResendCodeRequest = z.infer<typeof resendCodeSchema>
export type UpdateProfileRequest = z.infer<typeof updateProfileSchema>
