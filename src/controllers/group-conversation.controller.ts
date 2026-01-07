import { ConversationType, ParticipantRole } from '@prisma/client'
import { NextFunction, Response } from 'express'
import { io } from '../index'
import { deleteImage, getPublicIdFromUrl, uploadImage } from '../lib/cloudinary'
import { ExpressRequest } from '../middlewares/auth.middleware'
import {
  addParticipantsInGroupConversationSchema,
  updateGroupConversationSchema,
} from '../schemas/conversation.schema'
import conversationService from '../services/conversation.service'
import { HttpError } from '../utils/http-error'
import JsonResponse from '../utils/json-response'

const getConversationInfo = async (req: ExpressRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.id
    const { conversationId } = req.params

    const conversation = await conversationService.getUserConversationById(userId, conversationId)

    if (!conversation) {
      throw new HttpError(404, 'Conversation not found')
    }

    if (conversation.type !== ConversationType.GROUP) {
      throw new HttpError(400, 'This conversation is not a group conversation')
    }

    res.status(200).json(
      new JsonResponse({
        status: 'success',
        message: 'Conversation info fetched successfully!',
        data: conversation,
      })
    )
  } catch (err) {
    next(err)
  }
}

const updateGroupInfo = async (req: ExpressRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.id
    const { conversationId } = req.params
    const payload = updateGroupConversationSchema.parse(req.body)

    const conversation = await conversationService.getUserConversationById(userId, conversationId)

    if (!conversation) {
      throw new HttpError(404, 'Conversation not found')
    }

    if (conversation.type !== ConversationType.GROUP) {
      throw new HttpError(400, 'This conversation is not a group conversation')
    }

    const participant = conversation.participants.find(p => p.userId === userId)
    const isCreator = participant?.role === ParticipantRole.CREATOR
    const isAdmin = isCreator || participant?.role === ParticipantRole.ADMIN

    if (!isAdmin) {
      throw new HttpError(403, 'Only group owner and admins can update group info')
    }

    const updatedConversation = await conversationService.updateGroupInfo(conversationId, payload)

    io.to(conversationId).emit('group-conversation-info:updated', updatedConversation)

    res.status(200).json(
      new JsonResponse({
        status: 'success',
        message: 'Group info updated successfully!',
        data: updatedConversation,
      })
    )
  } catch (err) {
    next(err)
  }
}

const updateGroupPicture = async (req: ExpressRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.id
    const { conversationId } = req.params
    const file = req.file

    if (!file) {
      throw new HttpError(400, 'Picture not uploaded')
    }

    const conversation = await conversationService.getUserConversationById(userId, conversationId)

    if (!conversation) {
      throw new HttpError(404, 'Conversation not found')
    }

    if (conversation.type !== ConversationType.GROUP) {
      throw new HttpError(400, 'This conversation is not a group conversation')
    }

    const participant = conversation.participants.find(p => p.userId === userId)
    const isAdmin =
      participant?.role === ParticipantRole.CREATOR || participant?.role === ParticipantRole.ADMIN

    if (!isAdmin) {
      throw new HttpError(403, 'Only group owner and admins can update group picture')
    }

    const uploadResult = await uploadImage(file)

    const updatedConversation = await conversationService.updateGroupPicture(
      conversationId,
      uploadResult.secure_url
    )

    if (conversation.picture) {
      const publicId = getPublicIdFromUrl(conversation.picture)
      await deleteImage(publicId)
    }

    io.to(conversationId).emit('group-conversation-info:updated', updatedConversation)

    res.status(200).json(
      new JsonResponse({
        status: 'success',
        message: 'Group picture updated successfully!',
      })
    )
  } catch (err) {
    next(err)
  }
}

const addParticipants = async (req: ExpressRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.id
    const { conversationId } = req.params
    const payload = addParticipantsInGroupConversationSchema.parse(req.body)

    const conversation = await conversationService.getUserConversationById(userId, conversationId)

    if (!conversation) {
      throw new HttpError(404, 'Conversation not found')
    }

    if (conversation.type !== ConversationType.GROUP) {
      throw new HttpError(400, 'This conversation is not a group conversation')
    }

    const currentUser = conversation.participants.find(p => p.userId === userId)
    const isCreator = currentUser?.role === ParticipantRole.CREATOR
    const isAdmin = isCreator || currentUser?.role === ParticipantRole.ADMIN

    if (!isAdmin) {
      throw new HttpError(403, 'Only group owner and admins can add participants')
    }

    payload.participantIds.forEach(async participantUserId => {
      const participant = await conversationService.getParticipantByConversationIdAndParticipantId(
        conversationId,
        participantUserId
      )

      if (!participant) {
        await conversationService.addParticipant(conversationId, participantUserId)
      }

      await conversationService.addParticipantAgain(conversationId, participantUserId)

      io.to(participantUserId).emit('conversation:participants:updated', { conversationId })
    })

    io.to(conversationId).emit('conversation:participants:updated', { conversationId })

    res.status(200).json(
      new JsonResponse({
        status: 'success',
        message: 'Participants added successfully!',
      })
    )
  } catch (err) {
    next(err)
  }
}

