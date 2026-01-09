import UserAvatar from '@/components/common/user-avatar'
import { buttonVariants } from '@/components/ui/button'
import { PROTECTED_LINKS } from '@/constants'
import { useGetProfile } from '@/hooks/useAuth'
import { cn } from '@/lib/utils'
import { Link, Outlet, useLocation } from 'react-router-dom'

function NavigationLayout() {
  const profile = useGetProfile()
  const { pathname } = useLocation()

  return (
    <main className='flex h-screen'>
      <div className='md:bg-foreground/5 bg-background fixed bottom-0 z-10 flex w-full items-center gap-6 px-2 md:relative md:h-full md:w-16 md:flex-col md:gap-2 md:border-r md:px-1 md:py-4'>
        {PROTECTED_LINKS.map(link => (
          <Link
            className='flex w-1/4 flex-col justify-center gap-1 md:w-full'
            key={link.name}
            to={link.href}
          >
            <div
              className={cn(
                'w-full',
                buttonVariants({ variant: 'ghost', size: 'sm', className: 'rounded-full' }),
                {
                  'bg-secondary/5 text-secondary': pathname === link.href,
                }
              )}
            >
              <link.icon className='size-5' />
            </div>
            <span className='text-center text-sm md:hidden'>{link.name}</span>
          </Link>
        ))}
        <Link
          className='bottom-4 flex w-1/4 flex-col justify-center gap-1 p-1 md:absolute md:w-full'
          to={'/profile'}
        >
          <div
            className={cn(
              'w-full',
              buttonVariants({ variant: 'ghost', size: 'sm', className: 'rounded-full' }),
              {
                'bg-secondary/5 text-secondary': pathname === '/profile',
              }
            )}
          >
            <UserAvatar
              size='xs'
              user={profile.data!}
              className={cn({ 'text-secondary': pathname === '/profile' })}
            />
          </div>
          <span className='text-center text-sm md:hidden'>Profile</span>
        </Link>
      </div>
      <div className='w-full'>
        <Outlet />
      </div>
    </main>
  )
}

export default NavigationLayout
