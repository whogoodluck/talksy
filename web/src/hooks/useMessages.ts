import { api } from '@/lib/api'
import type { SendMessageRequest } from '@/schemas/message.schema'
import type { Message } from '@/types/conversation'
import { useMutation, useQuery } from '@tanstack/react-query'

export const useSendMessage = (conversationId: string) => {
  return useMutation({
    mutationFn: async (data: SendMessageRequest) => {
      const res = await api.post(`/conversations/${conversationId}/messages`, data)
      return res.data
    },
  })
}

export const useMessages = (conversationId: string, limit = 50) => {
  return useQuery({
    queryKey: ['messages', conversationId],
    queryFn: async () => {
      const response = await api.get<{
        messages: Message[]
        total: number
      }>(`/conversations/${conversationId}/messages?limit=${limit}`)
      return response.data
    },
    enabled: !!conversationId,
  })
}
