import { Server as SocketIOServer } from 'socket.io'
import authMiddleware, { SocketWithUser } from '../middlewares/auth.middleware'
import conversationService from '../services/conversation.service'
import userService from '../services/user.service'
import logger from '../utils/logger'

export const initSocket = (io: SocketIOServer) => {
  io.use(authMiddleware.requireAuthForSocket)

  const onlineUsers = new Map<string, Set<string>>()

  io.on('connection', async (socket: SocketWithUser) => {
    const user = socket.user
    if (!user) return

    logger.info(`🟢 A user connected: ${socket.id} | ${user.email}`)

    if (!onlineUsers.has(user.id)) {
      onlineUsers.set(user.id, new Set())

      await userService.updateOneById(user.id, {
        isOnline: true,
      })
    }

    onlineUsers.get(user.id)!.add(socket.id)

    const conversations = await conversationService.getUserConversations(user.id)
    const contactIds = new Set<string>()

    conversations.forEach(conversation => {
      socket.join(conversation.id)

      conversation.participants.forEach(participant => {
        if (participant.user.id !== user.id) {
          contactIds.add(participant.userId)
        }
      })
    })

    contactIds.forEach(contactId => {
      const contactSocketIds = onlineUsers.get(contactId)

      if (contactSocketIds) {
        contactSocketIds.forEach(contactSocketId => {
          socket.to(contactSocketId).emit('user:online', user.id)
        })
      }
    })

    const myOnlineContactIds = () => {
      const online: string[] = []

      contactIds.forEach(contactId => {
        if (onlineUsers.has(contactId)) {
          online.push(contactId)
        }
      })

      return online
    }

    socket.on('user:online:request', () => {
      socket.emit('user:online:response', myOnlineContactIds())
    })

    socket.on('typing:start', conversationId => {
      socket
        .to(conversationId)
        .emit('typing:start', { conversationId: conversationId, userId: user.id })
    })

    socket.on('typing:stop', conversationId => {
      socket
        .to(conversationId)
        .emit('typing:stop', { conversationId: conversationId, userId: user.id })
    })

    socket.on('disconnect', async () => {
      logger.info(`🔴 A user disconnected: ${socket.id} | ${user.email}`)

      const userSockets = onlineUsers.get(user.id)
      if (!userSockets) return

      userSockets.delete(socket.id)

      if (userSockets.size === 0) {
        onlineUsers.delete(user.id)

        await userService.updateOneById(user.id, {
          isOnline: false,
          lastSeen: new Date(),
        })

        contactIds.forEach(contactId => {
          const contactSocketIds = onlineUsers.get(contactId)

          if (contactSocketIds) {
            contactSocketIds.forEach(contactSocketId => {
              socket.to(contactSocketId).emit('user:offline', user.id)
            })
          }
        })
      }
    })
  })
}
