import { Router } from 'express'
import conversationRouter from './conversation.route'
import userRouter from './user.route'

const router = Router()

router.use('/users', userRouter)
router.use('/conversations', conversationRouter)

export default router
