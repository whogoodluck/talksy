import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useSignout } from '@/hooks/useAuth'
import { useTheme } from '@/providers/theme-provider'
import {
  EllipsisVertical,
  LogOutIcon,
  Moon,
  Palette,
  Settings,
  Sun,
  SunMoon,
  User,
} from 'lucide-react'

export function HomeMenu() {
  const signout = useSignout()
  const { setTheme } = useTheme()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild className=''>
        <Button variant='ghost' size='icon' className='rounded-full'>
          <EllipsisVertical size={30} strokeWidth={3} />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className='w-56' align='start'>
        <DropdownMenuGroup>
          <DropdownMenuItem>
            <User className='size-4' /> Profile
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Settings className='size-4' /> Settings
          </DropdownMenuItem>
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>
              <Palette className='size-4' /> Theme
            </DropdownMenuSubTrigger>
            <DropdownMenuPortal>
              <DropdownMenuSubContent>
                <DropdownMenuItem onClick={() => setTheme('light')}>
                  <Sun className='size-4' /> Light
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme('dark')}>
                  <Moon className='size-4' /> Dark
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme('system')}>
                  <SunMoon className='size-4' /> System
                </DropdownMenuItem>
              </DropdownMenuSubContent>
            </DropdownMenuPortal>
          </DropdownMenuSub>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => signout.mutate()} disabled={signout.isPending}>
          <LogOutIcon className='text-destructive size-4' /> Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
