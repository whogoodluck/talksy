import { Router } from 'express'
import groupConversationController from '../controllers/group-conversation.controller'
import authMiddleware from '../middlewares/auth.middleware'
import { uploadSingleFileForGroupPicture } from '../middlewares/multer'

const groupConversationRouter = Router()

groupConversationRouter.use(authMiddleware.requireAuth)

groupConversationRouter.get('/:conversationId', groupConversationController.getConversationInfo)
groupConversationRouter.put('/:conversationId', groupConversationController.updateGroupInfo)
groupConversationRouter.put(
  '/:conversationId/picture',
  uploadSingleFileForGroupPicture,
  groupConversationController.updateGroupPicture
)
groupConversationRouter.post(
  '/:conversationId/participants/add',
  groupConversationController.addParticipants
)
groupConversationRouter.delete(
  '/:conversationId/participants/:participantId',
  groupConversationController.removeParticipant
)
groupConversationRouter.post(
  '/:conversationId/participants/:participantId/make-admin',
  groupConversationController.makeParticipantAdmin
)
groupConversationRouter.post(
  '/:conversationId/participants/:participantId/remove-from-admin',
  groupConversationController.removeParticipantFromAdmin
)
groupConversationRouter.post('/:conversationId/leave', groupConversationController.leaveGroup)
groupConversationRouter.delete('/:conversationId', groupConversationController.deleteGroup)

export default groupConversationRouter
