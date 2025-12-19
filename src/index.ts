import http from 'http'
import { Server as SocketIOServer } from 'socket.io'
import app from './app'
import { initSocket } from './socket'
import config from './utils/config'
import logger from './utils/logger'

const server = http.createServer(app)

const io = new SocketIOServer(server, {
  cors: {
    origin: 'http://localhost:5173',
    credentials: true,
  },
})

initSocket(io)

server.listen(config.PORT, () => {
  logger.info(`🚀 Server running at http://localhost:${config.PORT}`)
})

export { io }
