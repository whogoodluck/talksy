import ConversationInfo from '@/components/conversation-info'
import { Sheet, SheetContent, SheetDescription, SheetTitle } from '@/components/ui/sheet'
import { useIsMobile } from '@/hooks/useMediaQuery'
import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

function ConversationInfoPage() {
  const { id: conversationId } = useParams<{ id: string }>()
  const { isMobile } = useIsMobile()
  const [isOpenSheet, setIsOpenSheet] = useState(true)
  const navigate = useNavigate()

  if (isMobile) {
    return <ConversationInfo conversationId={conversationId!} />
  }

  return (
    <Sheet
      open={isOpenSheet}
      onOpenChange={() => {
        ;(setIsOpenSheet(!isOpenSheet), navigate(-1))
      }}
    >
      <SheetContent className='min-w-xl'>
        <SheetTitle className='hidden' />
        <SheetDescription className='hidden' />
        <ConversationInfo conversationId={conversationId!} />
      </SheetContent>
    </Sheet>
  )
}

export default ConversationInfoPage
