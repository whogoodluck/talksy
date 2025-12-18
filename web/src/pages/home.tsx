import FallbackState from '@/components/fallback-state'
import LeftSidebar from '@/components/home/left-sidebar'
import MessagesContainer from '@/components/home/messages-container'
import { useConversationContext } from '@/providers/conversation.provider'
import { Send } from 'lucide-react'

function Home() {
  const { selectedConversation } = useConversationContext()

  return (
    <div className='flex h-screen'>
      <LeftSidebar />
      {selectedConversation ? (
        <MessagesContainer />
      ) : (
        <div className='hidden md:flex flex-1 items-center justify-center'>
          <FallbackState
            icon={Send}
            title='Your messages'
            description='Select a conversation to start messaging'
          />
        </div>
      )}
    </div>
  )
}

export default Home
