import { LoadingButton } from '@/components/loading-button'
import { PasswordInput } from '@/components/password-input'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { useSignin } from '@/hooks/useAuth'
import { signinSchema, type SigninRequest } from '@/schemas/user.schema'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { Link } from 'react-router-dom'

function Signin() {
  const signin = useSignin()

  const form = useForm<SigninRequest>({
    resolver: zodResolver(signinSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  const onSubmit = (values: SigninRequest) => {
    signin.mutate(values)
  }

  return (
    <section className='flex h-screen w-full items-center justify-center p-4'>
      <div className='w-full max-w-md space-y-6'>
        <div className='mb-12 space-y-2 text-center'>
          <h1 className='text-3xl font-bold tracking-tight'>Welcome Back</h1>
          <p className='text-muted-foreground'>Sign in to your Talksy account</p>
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
            <FormField
              control={form.control}
              name='password'
              render={({ field }) => (
                <FormItem>
                  <div className='flex items-center justify-between'>
                    <FormLabel>Password*</FormLabel>
                    <Link
                      to='/auth/forgot-password'
                      className='text-secondary text-sm font-medium underline-offset-4 hover:underline active:underline'
                    >
                      Forgot password?
                    </Link>
                  </div>
                  <FormControl>
                    <PasswordInput placeholder='Enter your password' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <LoadingButton
              type='submit'
              isLoading={signin.isPending}
              loadingText='Signing in...'
              className='w-full'
            >
              Sign in
            </LoadingButton>
          </form>
        </Form>
        <div className='text-muted-foreground text-center text-sm'>
          Don&apos;t have an account?{' '}
          <Link
            to='/auth/signup'
            className='text-secondary font-medium underline-offset-4 hover:underline active:underline'
          >
            Sign up
          </Link>
        </div>
      </div>
    </section>
  )
}

export default Signin
