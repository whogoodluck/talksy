import { Router } from 'express'
import conversationRouter from './conversation.route'
import groupConversationRouter from './group-conversation.route'
import userRouter from './user.route'

const router = Router()

router.use('/users', userRouter)
router.use('/conversations', conversationRouter)
router.use('/conversations/groups', groupConversationRouter)

export default router
