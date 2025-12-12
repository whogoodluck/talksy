import cookieParser from 'cookie-parser'
import cors from 'cors'
import express, { Request, Response } from 'express'
import morgan from 'morgan'

import userRouter from './routes/user.route'

import path from 'path'
import errorHandler from './middlewares/error-handler'
import unknownEndpoint from './middlewares/unknown-endpoint'

const app = express()

app.use(express.static('dist'))
app.use(express.json())
app.use(morgan('tiny'))
app.use(cors())
app.use(cookieParser())

app.use('/api/v1/users', userRouter)

// React App
app.use(
  express.static(path.join(__dirname, '../web/dist'), {
    setHeaders(res, filePath) {
      res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin')
      res.setHeader('X-Content-Type-Options', 'nosniff')

      if (filePath.endsWith('index.html')) {
        res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate')
        res.setHeader('Pragma', 'no-cache')
        res.setHeader('Expires', '0')
      } else {
        res.setHeader('Cache-Control', 'public, max-age=31536000, immutable')
      }
    },
  })
)

app.use((req: Request, res: Response, next) => {
  if (req.path.startsWith('/api')) {
    return next()
  }

  res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin')
  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate')
  res.setHeader('X-Content-Type-Options', 'nosniff')

  res.sendFile(path.join(__dirname, '../web/dist/index.html'))
})

app.use(errorHandler)
app.use(unknownEndpoint)

export default app
