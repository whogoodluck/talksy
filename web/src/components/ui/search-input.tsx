import { cn } from '@/lib/utils'
import { SearchIcon, XIcon } from 'lucide-react'
import { forwardRef } from 'react'
import { Button } from '../ui/button'
import { Input } from '../ui/input'

interface SearchInputProps {
  value: string
  onChange: (value: string) => void
  onClear?: () => void
  placeholder?: string
  className?: string
  autoFocus?: boolean
}

const SearchInput = forwardRef<HTMLInputElement, SearchInputProps>(
  ({ value, onChange, onClear, placeholder = 'Search', className, autoFocus }, ref) => {
    const handleClear = () => {
      onChange('')
      onClear?.()
    }

    return (
      <div className={cn('relative flex items-center', className)}>
        <SearchIcon className='text-muted-foreground absolute left-5 z-10 size-5' size={20} />
        <Input
          ref={ref}
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder={placeholder}
          className={cn(
            'px-12',
            'focus-visible:border-border focus-visible:bordr focus-visible:ring-0'
          )}
          autoFocus={autoFocus}
        />
        {value && (
          <Button
            type='button'
            variant='ghost'
            size='icon'
            className='text-muted-foreground hover:text-foreground active:text-foreground absolute top-1/2 right-2 size-9 -translate-y-1/2'
            onClick={handleClear}
            tabIndex={-1}
          >
            <XIcon className='size-4' />
          </Button>
        )}
      </div>
    )
  }
)

export { SearchInput }
