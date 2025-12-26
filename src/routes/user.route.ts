import { Router } from 'express'
import userController from '../controllers/user.controller'
import authMiddleware from '../middlewares/auth.middleware'

const userRouter = Router()

userRouter.post('/signup', userController.signUp)
userRouter.post('/signin', userController.signin)
userRouter.post('/signout', userController.signout)
userRouter.post('/verify-email', userController.vrififyEmail)
userRouter.post('/resend-email-verification-code', userController.resendEmailVerificationCode)

userRouter.get('/me', authMiddleware.requireAuth, userController.getProfile)

userRouter.get('/search', authMiddleware.requireAuth, userController.getUsersByQuery)
userRouter.get('/:username', authMiddleware.requireAuth, userController.getUserByUsername)

export default userRouter
