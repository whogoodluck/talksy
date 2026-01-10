import { useIsMobile } from '@/hooks/useMediaQuery'
import { ArrowLeft } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { Button } from '../ui/button'

function ProfileHeader() {
  const { isMobile } = useIsMobile()
  const navigate = useNavigate()

  return (
    <header className='bg-background flex w-full items-center justify-between p-4'>
      <div className='flex items-center space-x-1'>
        {isMobile && (
          <Button variant='ghost' size='icon' className='rounded-full' onClick={() => navigate(-1)}>
            <ArrowLeft size={30} strokeWidth={3} />
          </Button>
        )}
        <span className='text-xl'>Profile</span>
      </div>
    </header>
  )
}

export default ProfileHeader
