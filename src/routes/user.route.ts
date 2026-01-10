import { Router } from 'express'
import userController from '../controllers/user.controller'
import authMiddleware from '../middlewares/auth.middleware'
import { uploadSingleFileForProfilePicture } from '../middlewares/multer'

const userRouter = Router()

userRouter.post('/signup', userController.signUp)
userRouter.post('/signin', userController.signin)
userRouter.post('/signout', userController.signout)
userRouter.post('/verify-email', userController.vrififyEmail)
userRouter.post('/resend-email-verification-code', userController.resendEmailVerificationCode)

userRouter.get('/me', authMiddleware.requireAuth, userController.getProfile)
userRouter.put(
  '/update-profile-picture',
  authMiddleware.requireAuth,
  uploadSingleFileForProfilePicture,
  userController.updateProfilePicture
)
userRouter.put('/update-profile', authMiddleware.requireAuth, userController.updateProfile)

userRouter.get('/search', authMiddleware.requireAuth, userController.getUsersByQuery)
userRouter.get('/:username', authMiddleware.requireAuth, userController.getUserByUsername)

export default userRouter
