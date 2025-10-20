import { NextFunction, Request, Response } from 'express'
import { verifyToken } from '../lib/utils'
import userService from '../services/user.service'
import { HttpError } from '../utils/http-error'

export interface JWTPayload {
  id: string
  email: string
  name: string
}

export interface ExpressRequest extends Request {
  user?: JWTPayload
}

const requireAuth = async (req: ExpressRequest, _res: Response, next: NextFunction) => {
  try {
    const token = req.cookies.token

    if (!token) {
      throw new HttpError(401, 'No token provided')
    }

    const decoded = verifyToken(token) as JWTPayload

    const user = await userService.getOneByEmail(decoded.email)

    if (!user) {
      throw new HttpError(401, 'Invalid or expired token')
    }

    req.user = {
      id: user.id,
      email: user.email,
      name: user.name,
    }

    next()
  } catch (err) {
    console.log('require auth', err)
    next(err)
  }
}

export default {
  requireAuth,
}
