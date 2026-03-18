import { LoadingButton } from '@/components/loading-button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { useForgotPassword } from '@/hooks/useAuth'
import { forgotPasswordSchema, type ForgotPasswordRequest } from '@/schemas/user.schema'
import { zodResolver } from '@hookform/resolvers/zod'
import { ArrowLeft } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { Link } from 'react-router-dom'

function ForgotPassword() {
  const forgotPassword = useForgotPassword()

  const form = useForm<ForgotPasswordRequest>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: '',
    },
  })

  const onSubmit = (values: ForgotPasswordRequest) => {
    forgotPassword.mutate(values)
  }

  return (
    <section className='flex h-screen w-full items-center justify-center p-4'>
      <div className='w-full max-w-md space-y-6'>
        <div className='mb-12 space-y-2 text-center'>
          <h1 className='text-3xl font-bold tracking-tight'>Reset Password</h1>
          <p className='text-muted-foreground'>
            Enter your email address and we'll send you a verification code
          </p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
            <FormField
              control={form.control}
              name='email'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email*</FormLabel>
                  <FormControl>
                    <Input type='email' placeholder='Enter your email' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <LoadingButton
              type='submit'
              isLoading={forgotPassword.isPending}
              loadingText='Sending code...'
              className='w-full'
            >
              Send Reset Code
            </LoadingButton>
          </form>
        </Form>

        <div className='text-center'>
          <Link
            to='/auth/signin'
            className='text-secondary inline-flex items-center gap-2 text-sm font-medium underline-offset-4 hover:underline active:underline'
          >
            <ArrowLeft className='h-4 w-4' />
            Back to Sign In
          </Link>
        </div>

        <div className='border-border bg-muted/50 rounded-lg border p-4'>
          <p className='text-muted-foreground text-xs'>
            <strong>Note:</strong> The verification code will be sent to your registered email
            address and will expire in 10 minutes.
          </p>
        </div>
      </div>
    </section>
  )
}

export default ForgotPassword
