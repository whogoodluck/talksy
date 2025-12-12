import { Router } from 'express'
import userController from '../controllers/user.controller'
import authMiddleware from '../middlewares/auth.middleware'

const userRouter = Router()

userRouter.post('/signup', userController.signUp)
userRouter.post('/signin', userController.signin)
userRouter.post('/signout', userController.signout)

userRouter.get('/me', authMiddleware.requireAuth, userController.validateToken)

userRouter.get('/', authMiddleware.requireAuth, userController.getAllUsers)
userRouter.get('/:username', authMiddleware.requireAuth, userController.getUserByUsername)

export default userRouter
