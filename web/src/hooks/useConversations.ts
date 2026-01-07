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
  const { socket } = useSocketContext()
  const profile = useGetProfile()
  const queryClient = useQueryClient()
  const tab = activeTab ?? ConversationEnum.ALL

  const query = useQuery({
    queryKey: ['conversations', activeTab],
    queryFn: async () => {
      const res = await api.get<{ conversations: Conversation[]; total: number }>(
        `/conversations?tab=${tab}`
      )

      return res.data
    },
  })

  useEffect(() => {
    if (!socket) return

    const handleNewConversation = (newConversation: Conversation) => {
      if (newConversation.createdBy === profile.data?.id) return

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

export const useConversationInfo = (conversationId: string) => {
  const { socket } = useSocketContext()
  const profile = useGetProfile()
  const queryClient = useQueryClient()

  const query = useQuery({
    queryKey: ['conversation-info', conversationId],
    queryFn: async () => {
      const res = await api.get<Conversation>(`/conversations/${conversationId}`)
      return res.data
    },
    enabled: !!conversationId,
  })

  useEffect(() => {
    if (!socket) return

    const handleGroupConversationInfoUpdated = (updatedConversation: Conversation) => {
      if (updatedConversation.id === conversationId) {
        queryClient.setQueryData(['conversation-info', conversationId], updatedConversation)
      }
      
      queryClient.invalidateQueries({ queryKey: ['conversations'] })
    }

    const handleConversationParticipantsUpdated = (data: {
      conversationId: string
      participantId?: string
    }) => {
      if (data.conversationId === conversationId) {
        queryClient.invalidateQueries({ queryKey: ['conversation-info', conversationId] })
      }

      if (data.participantId && data.participantId === profile.data?.id) {
        queryClient.invalidateQueries({ queryKey: ['conversations'] })
      }
    }

    socket.on('group-conversation-info:updated', handleGroupConversationInfoUpdated)
    socket.on('conversation:participants:updated', handleConversationParticipantsUpdated)

    return () => {
      socket.off('group-conversation-info:updated', handleGroupConversationInfoUpdated)
      socket.off('conversation:participants:updated', handleConversationParticipantsUpdated)
    }
  }, [socket, conversationId, queryClient])

  return query
}

export const useUpdateGroupInfo = (conversationId: string) => {
  return useMutation({
    mutationFn: async (data: { name?: string }) => {
      const res = await api.put<Conversation>(`/conversations/${conversationId}`, data)
      return res.data
    },
    onSuccess: () => {
      toast.success('Group info updated successfully!')
    },
    onError: (error: Error) => {
      toast.error(error.message)
    },
  })
}

export const useUpdateGroupPicture = (conversationId: string) => {
  return useMutation({
    mutationFn: async (data: FormData) => {
      const res = await api.put<Conversation>(`/conversations/${conversationId}/picture`, data)
      return res.data
    },
    onSuccess: () => {
      toast.success('Group picture updated successfully!')
    },
    onError: (error: Error) => {
      toast.error(error.message)
    },
  })
}

export const useAddParticipants = (conversationId: string) => {
  return useMutation({
    mutationFn: async (data: { participantIds: string[] }) => {
      return await api.post<Conversation>(`/conversations/${conversationId}/participants/add`, data)
    },
    onSuccess: data => {
      toast.success(data.message ?? 'Participants added successfully!')
    },
    onError: (error: Error) => {
      toast.error(error.message)
    },
  })
}

export const useRemoveParticipant = (conversationId: string) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (participantId: string) => {
      return await api.delete(`/conversations/${conversationId}/participants/${participantId}`)
    },
    onSuccess: data => {
      queryClient.invalidateQueries({ queryKey: ['conversation-info', conversationId] })
      toast.success(data.message ?? 'Participant removed successfully!')
    },
    onError: (error: Error) => {
      toast.error(error.message)
    },
  })
}

export const useMakeParticipantAdmin = (conversationId: string) => {
  return useMutation({
    mutationFn: async (participantId: string) => {
      return await api.post(
        `/conversations/${conversationId}/participants/${participantId}/make-admin`
      )
    },
    onSuccess: data => {
      toast.success(data.message ?? 'Participant made admin successfully!')
    },
    onError: (error: Error) => {
      toast.error(error.message)
    },
  })
}

export const useRemoveParticipantFromAdmin = (conversationId: string) => {
  return useMutation({
    mutationFn: async (participantId: string) => {
      return await api.post(
        `/conversations/${conversationId}/participants/${participantId}/remove-from-admin`
      )
    },
    onSuccess: data => {
      toast.success(data.message ?? 'Participant removed from admin successfully!')
    },
    onError: (error: Error) => {
      toast.error(error.message)
    },
  })
}

export const useLeaveGroup = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (conversationId: string) => {
      return await api.post(`/conversations/${conversationId}/leave`)
    },
    onSuccess: data => {
      queryClient.invalidateQueries({ queryKey: ['conversations'] })
      toast.success(data.message ?? 'Left group successfully!')
    },
    onError: (error: Error) => {
      toast.error(error.message)
    },
  })
}

export const useDeleteGroup = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (conversationId: string) => {
      return await api.delete(`/conversations/${conversationId}`)
    },
    onSuccess: data => {
      queryClient.invalidateQueries({ queryKey: ['conversations'] })
      toast.success(data.message ?? 'Group deleted successfully!')
    },
    onError: (error: Error) => {
      toast.error(error.message)
    },
  })
}
