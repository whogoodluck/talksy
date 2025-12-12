import { z } from 'zod'

const requiredString = (fieldName: string) => z.string().trim().min(1, `${fieldName} is required`)

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

type OriginalSignupRequest = z.infer<typeof signupSchema>

export type SignupRequest = Omit<OriginalSignupRequest, 'password'> & {
  hashPassword: OriginalSignupRequest['password']
  username: string
}

type OriginalSigninRequest = z.infer<typeof signinSchema>

export type SigninRequest = Omit<OriginalSigninRequest, 'password'> & {
  hashPassword: OriginalSigninRequest['password']
}
