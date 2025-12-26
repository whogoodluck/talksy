import { config } from 'dotenv'

config()

const NODE_ENV = process.env.NODE_ENV

const PORT = Number(process.env.PORT) || 3002

const DATABASE_URL = process.env.DATABASE_URL
const DEV_DATABASE_URL = process.env.DEV_DATABASE_URL

const JWT_SECRET = process.env.JWT_SECRET

const BREVO_USER = process.env.BREVO_USER
const BREVO_SMTP_KEY = process.env.BREVO_SMTP_KEY

const APP_NAME = process.env.APP_NAME
const SENDER_EMAIL = process.env.SENDER_EMAIL

export default {
  NODE_ENV,
  PORT,
  DATABASE_URL,
  DEV_DATABASE_URL,
  JWT_SECRET,
  BREVO_USER,
  BREVO_SMTP_KEY,
  APP_NAME,
  SENDER_EMAIL,
}
