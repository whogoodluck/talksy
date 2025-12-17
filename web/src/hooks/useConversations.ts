import { api } from '@/lib/api'
import { ConversationEnum, type Conversation, type ConversationType } from '@/types/conversation'
import { useQuery } from '@tanstack/react-query'

export const useConversations = (activeTab?: ConversationType) => {
  return useQuery({
    queryKey: ['conversations'],
    queryFn: async () => {
      const res = await api.get<{ conversations: Conversation[]; total: number }>(
        `/conversations?tab=${activeTab || ConversationEnum.ALL}`
      )

      return res.data
    },
  })
}

export const useSearchConversations = (query: string) => {
  return useQuery({
    queryKey: ['search-conversations', query],
    queryFn: async () => {
      const res = await api.get<{ conversations: Conversation[]; total: number }>(
        `/conversations/search?q=${query}`
      )

      return res.data
    },
  })
}
