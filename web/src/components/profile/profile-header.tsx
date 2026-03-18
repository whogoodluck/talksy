import { useIsMobile } from '@/hooks/useMediaQuery'
import { ArrowLeft } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { Button } from '../ui/button'

function ProfileHeader() {
  const { isMobile } = useIsMobile()
  const navigate = useNavigate()

  if (!isMobile) return <div className='h-16' />

  return (
    <header className='bg-background flex h-16 w-full items-center justify-between border-b p-2 md:h-20 md:p-4'>
      <div className='flex items-center space-x-1'>
        <Button variant='ghost' size='icon' className='rounded-full' onClick={() => navigate(-1)}>
          <ArrowLeft size={30} strokeWidth={3} />
        </Button>
        <span>Profile</span>
      </div>
    </header>
  )
}

export default ProfileHeader
