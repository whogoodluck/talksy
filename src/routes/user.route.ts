import { Router } from 'express'
import googleAuthController from '../controllers/google-auth.controller'
import userController from '../controllers/user.controller'
import passport from '../lib/passport'
import authMiddleware from '../middlewares/auth.middleware'
import { uploadSingleFileForProfilePicture } from '../middlewares/multer'
import config from '../utils/config'

const userRouter = Router()

userRouter.get(
  '/auth/google',
  passport.authenticate('google', { session: false, scope: ['profile', 'email'] })
)

userRouter.get(
  '/auth/google/callback',
  passport.authenticate('google', {
    session: false,
    failureRedirect: `${config.CLIENT_URL!}/signin?error=google_auth_failed`,
  }),
  googleAuthController.handleCallback
)

userRouter.post('/signup', userController.signUp)
userRouter.post('/signin', userController.signin)
userRouter.post('/signout', userController.signout)
userRouter.post('/verify-email', userController.vrififyEmail)
userRouter.post('/resend-email-verification-code', userController.resendEmailVerificationCode)

userRouter.post('/forgot-password', userController.forgotPassword)
userRouter.post('/verify-reset-code', userController.verifyResetCode)
userRouter.post('/reset-password', userController.resetPassword)

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
