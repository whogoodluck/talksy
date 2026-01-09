import { Sheet, SheetContent, SheetDescription, SheetTitle } from '@/components/ui/sheet'
import UserProfile from '@/components/user-profile'
import { useIsMobile } from '@/hooks/useMediaQuery'
import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

function UserProfilePage() {
  const { username } = useParams<{ username: string }>()
  const { isMobile } = useIsMobile()
  const [isOpenSheet, setIsOpenSheet] = useState(true)
  const navigate = useNavigate()

  if (isMobile) {
    return <UserProfile username={username!} />
  }

  return (
    <Sheet
      open={isOpenSheet}
      onOpenChange={() => {
        ;(setIsOpenSheet(!isOpenSheet), navigate(-1))
      }}
    >
      <SheetContent className='min-w-xl'>
        <SheetTitle className='hidden' />
        <SheetDescription className='hidden' />
        <UserProfile username={username!} />
      </SheetContent>
    </Sheet>
  )
}

export default UserProfilePage
