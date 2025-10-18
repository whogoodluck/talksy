import { config } from 'dotenv'

config()

const NODE_ENV = process.env.NODE_ENV

const PORT = Number(process.env.PORT) || 3002

const DATABASE_URL = process.env.DATABASE_URL
const DEV_DATABASE_URL = process.env.DEV_DATABASE_URL

export default {
  NODE_ENV,
  PORT,
  DATABASE_URL,
  DEV_DATABASE_URL,
}
