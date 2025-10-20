import { Router } from 'express'
import userController from '../controllers/user.controller'
import authMiddleware from '../middlewares/auth.middleware'

const userRouter = Router()

userRouter.post('/signup', userController.signUp)
userRouter.post('/login', userController.login)
userRouter.post('/logout', userController.logout)

userRouter.get('/', authMiddleware.requireAuth, userController.getAllUsers)
userRouter.get('/:username', authMiddleware.requireAuth, userController.getUserByUsername)

export default userRouter
