import { useGetProfile } from '@/hooks/useAuth'
import {
  useDeleteConversation,
  useGetDirectConversationByOtherUserId,
} from '@/hooks/useConversations'
import { useGetUserByUsername } from '@/hooks/useUsers'
import { useConversationContext } from '@/providers/conversation.provider'
import type { User } from '@/types/user'
import { AtSign, Calendar, Mail, MapPin, Trash2 } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Loader } from '../loader'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'
import { Button } from '../ui/button'
import { ConfirmAlertDialog } from '../ui/confirm-alert-dialog'
import UserInfoHeader from './user-info-header'

function UserInfoDetail({ username }: { username: string }) {
  const { data: currentUser } = useGetProfile()
  const { data: user, isLoading } = useGetUserByUsername(username)
  const navigate = useNavigate()

  useEffect(() => {
    if (currentUser?.id === user?.id) {
      navigate('/profile')
    }
  }, [currentUser?.id, user?.id, navigate])

  return (
    <div className='bg-background relative z-10 flex h-screen flex-col'>
      <UserInfoHeader />
      {isLoading ? (
        <div className='flex h-full items-center justify-center'>
          <Loader />
        </div>
      ) : (
        <ProfileContent user={user!} />
      )}
    </div>
  )
}

export default UserInfoDetail

function ProfileContent({ user }: { user: User }) {
  const [showDeleteChatAlert, setShowDeleteChatAlert] = useState(false)
  const { setSelectedConversation } = useConversationContext()
  const { data: conversation } = useGetDirectConversationByOtherUserId(user.id)
  const deleteChat = useDeleteConversation(conversation?.id!)

  const navigate = useNavigate()

  const handleDeleteChat = () => {
    deleteChat.mutate(undefined, {
      onSuccess: () => {
        navigate('/')
        setShowDeleteChatAlert(false)
        setSelectedConversation(null)
      },
    })
  }

  return (
    <>
      <div className='overflow-y-auto px-4'>
        <div className='flex flex-col items-center py-6 md:py-8'>
          <div className=''>
            <Avatar className='h-32 w-32'>
              <AvatarImage src={user.picture} />
              <AvatarFallback className='text-5xl'>
                {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
              </AvatarFallback>
            </Avatar>
          </div>

          <div className='mt-4 w-full text-center'>
            <div className='flex w-full items-center justify-center gap-2'>
              <h2 className='px-12 text-2xl font-semibold'>{user.name}</h2>
            </div>
            {user.isOnline && <span className='text-secondary'>Online</span>}
          </div>
        </div>

        {user.bio && (
          <div className='bg-muted/50 space-y-2 rounded-lg p-4'>
            <h3 className='font-semibold text-foreground/80'>Bio</h3>
            <p className='text text-sm'>{user.bio}</p>
          </div>
        )}

        <div className='bg-muted/50 mt-2 space-y-4 rounded-lg p-4'>
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

          {!user.isOnline && user.lastSeen && (
            <div className='flex items-center gap-3'>
              <div className='size-5' />
              <div className='flex flex-col'>
                <span className='text-muted-foreground text-xs'>Last seen</span>
                <span className='text-sm'>
                  {new Date(user.lastSeen).toLocaleString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    hour: 'numeric',
                    minute: '2-digit',
                  })}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

      {!!conversation && (
        <>
          <div className='mt-4 space-y-0.5'>
            <Button
              className='hover:bg-destructive/5 text-destructive flex h-auto w-full items-center justify-start gap-4 rounded-none p-4 text-lg'
              variant='ghost'
              onClick={() => setShowDeleteChatAlert(true)}
            >
              <Trash2 className='size-5' />
              <span className='text-base'>Delete contact</span>
            </Button>
          </div>

          <ConfirmAlertDialog
            open={showDeleteChatAlert}
            onOpenChange={setShowDeleteChatAlert}
            icon={<Trash2 />}
            title='Delete contact?'
            description='Are you sure you want to delete this contact? This action cannot be undone.'
            isLoading={deleteChat.isPending}
            loadingText='Deleting...'
            confirmText='Delete'
            onConfirm={handleDeleteChat}
          />
        </>
      )}
    </>
  )
}
