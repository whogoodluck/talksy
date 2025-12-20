import { cn } from '@/lib/utils'
import { type ElementType } from 'react'
import { Button } from './ui/button'

interface FileCallbackProps {
  icon: ElementType
  title: string
  description?: string
  className?: string
  onAction?: () => void
  actionLabel?: string
  actionIcon?: ElementType
}

function FallbackState({
  icon: Icon,
  title,
  description,
  className,
  onAction,
  actionLabel,
  actionIcon: ActionIcon,
}: FileCallbackProps) {
  return (
    <div className={cn('flex w-full flex-col items-center justify-center text-center', className)}>
      <Icon className='size-16' />
      <h1 className='mt-4 text-xl font-bold tracking-tight md:text-2xl'>{title}</h1>
      {description && <p className='text-muted-foreground mt-2 max-w-lg'>{description}</p>}
      {onAction && actionLabel && (
        <Button onClick={onAction} className='mt-6'>
          {ActionIcon && <ActionIcon className='size-4' />} {actionLabel}
        </Button>
      )}
    </div>
  )
}

export default FallbackState
