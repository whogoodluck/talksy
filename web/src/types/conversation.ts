import type { User } from './user'

export const ConversationEnum = {
  ALL: 'ALL',
  DIRECT: 'DIRECT',
  GROUP: 'GROUP',
} as const

export type ConversationType = (typeof ConversationEnum)[keyof typeof ConversationEnum]

export const MessageEnum = {
  TEXT: 'TEXT',
  IMAGE: 'IMAGE',
  VIDEO: 'VIDEO',
  AUDIO: 'AUDIO',
  FILE: 'FILE',
  SYSTEM: 'SYSTEM',
} as const

export type MessageType = (typeof MessageEnum)[keyof typeof MessageEnum]

export interface ConversationParticipant {
  id: string
  userId: string
  user: User
  joinedAt: string
  isAdmin: boolean
  isMuted: boolean
  lastReadAt?: string
}

export interface Message {
  id: string
  conversationId: string
  senderId: string
  sender: User
  content: string
  type: MessageType
  fileUrl?: string
  fileName?: string
  fileSize?: number
  isEdited: boolean
  isDeleted: boolean
  replyToId?: string
  replyTo?: Message
  createdAt: string
  updatedAt: string
  readReceipts?: ReadReceipt[]
}

export interface ReadReceipt {
  id: string
  messageId: string
  userId: string
  user: User
  readAt: string
}

export interface Conversation {
  id: string
  type: ConversationType
  name?: string
  picture?: string
  createdBy?: string
  createdAt: string
  updatedAt: string
  participants: ConversationParticipant[]
  messages: Message[]
  _count?: {
    messages: number
  }
}

export interface CreateDirectConversationRequest {
  type?: typeof ConversationEnum.DIRECT
  participantId: string
}

export interface CreateGroupConversationRequest {
  type: typeof ConversationEnum.GROUP
  name: string
  picture?: string
  participantIds: string[]
}

export interface UpdateConversationRequest {
  name?: string
  picture?: string
}

export interface SendMessageRequest {
  content: string
  type?: MessageType
  fileUrl?: string
  fileName?: string
  fileSize?: number
  replyToId?: string
}

export interface EditMessageRequest {
  content: string
}

export interface GetMessagesQuery {
  limit?: number
  cursor?: string
}
