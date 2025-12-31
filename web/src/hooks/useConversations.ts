import { api } from '@/lib/api'
import { ConversationEnum, type Conversation, type ConversationType } from '@/types/conversation'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

export const useCreateDirectConversation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: { type: ConversationType; participantId: string }) => {
      const res = await api.post('/conversations', data)
      return res.data
    },
    onSuccess: data => {
      queryClient.setQueryData(
        ['conversations'],
        (old: { conversations: Conversation[]; total: number }) => ({
          conversations: [data, ...old.conversations],
          total: old.total + 1,
        })
      )
    },
    onError: (error: Error) => {
      toast.error(error.message)
    },
  })
}

export const useCreateGroupConversation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: {
      type: ConversationType
      participantIds: string[]
      name: string
    }) => {
      const res = await api.post<{ conversation: Conversation }>('/conversations', data)
      return res.data
    },
    onSuccess: data => {
      queryClient.setQueryData(
        ['conversations'],
        (old: { conversations: Conversation[]; total: number }) => ({
          conversations: [data, ...old.conversations],
          total: old.total + 1,
        })
      )
    },
    onError: (error: Error) => {
      toast.error(error.message)
    },
  })
}

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
    queryKey: ['search-conversations'],
    queryFn: async () => {
      const res = await api.get<{ conversations: Conversation[]; total: number }>(
        `/conversations/search?q=${query}`
      )

      return res.data
    },
  })
}
