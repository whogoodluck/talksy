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
import { PasswordInput } from '@/components/ui/password-input'
import { useSignup } from '@/hooks/useAuth'
import { signupSchema, type SignupRequest } from '@/schemas/user.schema'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { Link } from 'react-router-dom'

function Signup() {
  const signup = useSignup()

  const form = useForm<SignupRequest>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
    },
  })

  const onSubmit = (values: SignupRequest) => {
    signup.mutate(values)
  }

  return (
    <section className='flex h-screen w-full flex-1 items-center justify-center p-4'>
      <div className='w-full max-w-md space-y-6'>
        <div className='mb-12 space-y-2 text-center'>
          <h1 className='text-3xl font-bold tracking-tight'>Welcome to Talksy</h1>
          <p className='text-muted-foreground'>Create your account to get started</p>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
            <FormField
              control={form.control}
              name='name'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name*</FormLabel>
                  <FormControl>
                    <Input placeholder='Enter your name' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
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
                  <FormLabel>Password*</FormLabel>
                  <FormControl>
                    <PasswordInput placeholder='Enter your password' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <LoadingButton
              type='submit'
              isLoading={signup.isPending}
              loadingText='Signing up...'
              className='w-full'
            >
              Sign up
            </LoadingButton>
          </form>
        </Form>
        <div className='text-muted-foreground text-center text-sm'>
          Already have an account?{' '}
          <Link
            to='/auth/signin'
            className='text-secondary font-medium underline-offset-4 hover:underline active:underline'
          >
            Sign in
          </Link>
        </div>
      </div>
    </section>
  )
}

export default Signup
