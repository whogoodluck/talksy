import { api } from '@/lib/api'
import type { UpdateProfileRequest } from '@/schemas/user.schema'
import type { User } from '@/types/user'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
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

export const useCheckUserName = () => {
  useMutation({
    mutationFn: async (username: string) => {
      return await api.get<User>(`/users/${username}`)
    },
  })
}

export const useUpdateProfilePicture = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: FormData) => {
      return await api.put<User>('/users/update-profile-picture', data)
    },
    onSuccess: data => {
      queryClient.setQueryData(['profile'], data.data)
      toast.success('Profile picture updated successfully!')
    },
    onError: (error: Error) => {
      toast.error(error.message)
    },
  })
}

export const useUpdateProfile = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: UpdateProfileRequest) => {
      return await api.put<User>('/users/update-profile', data)
    },
    onSuccess: data => {
      queryClient.setQueryData(['profile'], data.data)
      toast.success('Profile updated successfully!')
    },
    onError: (error: Error) => {
      toast.error(error.message)
    },
  })
}
