import { Router } from 'express'
import emailService from '../services/email.service'
import conversationRouter from './conversation.route'
import groupConversationRouter from './group-conversation.route'
import userRouter from './user.route'

const router = Router()

router.get('/brevo-test', async (req, res) => {
  try {
    await emailService.sendVerificationEmail('hejaki8753@jparksky.com', '123456', 'John Doe')
    res.send('Brevo OK')
  } catch (e: any) {
    console.error('route', e)
    res.status(500).json(e.response?.data || e.message)
  }
})

router.use('/users', userRouter)
router.use('/conversations', conversationRouter)
router.use('/conversations/groups', groupConversationRouter)

export default router
