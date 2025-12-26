import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Eye, EyeOff } from 'lucide-react'
import * as React from 'react'

export const PasswordInput = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement>
>((props, ref) => {
  const [showPassword, setShowPassword] = React.useState(false)
  return (
    <div className='relative'>
      <Input type={showPassword ? 'text' : 'password'} className='pr-12' ref={ref} {...props} />
      <Button
        type='button'
        variant='ghost'
        size='icon'
        className='absolute top-1/2 right-1 size-8 -translate-y-1/2 rounded-full'
        onClick={() => setShowPassword(prev => !prev)}
        tabIndex={-1}
      >
        {showPassword ? <EyeOff className='size-4' /> : <Eye className='size-4' />}
      </Button>
    </div>
  )
})
PasswordInput.displayName = 'PasswordInput'
