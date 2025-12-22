import { useNavigate } from 'react-router-dom'
import { Button } from './ui/button'

export default function ComingSoon() {
  const router = useNavigate()
  const goBack = () => router(-1)

  return (
    <div className='flex min-h-screen flex-col items-center justify-center px-6 text-center'>
      <h1 className='mb-4 text-4xl font-bold'>Coming Soon 🚧</h1>
      <p className='text-muted-foreground mb-6'>
        This page is under construction. We're working hard to launch it soon.
      </p>
      <Button onClick={goBack}>Go Back</Button>
    </div>
  )
}
