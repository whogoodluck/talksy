import { api } from '@/lib/api'
import type { User } from '@/types/user'
import { useMutation, useQuery } from '@tanstack/react-query'
import { toast } from 'sonner'

export const useSearchUsers = (query: string) => {
  return useQuery({
    queryKey: ['search-users', query],
    queryFn: async () => {
      const res = await api.get<{ users: User[]; total: number }>(`/users/search?q=${query}`)
      return res.data
    },
  })
}

export const useGetUserByUsername = (username: string) => {
  return useQuery({
    queryKey: ['user-by-username', username],
    queryFn: async () => {
      const res = await api.get<User>(`/users/${username}`)
      return res.data
    },
  })
}

export const useUpdateProfilePicture = () => {
  return useMutation({
    mutationFn: async (data: FormData) => {
      const res = await api.put<User>('/users/me/picture', data)
      return res.data
    },
    onSuccess: () => {
      toast.success('Profile picture updated successfully!')
    },
    onError: (error: Error) => {
      toast.error(error.message)
    },
  })
}
