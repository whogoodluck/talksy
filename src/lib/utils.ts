import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { JWTPayload } from '../middlewares/auth.middleware'
import config from '../utils/config'

export const hashPassword = async (password: string) => {
  const saltRounds = 10

  return await bcrypt.hash(password, saltRounds)
}

export const comparePassword = async (password: string, hashedPassword: string) => {
  return await bcrypt.compare(password, hashedPassword)
}

export const signToken = (data: JWTPayload) => {
  return jwt.sign(data, config.JWT_SECRET!, { expiresIn: '7d' })
}

export const verifyToken = (token: string) => {
  return jwt.verify(token, config.JWT_SECRET!)
}
