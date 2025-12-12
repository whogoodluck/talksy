import { cn } from '@/lib/utils'
import { Loader2 } from 'lucide-react'

export type LoaderVariant = 'foreground' | 'background' | 'primary' | 'secondary' | 'destructive'

export type LoaderSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl'

interface LoaderProps {
  size?: LoaderSize
  variant?: LoaderVariant
  className?: string
}

export function Loader({ size = 'lg', variant = 'foreground', className }: LoaderProps) {
  return (
    <Loader2
      className={cn(
        'animate-spin stroke-[2.5]',
        size === 'xs' && 'size-3.5',
        size === 'sm' && 'size-4',
        size === 'md' && 'size-5',
        size === 'lg' && 'size-6',
        size === 'xl' && 'size-9',
        variant === 'foreground' && 'text-foreground',
        variant === 'background' && 'text-background',
        variant === 'primary' && 'text-primary',
        variant === 'secondary' && 'text-secondary',
        variant === 'destructive' && 'text-destructive',
        className
      )}
      aria-label='Loading'
      role='status'
    />
  )
}

export function FullPageLoader() {
  return (
    <div className='bg-background absolute inset-0 z-50 flex min-h-dvh items-center justify-center'>
      <Loader size='xl' />
    </div>
  )
}
