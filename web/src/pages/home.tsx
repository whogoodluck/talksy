import FallbackState from '@/components/fallback-state'
import LeftSidebar from '@/components/home/left-sidebar'
import MessagesContainer from '@/components/home/messages-container'
import { useConversationContext } from '@/providers/conversation.provider'
import { MessageSquareMore } from 'lucide-react'

function Home() {
  const { selectedConversation } = useConversationContext()

  return (
    <div className='flex h-screen'>
      <LeftSidebar />
      {selectedConversation ? (
        <MessagesContainer />
      ) : (
        <div className='hidden flex-1 items-center justify-center md:flex'>
          <FallbackState
            icon={MessageSquareMore}
            title='Your messages'
            description='Choose from your existing conversations, or start a new one.'
            actionLabel='New Conversation'
            onAction={() => {}}
          />
        </div>
      )}
    </div>
  )
}

export default Home
