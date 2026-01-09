import { api } from '@/lib/api'
import { useSocketContext } from '@/providers/socket.provider'
import type { Message, ReadReceipt } from '@/types/conversation'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useEffect } from 'react'
import { useGetProfile } from './useAuth'

export const useSendMessage = (conversationId: string) => {
  const profile = useGetProfile()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: FormData) => {
      const res = await api.post(`/conversations/${conversationId}/messages`, data)
      return res.data
    },
    onMutate: async data => {
      await queryClient.cancelQueries({
        queryKey: ['messages', conversationId],
      })

      const mutateData: Record<string, any> = {}
      for (const [key, value] of data.entries()) {
        mutateData[key] = value
      }

      const tempMessage = {
        id: `temp-${Date.now()}`,
        conversationId,
        senderId: profile.data?.id,
        sender: {
          picture: profile.data?.picture,
          name: profile.data?.name,
        },
        createdAt: new Date().toISOString(),
        fileUrl: mutateData.file ? URL.createObjectURL(mutateData.file) : undefined,
        ...mutateData,
      }

      queryClient.setQueryData(
        ['messages', conversationId],
        (old: { messages: Message[]; total: number } | undefined) => {
          old = old || { messages: [], total: 0 }

          return {
            messages: [...old.messages, tempMessage],
            total: old.total + 1,
          }
        }
      )

      return { tempMessage }
    },
    onSuccess: (data, _variables, context) => {
      queryClient.setQueryData(
        ['messages', conversationId],
        (old: { messages: Message[]; total: number } | undefined) => {
          if (!old) return { messages: [data], total: 1 }

          return {
            ...old,
            messages: old.messages.map(m => (m.id === context.tempMessage.id ? data : m)),
            total: old.total,
          }
        }
      )

      queryClient.invalidateQueries({ queryKey: ['conversations'] })

      if (context.tempMessage.fileUrl) {
        URL.revokeObjectURL(context.tempMessage.fileUrl)
      }
    },
    onError: (_, _variables, context) => {
      queryClient.setQueryData(
        ['messages', conversationId],
        (old: { messages: Message[]; total: number } | undefined) => {
          if (!old) return { messages: [], total: 0 }

          return {
            ...old,
            messages: old.messages.filter(m => m.id !== context?.tempMessage.id),
            total: old.total - 1,
          }
        }
      )

      if (context?.tempMessage.fileUrl) {
        URL.revokeObjectURL(context.tempMessage.fileUrl)
      }
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
            messages: [...old.messages, message],
            total: old.total + 1,
          }
        }
      )

      queryClient.invalidateQueries({ queryKey: ['conversations'] })
    }

    socket.on('message:new', handleNewMessage)

    const handleReadMessage = (readReceipt: ReadReceipt) => {
      if (readReceipt.userId === profile.data?.id) return

      queryClient.setQueryData(
        ['messages', conversationId],
        (old: { messages: Message[]; total: number } | undefined) => {
          if (!old) return { messages: [], total: 0 }

          return {
            ...old,
            messages: old.messages.map(m => {
              if (m.id === readReceipt.messageId) {
                return {
                  ...m,
                  readReceipts: m.readReceipts ? [...m.readReceipts, readReceipt] : [readReceipt],
                }
              }
              return m
            }),
          }
        }
      )

      queryClient.invalidateQueries({ queryKey: ['conversations'] })
    }

    socket.on('message:read', handleReadMessage)

    return () => {
      socket.off('message:new', handleNewMessage)
      socket.off('message:read', handleReadMessage)
    }
  }, [socket, conversationId, queryClient, profile.data?.id])

  return query
}

export const useMarkAsRead = (conversationId: string) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (messageId: string) => {
      await api.post(`/conversations/${conversationId}/messages/${messageId}/read`)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['conversations'] })
    },
  })
}
