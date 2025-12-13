import { LoadingButton } from '@/components/loading-button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp'
import { useResendEmailVerification, useVerifyEmail } from '@/hooks/useAuth'
import { cn, getFormattedDuration } from '@/lib/utils'
import { verifyEmailSchema, type VerifyEmailRequest } from '@/schemas/user.schema'
import { zodResolver } from '@hookform/resolvers/zod'
import { REGEXP_ONLY_DIGITS } from 'input-otp'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { Link, useLocation, useNavigate } from 'react-router-dom'

function VerifyEmail() {
  const { state } = useLocation()
  const navigate = useNavigate()
  const verifyEmail = useVerifyEmail()
  const resendEmailVerification = useResendEmailVerification()

  const [countdown, setCountdown] = useState(60)
  const [canResend, setCanResend] = useState(false)

  const email = state?.email

  useEffect(() => {
    if (!email) {
      navigate('/auth/signup', { replace: true })
    }
  }, [email, navigate])

  useEffect(() => {
    if (countdown > 0 && !canResend) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000)
      return () => clearTimeout(timer)
    } else if (countdown === 0) {
      setCanResend(true)
    }
  }, [countdown, canResend])

  const form = useForm<VerifyEmailRequest>({
    resolver: zodResolver(verifyEmailSchema),
    defaultValues: {
      email: email || '',
      code: '',
    },
  })

  const onSubmit = (values: VerifyEmailRequest) => {
    setCanResend(true)
    setCountdown(60)
    verifyEmail.mutate(values)
  }

  const handleResendEmail = () => {
    if (!email) return
    resendEmailVerification.mutate(email, {
      onSuccess: () => {
        setCountdown(60)
        setCanResend(false)
        form.setValue('code', '')
      },
    })
  }

  return (
    <section className='flex h-screen w-full flex-1 items-center justify-center p-2'>
      <div className='w-full max-w-md space-y-6'>
        <div className='mb-12 space-y-2 text-center'>
          <h1 className='text-3xl font-bold tracking-tight'>Verify Email</h1>
          <p className='text-muted-foreground'>Enter the verification code sent to your email</p>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
            <FormField
              control={form.control}
              name='code'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Verification Code*</FormLabel>
                  <FormControl>
                    <InputOTP
                      containerClassName='flex w-full justify-between mt-1'
                      maxLength={6}
                      autoFocus
                      pattern={REGEXP_ONLY_DIGITS}
                      {...field}
                    >
                      <InputOTPGroup>
                        <InputOTPSlot className='px-6 py-5' index={0} />
                      </InputOTPGroup>
                      <InputOTPGroup>
                        <InputOTPSlot className='px-6 py-5' index={1} />
                      </InputOTPGroup>
                      <InputOTPGroup>
                        <InputOTPSlot className='px-6 py-5' index={2} />
                      </InputOTPGroup>
                      <InputOTPGroup>
                        <InputOTPSlot className='px-6 py-5' index={3} />
                      </InputOTPGroup>
                      <InputOTPGroup>
                        <InputOTPSlot className='px-6 py-5' index={4} />
                      </InputOTPGroup>
                      <InputOTPGroup>
                        <InputOTPSlot className='px-6 py-5' index={5} />
                      </InputOTPGroup>
                    </InputOTP>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <LoadingButton
              type='submit'
              isLoading={verifyEmail.isPending}
              disabled={!email}
              loadingText='Verifying...'
              className='w-full'
            >
              Verify
            </LoadingButton>
          </form>
        </Form>

        <div className='text-muted-foreground space-y-2 text-center text-sm'>
          <div>
            Didn't receive the code?{' '}
            {canResend ? (
              <button
                onClick={handleResendEmail}
                disabled={resendEmailVerification.isPending}
                className={cn(
                  'text-secondary cursor-pointer font-medium underline-offset-4',
                  'hover:underline active:underline',
                  'disabled:no-underline disabled:opacity-50'
                )}
              >
                Resend
              </button>
            ) : (
              <span className='text-foreground font-medium'>
                Resend in {getFormattedDuration(countdown)}
              </span>
            )}
          </div>
          <div>
            Wrong email?{' '}
            <Link
              to='/auth/signup'
              className='text-secondary font-medium underline-offset-4 hover:underline active:underline'
            >
              Go back
            </Link>
          </div>
        </div>

        <div className='border-border bg-muted/50 rounded-lg border p-4'>
          <p className='text-muted-foreground text-xs'>
            <strong>Tips:</strong> Check your spam folder if you don't see the email. The code
            expires in 10 minutes.
          </p>
        </div>
      </div>
    </section>
  )
}

export default VerifyEmail
