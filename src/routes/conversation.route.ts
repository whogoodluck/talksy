import { Router } from 'express'
import conversationController from '../controllers/conversation.controller'
import authMiddleware from '../middlewares/auth.middleware'

const conversationRouter = Router()

conversationRouter.use(authMiddleware.requireAuth)

conversationRouter.post('/', conversationController.createConversation)
conversationRouter.get('/', conversationController.getUserConversations)
conversationRouter.get('/search', conversationController.getUserConversationsByQuery)

export default conversationRouter
