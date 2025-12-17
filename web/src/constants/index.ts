import { ConversationEnum } from '@/types/conversation'

export const HOME_TABS = [
  {
    value: 'All',
    label: ConversationEnum.ALL,
  },
  {
    value: 'Groups',
    label: ConversationEnum.GROUP,
  },
  {
    value: 'Direct',
    label: ConversationEnum.DIRECT,
  },
]

export const FALLBACK_USER_AVATAR_LIGHT = '/images/user-avatar.png'
