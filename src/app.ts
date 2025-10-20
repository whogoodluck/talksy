import cookieParser from 'cookie-parser'
import cors from 'cors'
import express, { Request, Response } from 'express'
import morgan from 'morgan'

import userRouter from './routes/user.route'

import errorHandler from './middlewares/error-handler'
import unknownEndpoint from './middlewares/unknown-endpoint'

const app = express()

app.use(express.json())
app.use(morgan('tiny'))
app.use(cors())
app.use(cookieParser())

app.get('/', (_req: Request, res: Response) => {
  res.send('Hello World!')
})

app.use('/api/v1/users', userRouter)

app.use(errorHandler)
app.use(unknownEndpoint)

export default app
