import { useIsMobile } from '@/hooks/useMediaQuery'
import { ArrowLeft, X } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { Button } from '../ui/button'

function InfoHeader() {
  const { isMobile } = useIsMobile()
  const navigate = useNavigate()

  return (
    <header className='bg-background flex h-16 w-full items-center justify-between border-b p-2 md:h-20 md:p-4'>
      <div className='flex items-center space-x-1'>
        <Button variant='ghost' size='icon' className='rounded-full' onClick={() => navigate(-1)}>
          {isMobile ? <ArrowLeft size={30} strokeWidth={3} /> : <X size={30} strokeWidth={3} />}
        </Button>
        <span>Group</span>
      </div>
    </header>
  )
}

export default InfoHeader
