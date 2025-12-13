import { config } from 'dotenv'

config()

const NODE_ENV = process.env.NODE_ENV

const PORT = Number(process.env.PORT) || 3002

const DATABASE_URL = process.env.DATABASE_URL
const DEV_DATABASE_URL = process.env.DEV_DATABASE_URL

const JWT_SECRET = process.env.JWT_SECRET

const SMTP_HOST = process.env.SMTP_HOST
const SMTP_PORT = Number(process.env.SMTP_PORT) || 587
const SMTP_USER = process.env.SMTP_USER
const SMTP_PASS = process.env.SMTP_PASS

const APP_NAME = process.env.APP_NAME
const SENDER_EMAIL = process.env.SENDER_EMAIL

export default {
  NODE_ENV,
  PORT,
  DATABASE_URL,
  DEV_DATABASE_URL,
  JWT_SECRET,
  SMTP_HOST,
  SMTP_PORT,
  SMTP_USER,
  SMTP_PASS,
  APP_NAME,
  SENDER_EMAIL,
}