const removeParticipant = async (req: ExpressRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.id
    const { conversationId, participantId } = req.params

    const conversation = await conversationService.getUserConversationById(userId, conversationId)

    if (!conversation) {
      throw new HttpError(404, 'Conversation not found')
    }

    if (conversation.type !== ConversationType.GROUP) {
      throw new HttpError(400, 'This conversation is not a group conversation')
    }

    const currentUser = conversation.participants.find(p => p.userId === userId)
    const isCreator = currentUser?.role === ParticipantRole.CREATOR
    const isAdmin = isCreator || currentUser?.role === ParticipantRole.ADMIN

    if (!isAdmin) {
      throw new HttpError(403, 'Only group owner and admins can remove participants')
    }

    if (participantId === userId) {
      throw new HttpError(400, 'You cannot remove yourself')
    }

    const participant = await conversationService.getParticipantByConversationIdAndParticipantId(
      conversationId,
      participantId
    )

    if (!participant) {
      throw new HttpError(404, 'Participant not found')
    }

    if (participant.role === ParticipantRole.CREATOR) {
      throw new HttpError(400, 'You cannot remove the creator')
    }

    await conversationService.removeParticipant(conversationId, participantId)

    io.to(conversationId).emit('conversation:participants:updated', { conversationId })

    res.status(200).json(
      new JsonResponse({
        status: 'success',
        message: 'Participant removed successfully!',
      })
    )
  } catch (err) {
    next(err)
  }
}

const makeParticipantAdmin = async (req: ExpressRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.id
    const { conversationId, participantId } = req.params

    const conversation = await conversationService.getUserConversationById(userId, conversationId)

    if (!conversation) {
      throw new HttpError(404, 'Conversation not found')
    }

    if (conversation.type !== ConversationType.GROUP) {
      throw new HttpError(400, 'This conversation is not a group conversation')
    }

    const currentUser = conversation.participants.find(p => p.userId === userId)
    const isCreator = currentUser?.role === ParticipantRole.CREATOR
    const isAdmin = isCreator || currentUser?.role === ParticipantRole.ADMIN

    if (!isAdmin) {
      throw new HttpError(403, 'Only group owner and admins can make participant admin')
    }

    if (participantId === userId) {
      throw new HttpError(400, 'You cannot make yourself admin')
    }

    const participant = await conversationService.getParticipantByConversationIdAndParticipantId(
      conversationId,
      participantId
    )

    if (!participant) {
      throw new HttpError(404, 'Participant not found')
    }

    if (participant.role === ParticipantRole.CREATOR) {
      throw new HttpError(400, 'You cannot make the creator admin')
    }

    await conversationService.makeAdmin(conversationId, participantId)

    io.to(conversationId).emit('conversation:participants:updated', { conversationId })

    res.status(200).json(
      new JsonResponse({
        status: 'success',
        message: 'Participant made admin successfully!',
      })
    )
  } catch (err) {
    next(err)
  }
}

const removeParticipantFromAdmin = async (
  req: ExpressRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user!.id
    const { conversationId, participantId } = req.params

    const conversation = await conversationService.getUserConversationById(userId, conversationId)

    if (!conversation) {
      throw new HttpError(404, 'Conversation not found')
    }

    if (conversation.type !== ConversationType.GROUP) {
      throw new HttpError(400, 'This conversation is not a group conversation')
    }

    const currentUser = conversation.participants.find(p => p.userId === userId)
    const isCreator = currentUser?.role === ParticipantRole.CREATOR
    const isAdmin = isCreator || currentUser?.role === ParticipantRole.ADMIN

    if (!isAdmin) {
      throw new HttpError(403, 'Only group owner and admins can remove participant from admin')
    }

    if (participantId === userId) {
      throw new HttpError(400, 'You cannot remove yourself from admin')
    }

    const participant = await conversationService.getParticipantByConversationIdAndParticipantId(
      conversationId,
      participantId
    )

    if (!participant) {
      throw new HttpError(404, 'Participant not found')
    }

    if (participant.role !== ParticipantRole.ADMIN) {
      throw new HttpError(400, 'Participant is not an admin')
    }

    await conversationService.makeAdminToMember(conversationId, participant.userId)

    io.to(conversationId).emit('conversation:participants:updated', { conversationId })

    res.status(200).json(
      new JsonResponse({
        status: 'success',
        message: 'Participant removed from admin successfully!',
      })
    )
  } catch (err) {
    next(err)
  }
}

