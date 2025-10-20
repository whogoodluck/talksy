import { NextFunction, Request, Response } from 'express'
import { comparePassword, hashPassword, signToken } from '../lib/utils'
import { ExpressRequest } from '../middlewares/auth.middleware'
import { loginSchema, registerSchema, usernameSchema } from '../schemas/user.schema'
import userService from '../services/user.service'
import config from '../utils/config'
import { HttpError } from '../utils/http-error'
import JsonResponse from '../utils/json-response'

const signUp = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const payload = registerSchema.parse(req.body)

    const isUserExist = await userService.getOneByEmail(payload.email)

    if (isUserExist) {
      throw new HttpError(400, 'Email already in use')
    }

    const hashedPassword = await hashPassword(payload.password)

    const username = usernameSchema.parse(payload.email.split('@')[0])

    const user = await userService.createNew({
      email: payload.email,
      hashPassword: hashedPassword,
      name: payload.name,
      username,
    })

    const token = signToken({ id: user.id, email: user.email, name: user.name })

    res.cookie('token', token, {
      httpOnly: true,
      secure: config.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    })

    res.status(201).json(
      new JsonResponse({
        status: 'success',
        message: 'User signed up successfully!',
        data: user,
      })
    )
  } catch (err) {
    next(err)
  }
}

const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = loginSchema.parse(req.body)

    const user = await userService.getOneByEmail(email)

    if (!user) {
      throw new HttpError(401, 'This email does not exist')
    }

    if (!user.hashPassword) {
      throw new HttpError(401, 'This user does not have a password')
    }

    const isValidPassword = await comparePassword(password, user.hashPassword)

    if (!isValidPassword) {
      throw new HttpError(401, 'Invalid email or password')
    }

    const token = signToken({
      id: user.id,
      email: user.email,
      name: user.name,
    })

    const { hashPassword: _, ...userWithoutPassword } = user

    res.cookie('token', token, {
      httpOnly: true,
      secure: config.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    })

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

const logout = async (_req: Request, res: Response, next: NextFunction) => {
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

const getAllUsers = async (_req: ExpressRequest, res: Response, next: NextFunction) => {
  try {
    const users = await userService.getAll()

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
  login,
  logout,
  getAllUsers,
  getUserByUsername,
}
