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
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useIsMobile } from '@/hooks/useMediaQuery'
import { ConversationEnum, type ConversationType } from '@/types/conversation'
import { User, UserPlus, Users } from 'lucide-react'
import { useState } from 'react'
import CreateConversationForm from './create-conversation-form'

function CreateNewConversation() {
  const [open, setOpen] = useState(false)
  const [conversationType, setConversationType] = useState<ConversationType | null>(null)
  const [openForm, setOpenForm] = useState(false)

  const { isMobile } = useIsMobile()

  if (isMobile) {
    return (
      <>
        <Drawer>
          <DrawerTrigger asChild>
            <Button variant='ghost' size='icon' className='rounded-full'>
              <UserPlus size={30} strokeWidth={3} />
            </Button>
          </DrawerTrigger>
          <DrawerContent>
            <DrawerHeader>
              <DrawerTitle className='hidden' />
              <DrawerDescription className='hidden' />
            </DrawerHeader>
            <Button
              className='flex h-auto w-full items-center justify-between gap-4 rounded-none !px-6 py-3 text-lg'
              variant='ghost'
              onClick={() => {
                setOpenForm(true)
                setConversationType(ConversationEnum.DIRECT)
              }}
            >
              <div className='flex items-center gap-3'>
                <User className='size-5.5' />
                <span className='text-base'>New Direct</span>
              </div>
            </Button>
            <Button
              className='flex h-auto w-full items-center justify-between gap-4 rounded-none !px-6 py-3 text-lg'
              variant='ghost'
              onClick={() => {
                setOpenForm(true)
                setConversationType(ConversationEnum.GROUP)
              }}
            >
              <div className='flex items-center gap-3'>
                <Users className='size-5.5' />
                <span className='text-base'>New Group</span>
              </div>
            </Button>
            <DrawerFooter />
          </DrawerContent>
        </Drawer>

        {conversationType && (
          <CreateConversationForm
            open={openForm}
            onOpenChange={setOpenForm}
            conversationType={conversationType}
          />
        )}
      </>
    )
  }

  return (
    <>
      <DropdownMenu open={open} onOpenChange={setOpen}>
        <DropdownMenuTrigger asChild>
          <Button variant='ghost' size='icon' className='rounded-full'>
            <UserPlus size={30} strokeWidth={3} />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className='w-40' align='start'>
          <DropdownMenuGroup>
            <DropdownMenuItem
              onClick={() => {
                setOpenForm(true)
                setConversationType(ConversationEnum.DIRECT)
              }}
            >
              <User className='size-4' /> New Direct
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => {
                setOpenForm(true)
                setConversationType(ConversationEnum.GROUP)
              }}
            >
              <Users className='size-4' /> New Group
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>

      {conversationType && (
        <CreateConversationForm
          open={openForm}
          onOpenChange={setOpenForm}
          conversationType={conversationType}
        />
      )}
    </>
  )
}

export default CreateNewConversation
