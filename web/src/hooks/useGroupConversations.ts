import { api } from '@/lib/api'
import { useSocketContext } from '@/providers/socket.provider'
import { type Conversation } from '@/types/conversation'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useEffect } from 'react'
import { toast } from 'sonner'

export const useGroupInfo = (conversationId: string) => {
  const { socket } = useSocketContext()
  const queryClient = useQueryClient()

  const query = useQuery({
    queryKey: ['conversation-info', conversationId],
    queryFn: async () => {
      const res = await api.get<Conversation>(`/conversations/groups/${conversationId}`)
      return res.data
    },
    enabled: !!conversationId,
  })

  useEffect(() => {
    if (!socket) return

    const handleConversationParticipantsUpdated = (data: {
      conversationId: string
    }) => {
      if (data.conversationId === conversationId) {
        queryClient.invalidateQueries({ queryKey: ['conversation-info', conversationId] })
      }

        queryClient.invalidateQueries({ queryKey: ['conversations'] })
      
    }

    socket.on('group-conversation:updated', handleConversationParticipantsUpdated)

    return () => {
      socket.off('group-conversation:updated', handleConversationParticipantsUpdated)
    }
  }, [socket, conversationId, queryClient])

  return query
}

export const useUpdateGroupInfo = (conversationId: string) => {
  return useMutation({
    mutationFn: async (data: { name?: string }) => {
      const res = await api.put<Conversation>(`/conversations/groups/${conversationId}`, data)
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
      const res = await api.put<Conversation>(`/conversations/groups/${conversationId}/picture`, data)
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
      return await api.post<Conversation>(`/conversations/groups/${conversationId}/participants/add`, data)
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
      return await api.delete(`/conversations/groups/${conversationId}/participants/${participantId}`)
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
        `/conversations/groups/${conversationId}/participants/${participantId}/make-admin`
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
        `/conversations/groups/${conversationId}/participants/${participantId}/remove-from-admin`
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
      return await api.post(`/conversations/groups/${conversationId}/leave`)
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
      return await api.delete(`/conversations/groups/${conversationId}`)
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
