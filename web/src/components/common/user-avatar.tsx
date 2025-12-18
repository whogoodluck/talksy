import { cn } from '@/lib/utils'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'

interface UserAvatarProps {
  avatarUrl: string | undefined
  name: string
  size?: 'xs' | 'sm' | 'md' | 'lg'
}

function UserAvatar({ avatarUrl, name, size }: UserAvatarProps) {
  const sizeConfig = {
    xs: { avatar: 'size-8', avatarFallbackText: 'text-xs' },
    sm: { avatar: 'size-10', avatarFallbackText: 'text-sm' },
    md: { avatar: 'size-12', avatarFallbackText: 'text-md' },
    lg: { avatar: 'size-14', avatarFallbackText: 'text-lg' },
  }

  const sizeClass = sizeConfig[size || 'md']

  return (
    <Avatar className={cn(sizeClass.avatar)}>
      <AvatarImage src={avatarUrl} alt={name} />
      <AvatarFallback
        className={cn('bg-foreground/5 text-foreground font-semibold', sizeClass.avatarFallbackText)}
      >
        {name.charAt(0).toUpperCase()}
      </AvatarFallback>
    </Avatar>
  )
}

export default UserAvatar
