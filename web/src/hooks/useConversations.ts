import { HomeTabEnum, type HomeTab } from '@/constants'
import { api } from '@/lib/api'
import type { Conversation } from '@/types/conversation'
import { useQuery } from '@tanstack/react-query'

export const useConversations = (activeTab?: HomeTab) => {
  return useQuery({
    queryKey: ['conversations'],
    queryFn: async () => {
      const res = await api.get<{ conversations: Conversation[]; total: number }>(
        `/conversations?tab=${activeTab || HomeTabEnum.ALL}`
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
