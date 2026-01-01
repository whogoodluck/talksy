import { ConversationEnum, type Conversation } from '@/types/conversation'

export const getOtherParticipantFromDirectConversation = (
  conversation: Conversation,
  currentUserId: string
) => {
  if (conversation.type !== ConversationEnum.DIRECT) return
  return conversation.participants.find(p => p.user.id !== currentUserId)
}

export const getConversationName = (conversation: Conversation, currentUserId: string): string => {
  if (conversation.type === ConversationEnum.GROUP) {
    return conversation.name || 'Unnamed Group'
  }
  const otherParticipant = getOtherParticipantFromDirectConversation(conversation, currentUserId)
  return otherParticipant?.user.name || 'Unknown User'
}

export const getConversationAvatar = (conversation: Conversation, currentUserId: string) => {
  if (conversation.type === ConversationEnum.GROUP) {
    return conversation.picture
  }
  const otherParticipant = conversation.participants.find(p => p.user.id !== currentUserId)
  return otherParticipant?.user.picture
}
