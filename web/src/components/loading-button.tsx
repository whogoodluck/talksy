import { Button } from '@/components/ui/button'
import { Loader, type LoaderSize, type LoaderVariant } from './loader'

interface LoadingButtonProps extends React.ComponentProps<typeof Button> {
  isLoading: boolean
  loadingText?: string
  loaderVariant?: LoaderVariant
  loaderSize?: LoaderSize
  icon?: React.ReactNode
}

export function LoadingButton({
  isLoading,
  children,
  loaderVariant = 'background',
  loaderSize = 'sm',
  loadingText,
  icon,
  ...props
}: LoadingButtonProps) {
  return (
    <Button {...props} disabled={isLoading || props.disabled}>
      {isLoading ? <Loader variant={loaderVariant} size={loaderSize} /> : icon}
      {loadingText && isLoading ? loadingText : children}
    </Button>
  )
}
