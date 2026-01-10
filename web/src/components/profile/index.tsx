import { useGetProfile } from '@/hooks/useAuth'
import { useUpdateProfilePicture } from '@/hooks/useUsers'
import type { User } from '@/types/user'
import { AtSign, Calendar, Camera, Mail, MapPin, UserPen } from 'lucide-react'
import { useMemo, useRef, useState, type ChangeEvent } from 'react'
import { toast } from 'sonner'
import { Loader } from '../loader'
import { LoadingButton } from '../loading-button'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'
import { Button } from '../ui/button'
import EditProfile from './edit-profile'
import ProfileHeader from './profile-header'

function MyProfile() {
  const { data: user, isLoading } = useGetProfile()

  return (
    <aside className='flex h-full w-full flex-col overflow-y-auto md:w-2/7 md:border-r pb-[66px]'>
      <ProfileHeader />
      {isLoading ? (
        <div className='flex h-full items-center justify-center'>
          <Loader />
        </div>
      ) : (
        <ProfileContent user={user!} />
      )}
    </aside>
  )
}

export default MyProfile

function ProfileContent({ user }: { user: User }) {
  const [openEditProfile, setOpenEditProfile] = useState(false)
  const [imgFile, setImgFile] = useState<File | null>(null)
  const updateProfilePicture = useUpdateProfilePicture()

  const inputRef = useRef<HTMLInputElement>(null)

  const triggerImageFileInput = () => {
    if (inputRef.current) {
      inputRef.current.click()
    }
  }

  const imgUrl = useMemo(() => {
    if (imgFile) return URL.createObjectURL(imgFile)
    return user.picture
  }, [imgFile, user.picture])

  const handleSelectImage = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const maxSize = 5 * 1024 * 1024
    if (file.size > maxSize) {
      toast.error('Image size must be less than 5MB')
      return
    }

    setImgFile(file)
  }

  const handleUpdateGroupPicture = () => {
    if (!imgFile) return

    const formData = new FormData()
    formData.append('picture', imgFile)
    updateProfilePicture.mutate(formData, {
      onSuccess: () => {
        setImgFile(null)
      },
    })
  }

  return (
    <>
      {imgFile && (
        <div className='bg-accent sticky top-0 z-20 flex items-center justify-between px-4 py-2'>
          <span className='text-sm'>Save changes to group picture?</span>
          <div className='flex gap-2'>
            <Button size='sm' variant='accent' disabled={false} onClick={() => setImgFile(null)}>
              Cancel
            </Button>
            <LoadingButton
              size='sm'
              variant='default'
              isLoading={updateProfilePicture.isPending}
              onClick={handleUpdateGroupPicture}
              loadingText='Saving'
            >
              Save
            </LoadingButton>
          </div>
        </div>
      )}

      <div className='overflow-y-auto px-4'>
        <div className='flex flex-col items-center py-6 md:py-8'>
          <div className='relative'>
            <Avatar className='h-32 w-32'>
              <AvatarImage src={imgUrl || undefined} />
              <AvatarFallback className='text-5xl'>
                {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
              </AvatarFallback>
            </Avatar>
            <Button
              size='icon'
              variant='secondary'
              className='absolute right-0 bottom-0 h-8 w-8 rounded-full'
              onClick={triggerImageFileInput}
            >
              <Camera className='h-4 w-4' />
            </Button>
            <input
              type='file'
              accept='image/*'
              className='hidden'
              ref={inputRef}
              onChange={handleSelectImage}
            />
          </div>

          <div className='mt-4 text-center'>
            <h2 className='px-12 text-2xl font-semibold'>{user.name}</h2>
          </div>
          <Button variant='accent' className='mt-2' onClick={() => setOpenEditProfile(true)}>
            <UserPen className='size-5' />
            <span className='text-base'>Edit</span>
          </Button>
        </div>
        {user.bio && (
          <div className='bg-muted/50 space-y-2 rounded-lg p-4'>
            <h3 className='font-semibold text-foreground/80'>Bio</h3>
            <p className='text text-sm'>{user.bio}</p>
          </div>
        )}

        <div className='bg-muted/50 mt-2 space-y-4 rounded-lg p-4 mb-4'>
          <h3 className='mb-3 font-semibold'>Information</h3>
          {user.email && (
            <div className='flex items-center gap-3'>
              <Mail className='text-muted-foreground h-5 w-5' />
              <div className='flex flex-col'>
                <span className='text-muted-foreground text-xs'>Email</span>
                <span className='text-sm'>{user.email}</span>
              </div>
            </div>
          )}

          {user.username && (
            <div className='flex items-center gap-3'>
              <AtSign className='text-muted-foreground h-5 w-5' />
              <div className='flex flex-col'>
                <span className='text-muted-foreground text-xs'>Username</span>
                <span className='text-sm'>{user.username}</span>
              </div>
            </div>
          )}

          {user.location && (
            <div className='flex items-center gap-3'>
              <MapPin className='text-muted-foreground h-5 w-5' />
              <div className='flex flex-col'>
                <span className='text-muted-foreground text-xs'>Location</span>
                <span className='text-sm'>{user.location}</span>
              </div>
            </div>
          )}

          <div className='flex items-center gap-3'>
            <Calendar className='text-muted-foreground h-5 w-5' />
            <div className='flex flex-col'>
              <span className='text-muted-foreground text-xs'>Joined</span>
              <span className='text-sm'>
                {new Date(user.createdAt).toLocaleDateString('en-US', {
                  month: 'long',
                  year: 'numeric',
                })}
              </span>
            </div>
          </div>
        </div>
      </div>

      <EditProfile open={openEditProfile} onOpenChange={setOpenEditProfile} />
    </>
  )
}
