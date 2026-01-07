import { Button } from '@/components/ui/button'
import { ConfirmAlertDialog } from '@/components/ui/confirm-alert-dialog'
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
import { useDeleteGroup } from '@/hooks/useGroupConversations'
import { useConversationContext } from '@/providers/conversation.provider'
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
  const [showDeleteGroupAlert, setShowDeleteGroupAlert] = useState(false)
  const { setSelectedConversation } = useConversationContext()
  const profile = useGetProfile()
  const deleteGroup = useDeleteGroup()

  const otherParticipant = getOtherParticipantFromDirectConversation(conversation, profile.data!.id)

  const handleDeleteGroup = () => {
    if(conversation.type !== ConversationEnum.GROUP) return
    deleteGroup.mutate(conversation.id, {
      onSuccess: () => {
        setShowDeleteGroupAlert(false)
        setSelectedConversation(null)
      },
    })
  }

  const isMobile = window.innerWidth < 768

  if (isMobile) {
    return (
      <>
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
          {conversation.type === ConversationEnum.GROUP && <Button
              className='flex h-auto w-full items-center justify-start gap-4 rounded-none !px-6 py-3 text-lg'
              variant='ghost'
              onClick={() => setShowDeleteGroupAlert(true)}
            >
              <div className='flex items-center gap-4'>
                <Trash2 className='text-destructive size-5.5' />
                <span>Delete chat</span>
              </div>
            </Button>}
          <DrawerFooter />
        </DrawerContent>
      </Drawer>

      { conversation.type === ConversationEnum.GROUP && <ConfirmAlertDialog
        open={showDeleteGroupAlert}
        onOpenChange={setShowDeleteGroupAlert}
        icon={<Trash2 />}
        title='Delete this group?'
        description='Are you sure you want to delete this group? This action cannot be undone.'
        isLoading={deleteGroup.isPending}
        loadingText='Deleting...'
        confirmText='Delete'
        onConfirm={handleDeleteGroup}
      />}
      </>
    )
  }

  return (
    <>
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
          {conversation.type === ConversationEnum.GROUP && (
            <DropdownMenuItem onClick={() => setShowDeleteGroupAlert(true)}>
              <Trash2 className='text-destructive size-4' /> Delete chat
            </DropdownMenuItem>
          )}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>

    { conversation.type === ConversationEnum.GROUP && <ConfirmAlertDialog
        open={showDeleteGroupAlert}
        onOpenChange={setShowDeleteGroupAlert}
        icon={<Trash2 />}
        title='Delete this group?'
        description='Are you sure you want to delete this group? This action cannot be undone.'
        isLoading={deleteGroup.isPending}
        loadingText='Deleting...'
        confirmText='Delete'
        onConfirm={handleDeleteGroup}
      />}
    </>
  )
}
