import { cn } from '@/lib/utils'
import type { User } from '@/types/user'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'

interface UserAvatarProps {
  user: Partial<User>
  size?: 'xs' | 'sm' | 'md' | 'lg'
  className?: string
}

function UserAvatar({ user, size, className }: UserAvatarProps) {
  const { picture, name = 'Unknown' } = user

  const sizeConfig = {
    xs: { avatar: 'size-8', avatarFallbackText: 'text-xs' },
    sm: { avatar: 'size-10', avatarFallbackText: 'text-sm' },
    md: { avatar: 'size-12', avatarFallbackText: 'text-md' },
    lg: { avatar: 'size-14', avatarFallbackText: 'text-lg' },
  }

  const sizeClass = sizeConfig[size || 'md']

  return (
    <Avatar className={cn(className, sizeClass.avatar)}>
      <AvatarImage src={picture} alt={name} />
      <AvatarFallback className={cn('bg-foreground/5 font-semibold', sizeClass.avatarFallbackText)}>
        {name.charAt(0).toUpperCase()}
      </AvatarFallback>
    </Avatar>
  )
}

export default UserAvatar
