import { api } from '@/lib/api'
import { useSocketContext } from '@/providers/socket.provider'
import type { SendMessageRequest } from '@/schemas/message.schema'
import type { Message } from '@/types/conversation'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useEffect } from 'react'
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
  const queryClient = useQueryClient()
  const { socket } = useSocketContext()
  const profile = useGetProfile()

  const query = useQuery({
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

  useEffect(() => {
    if (!socket) return

    const handleNewMessage = (message: Message) => {
      if (message.senderId === profile.data?.id) return

      queryClient.setQueryData(
        ['messages', conversationId],
        (old: { messages: Message[]; total: number } | undefined) => {
          if (!old)
            return {
              messages: [message],
              total: 1,
            }

          const exists = old.messages.find(m => m.id === message.id)
          if (exists) return old

          return {
            ...old,
            messages: [message, ...old.messages],
            total: old.total + 1,
          }
        }
      )
    }

    socket.on('message:new', handleNewMessage)
  }, [socket, conversationId, queryClient, profile.data?.id])

  return query
}
