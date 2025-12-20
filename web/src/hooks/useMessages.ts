import { api } from '@/lib/api'
import type { SendMessageRequest } from '@/schemas/message.schema'
import type { Message } from '@/types/conversation'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useGetProfile } from './useAuth'

export const useSendMessage = (conversationId: string) => {
  const profile = useGetProfile()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: SendMessageRequest) => {
      const res = await api.post(`/conversations/${conversationId}/messages`, data)
      return res.data
    },
    onMutate: async data => {
      await queryClient.cancelQueries({
        queryKey: ['messages', conversationId],
      })

      const tempMessage = {
        id: `temp-${Date.now()}`,
        conversationId,
        senderId: profile.data?.id,
        sender: {
          picture: profile.data?.picture,
          name: profile.data?.name,
        },
        createdAt: new Date().toISOString(),
        ...data,
      }

      queryClient.setQueryData(
        ['messages', conversationId],
        (old: { messages: Message[]; total: number }) => ({
          messages: [...old.messages, tempMessage],
          total: old.total + 1,
        })
      )

      return { tempMessage }
    },
    onSuccess: (data, _variables, context) => {
      queryClient.setQueryData(
        ['messages', conversationId],
        (old: { messages: Message[]; total: number }) => ({
          ...old,
          messages: old.messages.map(m => (m.id === context.tempMessage.id ? data : m)),
          total: old.total + 1,
        })
      )
    },
    onError: (_, _variables, context) => {
      queryClient.setQueryData(
        ['messages', conversationId],
        (old: { messages: Message[]; total: number }) => ({
          ...old,
          messages: old.messages.filter(m => m.id !== context?.tempMessage.id),
          total: old.total - 1,
        })
      )
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
