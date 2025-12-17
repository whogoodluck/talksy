import { useConversations, useSearchConversations } from '@/hooks/useConversations'
import { useConversationContext } from '@/providers/conversation.provider'
import { ConversationEnum, type Conversation, type ConversationType } from '@/types/conversation'
import { MessageSquareMore, Plus, RotateCw } from 'lucide-react'
import { useEffect } from 'react'
import FallbackState from '../fallback-state'
import { ConversationItem, ConversationItemSkeleton } from './conversation-item'

type ConversationListProps = {
  debouncedSearchQuery: string
  activeTab: ConversationType
}

function ConversationList({ debouncedSearchQuery, activeTab }: ConversationListProps) {
  const { setSelectedConversation } = useConversationContext()
  const conversations = useConversations(activeTab)
  const searchConversations = useSearchConversations(debouncedSearchQuery)

  useEffect(() => {
    conversations.refetch()
  }, [activeTab])

  const conversationList: Conversation[] = conversations.data?.conversations || []
  const searchConversationList: Conversation[] = searchConversations.data?.conversations || []

  if (conversations.isPending || searchConversations.isPending)
    return (
      <div className='scrollbar-hide w-full space-y-[6px]'>
        {Array.from({ length: 10 }).map((_, i) => (
          <ConversationItemSkeleton key={i} />
        ))}
      </div>
    )

  if (debouncedSearchQuery && searchConversations.isError)
    return (
      <FallbackState
        icon={MessageSquareMore}
        title='Failed to load conversations'
        description={searchConversations.error.message}
        onAction={() => searchConversations.refetch()}
        actionLabel='Try again'
        actionIcon={RotateCw}
      />
    )

  if (conversations.isError)
    return (
      <FallbackState
        icon={MessageSquareMore}
        title='Failed to load conversations'
        description={conversations.error.message}
        onAction={() => conversations.refetch()}
        actionLabel='Try again'
        actionIcon={RotateCw}
      />
    )

  if (debouncedSearchQuery && searchConversationList.length === 0)
    return (
      <FallbackState
        icon={MessageSquareMore}
        title='No conversations found'
        description={`No conversations found for "${debouncedSearchQuery}". Try a different search query.`}
        onAction={() => {}}
        actionLabel='Try again'
        actionIcon={RotateCw}
      />
    )

  if (conversationList.length === 0)
    return (
      <FallbackState
        icon={MessageSquareMore}
        title={
          activeTab === ConversationEnum.ALL
            ? 'No conversations yet'
            : `No ${activeTab.toLowerCase()} conversations yet`
        }
        description={
          activeTab === ConversationEnum.GROUP
            ? 'Create a group to start a conversation'
            : 'Start a new conversation'
        }
        onAction={() => {}}
        actionLabel={activeTab === ConversationEnum.GROUP ? 'Create a group' : 'New Conversation'}
        actionIcon={Plus}
      />
    )

  return (
    <div className='scrollbar-hide w-full space-y-[6px]'>
      {debouncedSearchQuery && searchConversationList
        ? searchConversationList.map(conversation => (
            <ConversationItem
              key={conversation.id}
              conversation={conversation}
              setSelectedConversation={setSelectedConversation}
            />
          ))
        : conversationList.map(conversation => (
            <ConversationItem
              key={conversation.id}
              conversation={conversation}
              setSelectedConversation={setSelectedConversation}
            />
          ))}
    </div>
  )
}

export default ConversationList
