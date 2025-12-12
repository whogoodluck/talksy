import type { SigninRequest, SignupRequest } from '@/schemas/user.schema'
import type { User } from '@/types/user'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { api } from '../lib/api'

export const useSignin = () => {
  const queryClient = useQueryClient()
  const navigate = useNavigate()

  return useMutation({
    mutationFn: async (credentials: SigninRequest) => {
      return await api.post<User>('/users/signin', credentials)
    },
    onSuccess: data => {
      queryClient.setQueryData(['currentUser'], data)
      toast.success('Signed in successfully!')
      navigate('/')
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Signin failed')
    },
  })
}

export const useSignup = () => {
  const queryClient = useQueryClient()
  const navigate = useNavigate()

  return useMutation({
    mutationFn: async (credentials: SignupRequest) => {
      return await api.post<User>('/users/signup', credentials)
    },
    onSuccess: data => {
      queryClient.setQueryData(['currentUser'], data)
      toast.success('Account created successfully!')
      navigate('/')
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Signup failed')
    },
  })
}

export const useSignout = () => {
  const queryClient = useQueryClient()
  const navigate = useNavigate()

  return useMutation({
    mutationFn: async () => {
      return await api.post('/users/signout')
    },
    onSuccess: () => {
      queryClient.setQueryData(['currentUser'], null)
      queryClient.clear()
      toast.success('Signed out successfully!')
      navigate('/auth/signin')
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Signout failed')
    },
  })
}

export const useCheckAuth = () => {
  return useQuery({
    queryKey: ['currentUser'],
    queryFn: async () => {
      return await api.get<User>('/users/me')
    },
    staleTime: Infinity,
    retry: false,
  })
}
