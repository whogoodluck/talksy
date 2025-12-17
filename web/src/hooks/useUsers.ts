import { api } from '@/lib/api'
import type { User } from '@/types/user'
import { useQuery } from '@tanstack/react-query'

export const useCurrentUser = () => {
  return useQuery({
    queryKey: ['currentUser'],
    queryFn: async () => {
      const res = await api.get<User>('/users/me')

      return res.data
    },
    staleTime: Infinity,
    retry: false,
  })
}
