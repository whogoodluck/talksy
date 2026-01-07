import { Router } from 'express'
import conversationController from '../controllers/conversation.controller'
import authMiddleware from '../middlewares/auth.middleware'
import { uploadSingleFileForGroupPicture, uploadSingleFileForMessage } from '../middlewares/multer'

const conversationRouter = Router()

// All routes require authentication
conversationRouter.use(authMiddleware.requireAuth)

// Conversation routes
conversationRouter.post('/', conversationController.createConversation)
conversationRouter.get('/', conversationController.getUserConversations)
conversationRouter.get('/search', conversationController.getUserConversationsByQuery)
conversationRouter.get('/:conversationId', conversationController.getConversationInfo)

// Group routes
conversationRouter.put('/:conversationId', conversationController.updateGroupInfo)
conversationRouter.put(
  '/:conversationId/picture',
  uploadSingleFileForGroupPicture,
  conversationController.updateGroupPicture
)
conversationRouter.post('/:conversationId/participants/add', conversationController.addParticipants)
conversationRouter.delete(
  '/:conversationId/participants/:participantId',
  conversationController.removeParticipant
)
conversationRouter.post(
  '/:conversationId/participants/:participantId/make-admin',
  conversationController.makeParticipantAdmin
)
conversationRouter.post(
  '/:conversationId/participants/:participantId/remove-from-admin',
  conversationController.removeParticipantFromAdmin
)
conversationRouter.post('/:conversationId/leave', conversationController.leaveGroup)
conversationRouter.delete('/:conversationId', conversationController.deleteGroup)

// Messages routes
conversationRouter.post(
  '/:conversationId/messages',
  uploadSingleFileForMessage,
  conversationController.sendMessage
)
conversationRouter.get('/:conversationId/messages', conversationController.getMessages)
conversationRouter.post(
  '/:conversationId/messages/:messageId/read',
  conversationController.markAsRead
)

export default conversationRouter
