import { api } from '@/lib/api'
import { useSocketContext } from '@/providers/socket.provider'
import { ConversationEnum, type Conversation, type ConversationType } from '@/types/conversation'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useEffect } from 'react'
import { toast } from 'sonner'
import { useGetProfile } from './useAuth'

export const useCreateDirectConversation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: { type: ConversationType; participantId: string }) => {
      const res = await api.post('/conversations', data)
      return res.data
    },
    onSuccess: data => {
      queryClient.setQueriesData(
        { queryKey: ['conversations'] },
        (old?: { conversations: Conversation[]; total: number }) => {
          if (!old) return old

          return {
            ...old,
            conversations: [data, ...old.conversations],
            total: old.total + 1,
          }
        }
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
      queryClient.setQueriesData(
        { queryKey: ['conversations'] },
        (old?: { conversations: Conversation[]; total: number }) => {
          if (!old) return old

          return {
            ...old,
            conversations: [data, ...old.conversations],
            total: old.total + 1,
          }
        }
      )
    },
    onError: (error: Error) => {
      toast.error(error.message)
    },
  })
}

export const useConversations = (activeTab?: ConversationType) => {
  const {socket} = useSocketContext()
  const profile = useGetProfile()
  const queryClient = useQueryClient()

  const query = useQuery({
    queryKey: ['conversations', activeTab],
    queryFn: async () => {
      const res = await api.get<{ conversations: Conversation[]; total: number }>(
        `/conversations?tab=${activeTab || ConversationEnum.ALL}`
      )

      return res.data
    },
  })

  useEffect(() => {
    if (!socket) return

    const handleNewConversation = (newConversation: Conversation) => {
      if(newConversation.createdBy === profile.data?.id) return

      queryClient.setQueriesData(
        { queryKey: ['conversations'] },
        (old?: { conversations: Conversation[]; total: number }) => {
          if (!old) return old

          return {
            ...old,
            conversations: [newConversation, ...old.conversations],
            total: old.total + 1,
          }
        }
      )
    }

    socket.on('conversation:new', handleNewConversation)

    return () => {
      socket.off('conversation:new', handleNewConversation)
    }
  }, [socket, queryClient, profile.data?.id])

  return query
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
