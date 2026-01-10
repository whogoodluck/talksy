import MyProfile from '@/components/profile'
import { User } from 'lucide-react'

function Profile() {
  return (
    <div className='flex h-full'>
      <MyProfile />
      <div className='hidden flex-1 flex-col items-center justify-center gap-4 md:flex'>
        <div>
          <User className='size-16' />
        </div>
        <h1 className='text-3xl'>Profile</h1>
      </div>
    </div>
  )
}

export default Profile
