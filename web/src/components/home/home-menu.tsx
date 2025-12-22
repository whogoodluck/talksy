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
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { useSignout } from '@/hooks/useAuth'
import { useTheme } from '@/providers/theme-provider'
import {
  ChevronRight,
  EllipsisVertical,
  Laptop,
  LogOutIcon,
  Moon,
  Palette,
  Settings,
  Sun,
  User,
} from 'lucide-react'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { LoadingButton } from '../loading-button'

export function HomeMenu() {
  const [open, setOpen] = useState(false)
  const [showThemeOptions, setShowThemeOptions] = useState(false)
  const signout = useSignout()
  const { setTheme } = useTheme()

  const isMobile = window.innerWidth < 768

  if (isMobile) {
    return (
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button variant='ghost' size='icon' className='rounded-full'>
            <EllipsisVertical size={30} strokeWidth={3} />
          </Button>
        </SheetTrigger>
        <SheetContent side='right' className=''>
          <SheetHeader>
            <SheetTitle className='px-1'>
              Menu
            </SheetTitle>
            <SheetDescription className='hidden' />
          </SheetHeader>
          <div className='h-full flex flex-col'>
            <div className='flex-1'>
            <Link
              to='/profile'
              className='hover:bg-foreground/5 active:bg-foreground/5 flex items-center gap-4 px-6 py-3 text-lg'
            >
              <User className='size-5.5' />
              <span>Profile</span>
            </Link>
            <Link
              to='/settings'
              className='hover:bg-foreground/5 active:bg-foreground/5 flex items-center gap-4 px-6 py-3 text-lg'
            >
              <Settings className='size-5.5' />
              <span>Settings</span>
            </Link>

            <Button
              className='flex h-auto w-full items-center justify-between gap-4 rounded-none !px-6 py-3 text-lg'
              variant='ghost'
              onClick={() => setShowThemeOptions(!showThemeOptions)}
            >
              <div className='flex items-center gap-3'>
                <Palette className='size-5.5' />
                <span className='text-base'>Theme</span>
              </div>
              <ChevronRight
                className={`size-4 transition-transform ${showThemeOptions ? 'rotate-90' : ''}`}
              />
            </Button>

            {showThemeOptions && (
              <div className=''>
                <Button
                  variant='ghost'
                  className='h-10 w-full justify-start gap-3 rounded-none px-10'
                  onClick={() => {
                    setTheme('light')
                    setShowThemeOptions(false)
                  }}
                >
                  <Sun className='size-4' />
                  <span>Light</span>
                </Button>
                <Button
                  variant='ghost'
                  className='h-10 w-full justify-start gap-3 rounded-none px-10'
                  onClick={() => {
                    setTheme('dark')
                    setShowThemeOptions(false)
                  }}
                >
                  <Moon className='size-4' />
                  <span>Dark</span>
                </Button>
                <Button
                  variant='ghost'
                  className='h-10 w-full justify-start gap-3 rounded-none px-10'
                  onClick={() => {
                    setTheme('system')
                    setShowThemeOptions(false)
                  }}
                >
                  <Laptop className='size-4' />
                  <span>System</span>
                </Button>
              </div>
            )}

            

            
          </div>
          <div className='py-2 border-t'>
            <LoadingButton
              className='hover:bg-destructive/5 active:bg-destructive/5 text-destructive flex h-auto w-full items-center justify-start gap-4 rounded-none !px-6 py-3 text-lg'
              variant='ghost'
              isLoading={signout.isPending}
              onClick={() => signout.mutate()}
              disabled={signout.isPending}
            >
              <LogOutIcon className='size-5' />
              <span className='text-base'>Sign out</span>
            </LoadingButton>
          </div>
          </div>
        </SheetContent>
      </Sheet>
    )
  }

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
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
                  <Laptop className='size-4' /> System
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
