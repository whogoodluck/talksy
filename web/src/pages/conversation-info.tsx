import ConversationInfo from '@/components/conversation-info'
import FallbackState from '@/components/fallback-state'
import { Loader } from '@/components/loader'
import { Sheet, SheetContent, SheetDescription, SheetTitle } from '@/components/ui/sheet'
import { useGroupInfo } from '@/hooks/useGroupConversations'
import { useIsMobile } from '@/hooks/useMediaQuery'
import { Users } from 'lucide-react'
import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import Home from './home'

function ConversationInfoPage() {
  const { id: conversationId } = useParams<{ id: string }>()
  const { isMobile } = useIsMobile()
  const navigate = useNavigate()
  const groupInfo = useGroupInfo(conversationId!)
  const conversation = groupInfo.data

  const [isOpenSheet, setIsOpenSheet] = useState(true)

  if (groupInfo.isLoading) {
    if (isMobile) {
      return (
        <div className='bg-background relative z-10 flex h-screen items-center justify-center'>
          <Loader />
        </div>
      )
    }

    return (
      <>
        <Home />
        <Sheet
          open={isOpenSheet}
          onOpenChange={() => {
            ;(setIsOpenSheet(!isOpenSheet), navigate(-1))
          }}
        >
          <SheetContent className='min-w-xl'>
            <SheetTitle className='hidden' />
            <SheetDescription className='hidden' />
            <div className='flex h-full items-center justify-center'>
              <Loader />
            </div>
          </SheetContent>
        </Sheet>
      </>
    )
  }

  if (!conversation) {
    if (isMobile) {
      return (
        <FallbackState
          icon={Users}
          title='Group not found'
          className='relative z-10'
          actionLabel='Go back'
          onAction={() => navigate(-1)}
        />
      )
    }

    return (
      <>
        <Home />
        <Sheet
          open={isOpenSheet}
          onOpenChange={() => {
            ;(setIsOpenSheet(!isOpenSheet), navigate(-1))
          }}
        >
          <SheetContent className='min-w-xl'>
            <SheetTitle className='hidden' />
            <SheetDescription className='hidden' />
            <FallbackState
              icon={Users}
              title='Group not found'
              actionLabel='Go back'
              onAction={() => navigate(-1)}
            />
          </SheetContent>
        </Sheet>
      </>
    )
  }

  if (isMobile) {
    return <ConversationInfo conversation={conversation} />
  }

  return (
    <>
      <Home />
      <Sheet
        open={isOpenSheet}
        onOpenChange={() => {
          ;(setIsOpenSheet(!isOpenSheet), navigate(-1))
        }}
      >
        <SheetContent className='min-w-xl'>
          <SheetTitle className='hidden' />
          <SheetDescription className='hidden' />
          <ConversationInfo conversation={conversation} />
        </SheetContent>
      </Sheet>
    </>
  )
}

export default ConversationInfoPage
