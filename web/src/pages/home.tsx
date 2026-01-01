import FallbackState from '@/components/fallback-state'
import ConversationsContainer from '@/components/home/conversations-container'
import CreateConversationForm from '@/components/home/create-new-conversation/create-conversation-form'
import MessagesContainer from '@/components/home/messages-container'
import { useConversationContext } from '@/providers/conversation.provider'
import { ConversationEnum } from '@/types/conversation'
import { MessageSquareMore } from 'lucide-react'
import { useState } from 'react'

function Home() {
  const [openForm, setOpenForm] = useState(false)
  const { selectedConversation } = useConversationContext()

  return (
    <div className='flex h-full'>
      <ConversationsContainer />
      {selectedConversation ? (
        <MessagesContainer />
      ) : (
        <div className='hidden flex-1 items-center justify-center md:flex'>
          <FallbackState
            icon={MessageSquareMore}
            title='Your messages'
            description='Choose from your existing conversations, or start a new one.'
            actionLabel='New Conversation'
            onAction={() => setOpenForm(true)}
          />
          <CreateConversationForm
            open={openForm}
            onOpenChange={setOpenForm}
            conversationType={ConversationEnum.DIRECT}
          />
        </div>
      )}
    </div>
  )
}

export default Home