const leaveGroup = async (req: ExpressRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.id
    const { conversationId } = req.params

    const conversation = await conversationService.getUserConversationById(userId, conversationId)

    if (!conversation) {
      throw new HttpError(404, 'Conversation not found')
    }

    if (conversation.type !== ConversationType.GROUP) {
      throw new HttpError(400, 'This conversation is not a group conversation')
    }

    const otherParticipants = conversation.participants.filter(p => p.userId !== userId)

    if (otherParticipants.length === 0) {
      await conversationService.deleteConversation(conversationId)
    } else if (otherParticipants.length === 1) {
      if (otherParticipants[0].role === ParticipantRole.MEMBER) {
        await conversationService.makeAdmin(conversationId, otherParticipants[0].userId)
      }

      await conversationService.removeParticipant(conversationId, userId)
    } else {
      const participant = await conversationService.getParticipantByConversationIdAndParticipantId(
        conversationId,
        userId
      )

      if (!participant) {
        throw new HttpError(404, 'Participant not found')
      }

      if (
        (participant.role === ParticipantRole.CREATOR ||
          participant.role === ParticipantRole.ADMIN) &&
        otherParticipants.every(p => p.role === ParticipantRole.MEMBER)
      ) {
        await conversationService.makeAdmin(conversationId, otherParticipants[0].userId)
      }

      await conversationService.removeParticipant(conversationId, userId)
    }

    io.to(conversationId).emit('conversation:participants:updated', { conversationId })

    res.status(200).json(
      new JsonResponse({
        status: 'success',
        message: 'Left group successfully!',
      })
    )
  } catch (err) {
    next(err)
  }
}

const deleteGroup = async (req: ExpressRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.id
    const { conversationId } = req.params

    const conversation = await conversationService.getUserConversationById(userId, conversationId)

    if (!conversation) {
      throw new HttpError(404, 'Conversation not found')
    }

    if (conversation.type !== ConversationType.GROUP) {
      throw new HttpError(400, 'This conversation is not a group conversation')
    }

    const otherParticipants = conversation.participants.filter(p => p.userId !== userId)

    let conversationDeleted = false

    // Case 1: no other participants → delete conversation
    if (otherParticipants.length === 0) {
      await conversationService.deleteConversation(conversationId)
      conversationDeleted = true
    }

    // Case 2: one other participant → transfer admin & leave
    else if (otherParticipants.length === 1) {
      if (otherParticipants[0].role === ParticipantRole.MEMBER) {
        await conversationService.makeAdmin(conversationId, otherParticipants[0].userId)
      }
      await conversationService.deleteConversationParticipant(conversationId, userId)
    }

    // Case 3: more than two participants
    else {
      const participant = await conversationService.getParticipantByConversationIdAndParticipantId(
        conversationId,
        userId
      )

      if (!participant) {
        throw new HttpError(404, 'Participant not found')
      }

      if (
        (participant.role === ParticipantRole.CREATOR ||
          participant.role === ParticipantRole.ADMIN) &&
        otherParticipants.every(p => p.role === ParticipantRole.MEMBER)
      ) {
        await conversationService.makeAdmin(conversationId, otherParticipants[0].userId)
      }

      await conversationService.deleteConversationParticipant(conversationId, userId)
    }

    io.to(conversationId).emit('conversation:participants:updated', { conversationId })

    res.status(200).json(
      new JsonResponse({
        status: 'success',
        message: conversationDeleted
          ? 'Group deleted successfully'
          : 'Your all messages have been deleted and you have been removed successfully from the group',
      })
    )
  } catch (err) {
    next(err)
  }
}

export default {
  getConversationInfo,
  updateGroupInfo,
  updateGroupPicture,
  addParticipants,
  removeParticipant,
  makeParticipantAdmin,
  removeParticipantFromAdmin,
  leaveGroup,
  deleteGroup,
}
