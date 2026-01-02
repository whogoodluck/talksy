import { useConversations, useSearchConversations } from '@/hooks/useConversations'
import { useConversationContext } from '@/providers/conversation.provider'
import { ConversationEnum, type Conversation, type ConversationType } from '@/types/conversation'
import { MessageSquareMore, RotateCw } from 'lucide-react'
import { useState } from 'react'
import FallbackState from '../../fallback-state'
import CreateConversationForm from '../create-new-conversation/create-conversation-form'
import { ConversationItem, ConversationItemSkeleton } from './conversation-item'

type ConversationListProps = {
  debouncedSearchQuery: string
  activeTab: ConversationType
}

function ConversationList({ debouncedSearchQuery, activeTab }: ConversationListProps) {
  const [openForm, setOpenForm] = useState(false)
  const { setSelectedConversation } = useConversationContext()
  const conversations = useConversations(activeTab)
  const searchConversations = useSearchConversations(debouncedSearchQuery)

  const conversationList: Conversation[] = conversations.data?.conversations || []
  const searchConversationList: Conversation[] = searchConversations.data?.conversations || []

  if (conversations.isPending || searchConversations.isPending) {
    return (
      <div className='scrollbar-hide w-full space-y-[6px] overflow-y-hidden'>
        {Array.from({ length: 10 }).map((_, i) => (
          <ConversationItemSkeleton key={i} />
        ))}
      </div>
    )
  }

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
        onAction={() => searchConversations.refetch()}
        actionLabel='Try again'
        actionIcon={RotateCw}
      />
    )

  if (conversationList.length === 0)
    return (
      <>
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
          onAction={() => setOpenForm(true)}
          actionLabel={activeTab === ConversationEnum.GROUP ? 'Create a group' : 'New Conversation'}
        />
        <CreateConversationForm
          open={openForm}
          onOpenChange={setOpenForm}
          conversationType={ConversationEnum.DIRECT}
        />
      </>
    )

  return (
    <div className='scrollbar-hide w-full space-y-0.5 overflow-y-auto'>
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
