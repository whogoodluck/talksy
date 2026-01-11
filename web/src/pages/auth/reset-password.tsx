import { LoadingButton } from '@/components/loading-button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { PasswordInput } from '@/components/ui/password-input'
import { useResetPassword } from '@/hooks/useAuth'
import { resetPasswordSchema, type ResetPasswordRequest } from '@/schemas/user.schema'
import { zodResolver } from '@hookform/resolvers/zod'
import { Check } from 'lucide-react'
import { useEffect, useMemo } from 'react'
import { useForm } from 'react-hook-form'
import { useLocation, useNavigate } from 'react-router-dom'

function ResetPassword() {
  const { state } = useLocation()
  const navigate = useNavigate()
  const resetPassword = useResetPassword()

  const email = state?.email
  const code = state?.code

  useEffect(() => {
    if (!email || !code) {
      navigate('/auth/forgot-password', { replace: true })
    }
  }, [email, code, navigate])

  const form = useForm<ResetPasswordRequest>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      email: email || '',
      code: code || '',
      password: '',
      confirmPassword: '',
    },
  })

  const password = form.watch('password')

  const passwordStrength = useMemo(() => {
    const checks = {
      length: password.length >= 6,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /[0-9]/.test(password),
      special: /[^A-Za-z0-9]/.test(password),
    }

    const strength = Object.values(checks).filter(Boolean).length
    return { checks, strength }
  }, [password])

  const onSubmit = (values: ResetPasswordRequest) => {
    resetPassword.mutate(values)
  }

  return (
    <section className='flex h-screen w-full items-center justify-center p-4'>
      <div className='w-full max-w-md space-y-6'>
        <div className='mb-12 space-y-2 text-center'>
          <h1 className='text-3xl font-bold tracking-tight'>Create New Password</h1>
          <p className='text-muted-foreground'>
            Enter a strong password for your account
          </p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
            <FormField
              control={form.control}
              name='password'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>New Password*</FormLabel>
                  <FormControl>
                    <PasswordInput placeholder='Enter new password' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {password && (
              <div className='border-border bg-muted/50 space-y-2 rounded-lg border p-4'>
                <p className='text-sm font-medium'>Password Requirements:</p>
                <ul className='space-y-1 text-xs'>
                  <li className='flex items-center gap-2'>
                    <Check
                      className={`h-3 w-3 ${passwordStrength.checks.length ? 'text-green-600' : 'text-muted-foreground'}`}
                    />
                    <span className={passwordStrength.checks.length ? 'text-green-600' : 'text-muted-foreground'}>
                      At least 6 characters
                    </span>
                  </li>
                  <li className='flex items-center gap-2'>
                    <Check
                      className={`h-3 w-3 ${passwordStrength.checks.uppercase ? 'text-green-600' : 'text-muted-foreground'}`}
                    />
                    <span className={passwordStrength.checks.uppercase ? 'text-green-600' : 'text-muted-foreground'}>
                      One uppercase letter
                    </span>
                  </li>
                  <li className='flex items-center gap-2'>
                    <Check
                      className={`h-3 w-3 ${passwordStrength.checks.lowercase ? 'text-green-600' : 'text-muted-foreground'}`}
                    />
                    <span className={passwordStrength.checks.lowercase ? 'text-green-600' : 'text-muted-foreground'}>
                      One lowercase letter
                    </span>
                  </li>
                  <li className='flex items-center gap-2'>
                    <Check
                      className={`h-3 w-3 ${passwordStrength.checks.number ? 'text-green-600' : 'text-muted-foreground'}`}
                    />
                    <span className={passwordStrength.checks.number ? 'text-green-600' : 'text-muted-foreground'}>
                      One number
                    </span>
                  </li>
                  <li className='flex items-center gap-2'>
                    <Check
                      className={`h-3 w-3 ${passwordStrength.checks.special ? 'text-green-600' : 'text-muted-foreground'}`}
                    />
                    <span className={passwordStrength.checks.special ? 'text-green-600' : 'text-muted-foreground'}>
                      One special character
                    </span>
                  </li>
                </ul>
              </div>
            )}

            <FormField
              control={form.control}
              name='confirmPassword'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm Password*</FormLabel>
                  <FormControl>
                    <PasswordInput placeholder='Confirm new password' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <LoadingButton
              type='submit'
              isLoading={resetPassword.isPending}
              disabled={!email || !code}
              loadingText='Resetting password...'
              className='w-full'
            >
              Reset Password
            </LoadingButton>
          </form>
        </Form>
      </div>
    </section>
  )
}

export default ResetPassword