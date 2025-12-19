import { Server as SocketIOServer } from 'socket.io'
import authMiddleware, { SocketWithUser } from '../middlewares/auth.middleware'
import userService from '../services/user.service'
import logger from '../utils/logger'

export const initSocket = (io: SocketIOServer) => {
  io.use(authMiddleware.requireAuthForSocket)

  const onlineUsers = new Map<string, Set<string>>()
  const getOnlineUserIds = () => Array.from(onlineUsers.keys())

  io.on('connection', async (socket: SocketWithUser) => {
    const user = socket.user
    if (!user) return

    logger.info(`🟢 User connected: ${socket.id} | ${user.email}`)

    if (!onlineUsers.has(user.id)) {
      onlineUsers.set(user.id, new Set())

      await userService.updateOneById(user.id, {
        isOnline: true,
      })
    }

    onlineUsers.get(user.id)!.add(socket.id)
    io.emit('user:online', getOnlineUserIds())

    socket.on('user:online:request', () => {
      socket.emit('user:online', getOnlineUserIds())
    })

    socket.on('disconnect', async () => {
      logger.info(`🔴 User disconnected: ${socket.id} | ${user.email}`)

      const userSockets = onlineUsers.get(user.id)
      if (!userSockets) return

      userSockets.delete(socket.id)

      if (userSockets.size === 0) {
        onlineUsers.delete(user.id)

        await userService.updateOneById(user.id, {
          isOnline: false,
          lastSeen: new Date(),
        })
      }

      io.emit('user:online', getOnlineUserIds())
    })
  })
}
