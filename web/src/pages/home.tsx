import { useSignout } from '@/hooks/useAuth'
import { Button } from '../components/ui/button'
import { useAuthContext } from '../contexts/AuthContext'

export default function Home() {
  const { user } = useAuthContext()
  const { mutate } = useSignout()

  const handleLogout = () => {
    mutate()
  }

  return (
    <div className='min-h-screen'>
      <nav className='shadow'>
        <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
          <div className='flex h-16 items-center justify-between'>
            <h1 className='text-xl font-semibold'>Dashboard</h1>
            <div className='flex items-center space-x-4'>
              <span className='text-sm text-gray-600'>Welcome, {user?.name}</span>
              <Button variant='outline' onClick={handleLogout}>
                Logout
              </Button>
            </div>
          </div>
        </div>
      </nav>
    </div>
  )
}
