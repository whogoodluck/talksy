import UserAvatar from '@/components/common/user-avatar'
import LeftSidebar from '@/components/home/left-sidebar'
import { Button } from '@/components/ui/button'
import { useCurrentUser } from '@/hooks/useUsers'
import { useConversationContext } from '@/providers/conversation.provider'
import { getConversationAvatar, getConversationName } from '@/utils/conversation'
import { ArrowLeft, EllipsisVertical, Search } from 'lucide-react'

function Home() {
  const { data: currentUser } = useCurrentUser()
  const { selectedConversation, setSelectedConversation } = useConversationContext()

  const conversationName =
    currentUser && selectedConversation && getConversationName(selectedConversation, currentUser.id)

  const conversationAvatar =
    currentUser &&
    selectedConversation &&
    getConversationAvatar(selectedConversation, currentUser.id)

  return (
    <div className='flex h-screen'>
      <LeftSidebar />
      {selectedConversation ? (
        <div className='bg-accent flex-1'>
          <header className='bg-background flex h-16 items-center justify-between p-2 md:h-20 md:p-4'>
            <div className='flex items-center gap-3 md:gap-4'>
              <button className='md:hidden' onClick={() => setSelectedConversation(null)}>
                <ArrowLeft size={20} />
              </button>
              <UserAvatar
                size='sm'
                picture={conversationAvatar || undefined}
                name={conversationName || 'Unknown'}
              />
              <div>
                <h3>
                  {conversationName}
                  <p className='text-muted-foreground text-xs'>3h ago</p>
                </h3>
              </div>
            </div>

            <div className='flex items-center gap-1'>
              <Button variant='ghost' size='icon' className='rounded-full'>
                <Search size={30} strokeWidth={3} />
              </Button>
              <Button variant='ghost' size='icon' className='rounded-full'>
                <EllipsisVertical size={30} strokeWidth={3} />
              </Button>
            </div>
          </header>
        </div>
      ) : null}
    </div>
  )
}

export default Home
