import { parse } from 'cookie'
import { NextFunction, Request, Response } from 'express'
import { Socket } from 'socket.io'
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
      throw new HttpError(401, 'No auth token')
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
    next(err)
  }
}

export interface SocketWithUser extends Socket {
  user?: JWTPayload
}

const requireAuthForSocket = async (socket: SocketWithUser, next: (err?: Error) => void) => {
  try {
    const rawCookie = socket.handshake.headers.cookie

    if (!rawCookie) {
      return next(new HttpError(401, 'No cookies found'))
    }

    const cookies = parse(rawCookie)
    const token = cookies.token

    if (!token) {
      return next(new HttpError(401, 'No auth token'))
    }

    const decoded = verifyToken(token) as JWTPayload

    const user = await userService.getOneByEmail(decoded.email)

    if (!user) {
      return next(new HttpError(401, 'Invalid or expired token'))
    }

    socket.user = {
      id: user.id,
      email: user.email,
      name: user.name,
    }

    next()
  } catch (err) {
    next(new Error('Authentication error'))
  }
}

export default {
  requireAuth,
  requireAuthForSocket,
}
