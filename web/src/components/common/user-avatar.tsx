import { FALLBACK_USER_AVATAR_LIGHT } from '@/constants'
import { cn } from '@/lib/utils'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'

interface UserAvatarProps {
  picture: string | undefined
  name: string
  size?: 'xs' | 'sm' | 'md' | 'lg'
}

function UserAvatar({ picture, name, size }: UserAvatarProps) {
  const sizeConfig = {
    xs: 'size-8',
    sm: 'size-10',
    md: 'size-12',
    lg: 'size-14',
  }

  const sizeClass = sizeConfig[size || 'md']

  return (
    <Avatar className={cn(sizeClass)}>
      <AvatarImage src={picture ? picture : undefined} alt={name} />
      <AvatarFallback className={cn(sizeClass)}>
        <img src={FALLBACK_USER_AVATAR_LIGHT} alt={name} />
      </AvatarFallback>
    </Avatar>
  )
}

export default UserAvatar
