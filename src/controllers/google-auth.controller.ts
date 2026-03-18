import { NextFunction, Request, Response } from 'express'
import { signToken } from '../lib/utils'
import { ExpressRequest } from '../middlewares/auth.middleware'
import JsonResponse from '../utils/json-response'

const handleCallback = (req: ExpressRequest, res: Response, next: NextFunction) => {
  try {
    const user = req.user

    if (!user) {
      return res.redirect(`${process.env.CLIENT_URL}/signin?error=google_auth_failed`)
    }

    signToken({ id: user.id, email: user.email, name: user.name }, res)

    res.redirect(`${process.env.CLIENT_URL}/`)
  } catch (err) {
    next(err)
  }
}

const getGoogleAuthStatus = (req: Request, res: Response, next: NextFunction) => {
  try {
    res.status(200).json(
      new JsonResponse({
        status: 'success',
        message: 'Google auth successful',
        data: req.user,
      })
    )
  } catch (err) {
    next(err)
  }
}

export default { handleCallback, getGoogleAuthStatus }
