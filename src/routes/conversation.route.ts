import { Router } from 'express'
import conversationController from '../controllers/conversation.controller'
import authMiddleware from '../middlewares/auth.middleware'

const conversationRouter = Router()

// All routes require authentication
conversationRouter.use(authMiddleware.requireAuth)

// Conversation routes
conversationRouter.post('/', conversationController.createConversation)
conversationRouter.get('/', conversationController.getUserConversations)
conversationRouter.get('/search', conversationController.getUserConversationsByQuery)
conversationRouter.get('/:conversationId', conversationController.getUserConversationById)

// Messages routes
conversationRouter.post('/:conversationId/messages', conversationController.sendMessage)
conversationRouter.get('/:conversationId/messages', conversationController.getMessages)

export default conversationRouter
