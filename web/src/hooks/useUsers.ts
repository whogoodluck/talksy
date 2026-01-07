import { api } from '@/lib/api'
import type { User } from '@/types/user'
import { useQuery } from '@tanstack/react-query'

export const useSearchUsers = (query: string) => {
  return useQuery({
    queryKey: ['search-users', query],
    queryFn: async () => {
      const res = await api.get<{ users: User[]; total: number }>(`/users/search?q=${query}`)
      return res.data
    },
  })
}
