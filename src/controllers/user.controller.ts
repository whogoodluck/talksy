import { VerificationType } from '@prisma/client'
import { NextFunction, Request, Response } from 'express'
import { comparePassword, hashPassword, signToken } from '../lib/utils'
import { ExpressRequest } from '../middlewares/auth.middleware'
import {
  resendCodeSchema,
  searchUsersSchema,
  signinSchema,
  signupSchema,
  usernameSchema,
  verifyEmailSchema,
} from '../schemas/user.schema'
import emailService from '../services/email.service'
import userService from '../services/user.service'
import verificationService from '../services/verification.service'
import { HttpError } from '../utils/http-error'
import JsonResponse from '../utils/json-response'

const signUp = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const payload = signupSchema.parse(req.body)

    let user = await userService.getOneByEmail(payload.email)

    if (user && user.isEmailVerified) {
      throw new HttpError(409, 'Email already in use')
    }

    const hashedPassword = await hashPassword(payload.password)

    const username = await userService.generateUniqueUsernameFromEmail(payload.email)

    if (!user) {
      user = await userService.createNew({
        email: payload.email,
        hashPassword: hashedPassword,
        name: payload.name,
        username,
      })
    } else {
      user = await userService.updateOneById(user.id, {
        email: payload.email,
        hashPassword: hashedPassword,
        name: payload.name,
        username,
      })
    }

    const verificationCode = await verificationService.createVerificationCode(
      user.id,
      VerificationType.EMAIL_VERIFICATION
    )

    await emailService.sendVerificationEmail(user.email, verificationCode.code, user.name)

    res.status(201).json(
      new JsonResponse({
        status: 'success',
        message: 'Account created successfully. Please check your email for verification code.',
        data: {
          email: user.email,
        },
      })
    )
  } catch (err) {
    next(err)
  }
}

const vrififyEmail = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const payload = verifyEmailSchema.parse(req.body)

    const user = await userService.getOneByEmail(payload.email)

    if (!user) {
      throw new HttpError(404, 'User not found')
    }

    if (user.isEmailVerified) {
      throw new HttpError(400, 'Email already verified')
    }

    const verificationCode = await verificationService.verifyCode(
      user.id,
      payload.code,
      VerificationType.EMAIL_VERIFICATION
    )

    if (!verificationCode) {
      throw new HttpError(400, 'Invalid or expired verification code')
    }

    const updatedUser = await userService.verifyUserEmail(verificationCode.userId)

    await emailService.sendWelcomeEmail(updatedUser.email, updatedUser.name)

    signToken(
      {
        id: updatedUser.id,
        email: updatedUser.email,
        name: updatedUser.name,
      },
      res
    )

    res.status(200).json(
      new JsonResponse({
        status: 'success',
        message: 'Email verified successfully',
        data: updatedUser,
      })
    )
  } catch (err) {
    next(err)
  }
}

const resendEmailVerificationCode = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const payload = resendCodeSchema.parse(req.body)

    const user = await userService.getOneByEmail(payload.email)

    if (!user) {
      throw new HttpError(404, 'User not found')
    }

    if (user.isEmailVerified) {
      throw new HttpError(400, 'Email is already verified')
    }

    const verificationCode = await verificationService.createVerificationCode(
      user.id,
      VerificationType.EMAIL_VERIFICATION
    )
    await emailService.sendVerificationEmail(user.email, verificationCode.code, user.name)

    res.status(200).json(
      new JsonResponse({
        status: 'success',
        message: 'Verification code sent successfully!',
      })
    )
  } catch (err) {
    next(err)
  }
}

const signin = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const payload = signinSchema.parse(req.body)

    const user = await userService.getOneByEmailForLogin(payload.email)

    if (!user) {
      throw new HttpError(401, 'This email does not exist')
    }

    if (!user.isEmailVerified) {
      throw new HttpError(403, 'Please verify your email before signing in')
    }

    if (!user.hashPassword) {
      throw new HttpError(401, 'This user does not have a password')
    }

    const isValidPassword = await comparePassword(payload.password, user.hashPassword)

    if (!isValidPassword) {
      throw new HttpError(401, 'Invalid email or password')
    }

    signToken(
      {
        id: user.id,
        email: user.email,
        name: user.name,
      },
      res
    )

    const { hashPassword: _, ...userWithoutPassword } = user

    res.status(200).json(
      new JsonResponse({
        status: 'success',
        message: 'User logged in successfully',
        data: userWithoutPassword,
      })
    )
  } catch (err) {
    next(err)
  }
}

const signout = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    res.clearCookie('token')

    res.status(200).json(
      new JsonResponse({
        status: 'success',
        message: 'User logged out successfully',
      })
    )
  } catch (err) {
    next(err)
  }
}

async function getProfile(req: ExpressRequest, res: Response, next: NextFunction) {
  try {
    const user = await userService.getOneById(req.user!.id)

    if (!user) {
      throw new HttpError(401, 'Invalid or expired token')
    }

    // const updatedUser = await userService.updateOneById(user.id, {
    //   isOnline: true,
    //   lastSeen: new Date(),
    // })

    res.status(200).json(
      new JsonResponse({
        status: 'success',
        message: 'User validated successfully',
        data: user,
      })
    )
  } catch (err) {
    next(err)
  }
}

const getUsersByQuery = async (req: ExpressRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.id
    const payload = searchUsersSchema.parse(req.query)

    const users = await userService.searchUsers(payload, userId)

    res.status(200).json(
      new JsonResponse({
        status: 'success',
        message: 'Users fetched successfully!',
        data: {
          total: users.length,
          users,
        },
      })
    )
  } catch (err) {
    next(err)
  }
}

const getUserByUsername = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const username = usernameSchema.parse(req.params.username)

    const user = await userService.getOneByUsername(username)

    if (!user) {
      throw new HttpError(404, 'User not found')
    }

    res.status(200).json(
      new JsonResponse({
        status: 'success',
        message: 'User fetched successfully',
        data: user,
      })
    )
  } catch (err) {
    next(err)
  }
}

export default {
  signUp,
  vrififyEmail,
  resendEmailVerificationCode,
  signin,
  signout,
  getProfile,
  getUsersByQuery,
  getUserByUsername,
}
