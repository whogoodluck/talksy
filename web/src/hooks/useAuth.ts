import type { SigninRequest, SignupRequest, VerifyEmailRequest } from '@/schemas/user.schema'
import type { User } from '@/types/user'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { api } from '../lib/api'

export const useSignup = () => {
  const navigate = useNavigate()

  return useMutation({
    mutationFn: async (newUserData: SignupRequest) => {
      return await api.post<User>('/users/signup', newUserData)
    },
    onSuccess: data => {
      toast.success(data.message)
      navigate('/auth/verify-email', { state: { email: data.data.email } })
    },
    onError: (error: Error) => {
      toast.error(error.message)
    },
  })
}

export const useVerifyEmail = () => {
  const queryClient = useQueryClient()
  const navigate = useNavigate()

  return useMutation({
    mutationFn: async (verifyEmailData: VerifyEmailRequest) => {
      return await api.post<User>('/users/verify-email', verifyEmailData)
    },
    onSuccess: data => {
      queryClient.setQueryData(['profile'], data)
      toast.success(data.message)
      navigate('/')
    },
    onError: (error: Error) => {
      toast.error(error.message)
    },
  })
}

export const useResendEmailVerification = () => {
  return useMutation({
    mutationFn: async (email: string) => {
      return await api.post('/users/resend-email-verification-code', { email })
    },
    onSuccess: data => {
      toast.success(data.message)
    },
    onError: (error: Error) => {
      toast.error(error.message)
    },
  })
}

export const useSignin = () => {
  const queryClient = useQueryClient()
  const navigate = useNavigate()

  return useMutation({
    mutationFn: async (credentials: SigninRequest) => {
      return await api.post<User>('/users/signin', credentials)
    },
    onSuccess: data => {
      queryClient.setQueryData(['profile'], data)
      toast.success(data.message)
      navigate('/')
    },
    onError: (error: Error) => {
      toast.error(error.message)
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
    onSuccess: data => {
      queryClient.setQueryData(['profile'], null)
      queryClient.clear()
      toast.success(data.message)
      navigate('/auth/signin')
    },
    onError: (error: Error) => {
      toast.error(error.message)
    },
  })
}

export const useGetProfile = () => {
  return useQuery({
    queryKey: ['profile'],
    queryFn: async () => {
      const res = await api.get<User>('/users/me')

      return res.data
    },
    staleTime: Infinity,
    retry: false,
  })
}
