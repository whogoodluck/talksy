import { config } from 'dotenv'

config()

const NODE_ENV = process.env.NODE_ENV

const PORT = Number(process.env.PORT) || 3002

const DATABASE_URL = process.env.DATABASE_URL
const DEV_DATABASE_URL = process.env.DEV_DATABASE_URL

const JWT_SECRET = process.env.JWT_SECRET

const BREVO_API_KEY = process.env.BREVO_API_KEY

const APP_NAME = process.env.APP_NAME
const SENDER_EMAIL = process.env.SENDER_EMAIL

const CLOUDINARY_CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME
const CLOUDINARY_API_KEY = process.env.CLOUDINARY_API_KEY
const CLOUDINARY_API_SECRET = process.env.CLOUDINARY_API_SECRET

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET
const GOOGLE_CALLBACK_URL =
  process.env.GOOGLE_CALLBACK_URL || `http://localhost:${PORT}/api/v1/users/auth/google/callback`
const CLIENT_URL = process.env.CLIENT_URL

export default {
  NODE_ENV,
  PORT,
  DATABASE_URL,
  DEV_DATABASE_URL,
  JWT_SECRET,
  BREVO_API_KEY,
  APP_NAME,
  SENDER_EMAIL,
  CLOUDINARY_CLOUD_NAME,
  CLOUDINARY_API_KEY,
  CLOUDINARY_API_SECRET,
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  GOOGLE_CALLBACK_URL,
  CLIENT_URL,
}
