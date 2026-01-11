import { ConversationEnum } from '@/types/conversation'
import { HomeIcon } from 'lucide-react'

export const PROTECTED_LINKS = [
  {
    name: 'Home',
    href: '/',
    icon: HomeIcon,
  },
  // {
  //   name: 'Status',
  //   href: '/status',
  //   icon: ClockFading,
  // },
  // {
  //   name: 'Notifications',
  //   href: '/notifications',
  //   icon: Bell,
  // },
]

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
    value: 'Directs',
    label: ConversationEnum.DIRECT,
  },
]
