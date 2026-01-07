import { Button } from '@/components/ui/button'
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLink,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useGetProfile } from '@/hooks/useAuth'
import { ConversationEnum, type Conversation } from '@/types/conversation'
import { getOtherParticipantFromDirectConversation } from '@/utils/conversation'
import { EllipsisVertical, Info, Trash2 } from 'lucide-react'
import { useState } from 'react'
import { Link } from 'react-router-dom'

type ConversationMenuProps = {
  conversation: Conversation
}

export function ConversationMenu({ conversation }: ConversationMenuProps) {
  const [open, setOpen] = useState(false)
  const profile = useGetProfile()

  const otherParticipant = getOtherParticipantFromDirectConversation(conversation, profile.data!.id)

  const isMobile = window.innerWidth < 768

  if (isMobile) {
    return (
      <Drawer>
        <DrawerTrigger asChild>
          <Button variant='ghost' size='icon' className='rounded-full'>
            <EllipsisVertical size={30} strokeWidth={3} />
          </Button>
        </DrawerTrigger>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle className='hidden' />
            <DrawerDescription className='hidden' />
          </DrawerHeader>
          <Link
            to={
              conversation.type === ConversationEnum.DIRECT
                ? `/users/${otherParticipant?.user.username}`
                : `/conversations/group/${conversation.id}`
            }
            className='hover:bg-foreground/5 active:bg-foreground/5 flex items-center gap-4 px-6 py-3 text-lg'
          >
            <Info className='size-5.5' />
            <span>
              {conversation.type === ConversationEnum.DIRECT ? 'User Info' : 'Group info'}
            </span>
          </Link>
          {conversation.createdBy === profile.data?.id && (
            <Link
              to={`/conversations/group/${conversation.id}`}
              className='hover:bg-foreground/5 active:bg-foreground/5 flex items-center gap-4 px-6 py-3 text-lg'
            >
              <Trash2 className='text-destructive size-5.5' />
              <span>Delete chat</span>
            </Link>
          )}
          <DrawerFooter />
        </DrawerContent>
      </Drawer>
    )
  }

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild className=''>
        <Button variant='ghost' size='icon' className='rounded-full'>
          <EllipsisVertical size={30} strokeWidth={3} />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className='mr-2 w-40' align='start'>
        <DropdownMenuGroup className='space-y-0.5'>
          <DropdownMenuLink
            className='hover:bg-accent hover:text-accent-foreground rounded-sm px-3 py-2.5 text-sm'
            to={
              conversation.type === ConversationEnum.DIRECT
                ? `/users/${otherParticipant?.user.username}`
                : `/conversations/group/${conversation.id}`
            }
          >
            <Info className='size-4' />
            {conversation.type === ConversationEnum.DIRECT ? 'User Info' : 'Group info'}
          </DropdownMenuLink>
          {conversation.createdBy === profile.data?.id && (
            <DropdownMenuItem>
              <Trash2 className='text-destructive size-4' /> Delete chat
            </DropdownMenuItem>
          )}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
