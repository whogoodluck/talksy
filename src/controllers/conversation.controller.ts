import { ConversationType } from '@prisma/client'
import { NextFunction, Response } from 'express'
import { io } from '../index'
import { uploadImage } from '../lib/cloudinary'
import { ExpressRequest } from '../middlewares/auth.middleware'
import {
  createDirectConversationSchema,
  createGroupConversationSchema,
  getConversationsSchema,
  searchConversationsSchema,
} from '../schemas/conversation.schema'
import { getMessagesQuerySchema, sendMessageSchema } from '../schemas/message.schema'
import conversationService from '../services/conversation.service'
import messageService from '../services/message.service'
import { HttpError } from '../utils/http-error'
import JsonResponse from '../utils/json-response'

const createConversation = async (req: ExpressRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.id
    const body = req.body

    let conversation

    if (body.type === ConversationType.DIRECT || body.participantId) {
      const payload = createDirectConversationSchema.parse(body)

      const existDirectConversation =
        await conversationService.getDirectConversationByCurrentUserIdAndParticipantId(
          userId,
          payload.participantId
        )

      if (existDirectConversation) {
        throw new HttpError(400, 'Conversation already exists')
      }

      if (payload.participantId === userId) {
        throw new HttpError(400, 'You cannot create a conversation with yourself')
      }

      conversation = await conversationService.createDirectConversation(userId, payload)
    } else {
      const payload = createGroupConversationSchema.parse(body)

      if (payload.participantIds.includes(userId)) {
        throw new HttpError(400, 'You are automatically added to the conversation')
      }

      conversation = await conversationService.createGroupConversation(userId, payload)
    }

    res.status(201).json(
      new JsonResponse({
        status: 'success',
        message: 'Conversation created successfully!',
        data: conversation,
      })
    )
  } catch (err) {
    next(err)
  }
}

const getUserConversations = async (req: ExpressRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.id
    const payload = getConversationsSchema.parse(req.query)

    const conversations = await conversationService.getUserConversations(userId, payload)

    res.status(200).json(
      new JsonResponse({
        status: 'success',
        message: 'Conversations fetched successfully!',
        data: { total: conversations.length, conversations },
      })
    )
  } catch (err) {
    next(err)
  }
}

const getUserConversationsByQuery = async (
  req: ExpressRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const payload = searchConversationsSchema.parse(req.query)
    const userId = req.user!.id

    const result = await conversationService.getUserConversationsByQuery(userId, payload)

    res.status(200).json(
      new JsonResponse({
        status: 'success',
        message: 'Conversations fetched successfully!',
        data: { total: result.length, conversations: result },
      })
    )
  } catch (err) {
    next(err)
  }
}

const getUserConversationById = async (req: ExpressRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.id
    const { conversationId } = req.params

    const conversation = await conversationService.getUserConversationById(userId, conversationId)

    if (!conversation) {
      throw new HttpError(404, 'Conversation not found')
    }

    res.status(200).json(
      new JsonResponse({
        status: 'success',
        message: 'Conversation fetched successfully!',
        data: conversation,
      })
    )
  } catch (err) {
    next(err)
  }
}

const sendMessage = async (req: ExpressRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.id
    const { conversationId } = req.params
    const payload = sendMessageSchema.parse(req.body)
    const file = req.file

    if (file) {
      const res = await uploadImage(file)
      payload.fileUrl = res.url
    }

    const conversation = await conversationService.getUserConversationById(userId, conversationId)

    if (!conversation) {
      throw new HttpError(404, 'Conversation not found')
    }

    const message = await messageService.sendMessage(conversationId, userId, payload)

    io.to(conversationId).emit('message:new', message)

    res.status(201).json(
      new JsonResponse({
        status: 'success',
        message: 'Message sent successfully!',
        data: message,
      })
    )
  } catch (err) {
    next(err)
  }
}

const getMessages = async (req: ExpressRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.id
    const { conversationId } = req.params
    const payload = getMessagesQuerySchema.parse(req.query)

    const conversation = await conversationService.getUserConversationById(userId, conversationId)

    if (!conversation) {
      throw new HttpError(404, 'Conversation not found')
    }

    const messages = await messageService.getMessages(conversationId, payload.limit)

    await messageService.updateLastRead(conversationId, userId)

    res.status(200).json(
      new JsonResponse({
        status: 'success',
        message: 'Messages fetched successfully!',
        data: {
          total: messages.length,
          messages,
        },
      })
    )
  } catch (err) {
    next(err)
  }
}

export default {
  createConversation,
  getUserConversations,
  getUserConversationsByQuery,
  getUserConversationById,
  sendMessage,
  getMessages,
}
