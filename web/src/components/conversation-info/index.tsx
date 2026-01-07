import UserAvatar from '@/components/common/user-avatar'
import { LoadingButton } from '@/components/loading-button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useGetProfile } from '@/hooks/useAuth'
import {
  useDeleteGroup,
  useLeaveGroup,
  useMakeParticipantAdmin,
  useRemoveParticipant,
  useRemoveParticipantFromAdmin,
  useUpdateGroupPicture,
} from '@/hooks/useGroupConversations'
import { useConversationContext } from '@/providers/conversation.provider'
import { ParticipantRoleEnum, type Conversation } from '@/types/conversation'
import {
  Camera,
  ChessQueen,
  CircleMinus,
  Crown,
  Edit2,
  LogOut,
  LogOutIcon,
  MoreVertical,
  Trash2,
  UserPlus,
  Users,
  X,
} from 'lucide-react'
import { useMemo, useRef, useState, type ChangeEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import DeleteAlertDialog from '../ui/delete-alert-dialog'
import EditGroup from './edit-group'

function ConversationInfo({ conversation }: { conversation: Conversation }) {
  const { setSelectedConversation } = useConversationContext()
  const navigate = useNavigate()
  const [openEditGroupDialog, setOpenEditGroupDialog] = useState(false)
  const [showRemoveParticipantAlert, setShowRemoveParticipantAlert] = useState(false)
  const [showMakeGroupAdminAlert, setShowMakeGroupAdminAlert] = useState(false)
  const [showRemoveFromGroupAdminAlert, setShowRemoveFromGroupAdminAlert] = useState(false)
  const [showLeaveGroupAlert, setShowLeaveGroupAlert] = useState(false)
  const [showDeleteGroupAlert, setShowDeleteGroupAlert] = useState(false)
  const [formAction, setFormAction] = useState<'EDIT_NAME' | 'ADD_MEMBER' | null>(null)
  const { data: profile } = useGetProfile()
  const [imgFile, setImgFile] = useState<File | null>(null)
  const updateGroupPicture = useUpdateGroupPicture(conversation.id)
  const removeParticipant = useRemoveParticipant(conversation.id)
  const makeParticipantAdmin = useMakeParticipantAdmin(conversation.id)
  const removeFromAdmin = useRemoveParticipantFromAdmin(conversation.id)
  const leaveGroup = useLeaveGroup()
  const deleteGroup = useDeleteGroup()

  const currentUserParticipant = conversation?.participants.find(p => p.userId === profile?.id)
  const isCreator = currentUserParticipant?.role === ParticipantRoleEnum.CREATOR
  const isAdmin = isCreator || currentUserParticipant?.role === ParticipantRoleEnum.ADMIN

  const inputRef = useRef<HTMLInputElement>(null)

  const triggerImageFileInput = () => {
    if (inputRef.current) {
      inputRef.current.click()
    }
  }

  const imgUrl = useMemo(() => {
    if (imgFile) return URL.createObjectURL(imgFile)
    return conversation.picture
  }, [imgFile, conversation.picture])

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
    updateGroupPicture.mutate(formData, {
      onSuccess: () => {
        setImgFile(null)
      },
    })
  }

  const handleRemoveParticipant = (userId: string) => {
    removeParticipant.mutate(userId, {
      onSuccess: () => {
        setShowRemoveParticipantAlert(false)
      },
    })
  }

  const handleMakeParticipantAdmin = (userId: string) => {
    makeParticipantAdmin.mutate(userId, {
      onSuccess: () => {
        setShowMakeGroupAdminAlert(false)
      },
    })
  }

  const handleRemoveFromGroupAdmin = (userId: string) => {
    removeFromAdmin.mutate(userId, {
      onSuccess: () => {
        setShowRemoveFromGroupAdminAlert(false)
      },
    })
  }

  const handleLeaveGroup = () => {
    leaveGroup.mutate(conversation.id, {
      onSuccess: () => {
        setShowLeaveGroupAlert(false)
      },
    })
  }

  const handleDeleteGroup = () => {
    deleteGroup.mutate(conversation.id, {
      onSuccess: () => {
        setShowDeleteGroupAlert(false)
        setSelectedConversation(null)
        navigate('/')
      },
    })
  }

  return (
    <div className='bg-background relative z-10 flex h-screen flex-col'>
      <header className='bg-background flex h-16 w-full items-center justify-between border-b p-2 md:h-20 md:p-4'>
        <div className='flex items-center space-x-1'>
          <Button variant='ghost' size='icon' className='rounded-full' onClick={() => navigate(-1)}>
            <X size={30} strokeWidth={3} />
          </Button>
          <span>Group</span>
        </div>
      </header>
      {imgFile && isAdmin && (
        <div className='bg-accent sticky top-0 z-20 flex items-center justify-between px-4 py-2'>
          <span className='text-sm'>Save changes to group picture?</span>
          <div className='flex gap-2'>
            <Button size='sm' variant='accent' disabled={updateGroupPicture.isPending} onClick={() => setImgFile(null)}>
              Cancel
            </Button>
            <LoadingButton
              size='sm'
              variant='default'
              isLoading={updateGroupPicture.isPending}
              onClick={handleUpdateGroupPicture}
              loadingText='Saving'
            >
              Save
            </LoadingButton>
          </div>
        </div>
      )}

      <div className='overflow-y-auto px-4'>
        <div className='flex flex-col items-center py-4 md:py-8'>
          <div className='relative'>
            <Avatar className='h-32 w-32'>
              <AvatarImage src={imgUrl || undefined} />
              <AvatarFallback className='text-5xl'>
                {conversation.name ? conversation.name.charAt(0).toUpperCase() : 'G'}
              </AvatarFallback>
            </Avatar>
            {isAdmin && (
              <Button
                size='icon'
                variant='secondary'
                className='absolute right-0 bottom-0 h-8 w-8 rounded-full'
                onClick={triggerImageFileInput}
              >
                <Camera className='h-4 w-4' />
              </Button>
            )}
            <input
              type='file'
              accept='image/*'
              className='hidden'
              ref={inputRef}
              onChange={handleSelectImage}
            />
          </div>

          <div className='mt-4 text-center w-full'>
            <div className='flex relative items-center justify-center gap-2 w-full'>
              <h2 className='text-2xl font-semibold px-12'>{conversation.name}</h2>
              {isAdmin && (
                <Button
                  variant='ghost'
                  size='icon'
                  className='rounded-full absolute right-0 top-0'
                  onClick={() => {
                    setFormAction('EDIT_NAME')
                    setOpenEditGroupDialog(true)
                  }}
                >
                  <Edit2 />
                </Button>
              )}
            </div>
            <p className='text-muted-foreground'>
              Group • {conversation.participants.length} members
            </p>
          </div>
        </div>

        <div className='bg-muted/50 rounded-lg p-4'>
          <div className='mb-4 flex items-center gap-2'>
            <Users className='text-muted-foreground h-5 w-5' />
            <h3 className='font-semibold'>{conversation.participants.length} Participants</h3>
          </div>

          <div className='space-y-2'>
            {conversation.participants.map(participant => (
              <div
                key={participant.id}
                className='hover:bg-accent flex items-center justify-between rounded-sm p-2'
              >
                <div className='flex items-center'>
                  <UserAvatar size='sm' user={participant.user} />
                  <div className='ml-2 text-sm'>
                    <div className='flex space-x-2'>
                      <p>
                        {participant.user.name}
                        {participant.userId === profile?.id && (
                          <span className='text-muted-foreground ml-1'>(You)</span>
                        )}
                      </p>
                      {participant.role === ParticipantRoleEnum.CREATOR && (
                        <ChessQueen className='h-4 w-4 text-[#f59e0b]' />
                      )}
                      {participant.role === ParticipantRoleEnum.ADMIN && (
                        <Crown className='h-4 w-4 text-[#e3b726]' />
                      )}
                    </div>
                    <p className='text-foreground/50'>{participant.user.username}</p>
                  </div>
                </div>
                {isAdmin &&
                  participant.userId !== profile?.id &&
                  participant.role !== ParticipantRoleEnum.CREATOR && (
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant='ghost' size='icon' className='rounded-full'>
                          <MoreVertical className='h-4 w-4' />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align='end'>
                        <DropdownMenuItem
                          onClick={() => {
                            if (participant.role === ParticipantRoleEnum.MEMBER) {
                              setShowMakeGroupAdminAlert(true)
                            } else if (participant.role === ParticipantRoleEnum.ADMIN) {
                              setShowRemoveFromGroupAdminAlert(true)
                            }
                          }}
                        >
                          <Crown className='h-4 w-4 text-[#e3b726]' />
                          {participant.role === ParticipantRoleEnum.ADMIN
                            ? 'Remove from admin'
                            : 'Make group admin'}
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setShowRemoveParticipantAlert(true)}>
                          <CircleMinus className='text-destructive h-4 w-4' />
                          Remove
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  )}
                <DeleteAlertDialog
                  open={showMakeGroupAdminAlert}
                  onOpenChange={setShowMakeGroupAdminAlert}
                  icon={<Crown />}
                  title='Make admin?'
                  description={`Are you sure you want to make ${participant.user.name} an admin?`}
                  isLoading={makeParticipantAdmin.isPending}
                  actionName='Make admin'
                  onAction={() => handleMakeParticipantAdmin(participant.userId)}
                />
                <DeleteAlertDialog
                  open={showRemoveFromGroupAdminAlert}
                  onOpenChange={setShowRemoveFromGroupAdminAlert}
                  icon={<Crown />}
                  title='Remove admin?'
                  description={`Are you sure you want to remove ${participant.user.name} from admin?`}
                  isLoading={removeFromAdmin.isPending}
                  actionName='Remove admin'
                  onAction={() => handleRemoveFromGroupAdmin(participant.userId)}
                />
                <DeleteAlertDialog
                  open={showRemoveParticipantAlert}
                  onOpenChange={setShowRemoveParticipantAlert}
                  icon={<CircleMinus />}
                  title='Remove participant?'
                  description={`Are you sure you want to remove ${participant.user.name} from the group?`}
                  isLoading={removeParticipant.isPending}
                  actionName='Remove'
                  onAction={() => handleRemoveParticipant(participant.userId)}
                />
              </div>
            ))}
            {isAdmin && (
              <Button
                className='hover:bg-secondary/5 text-secondary flex h-auto w-full items-center justify-start gap-4 px-5 py-3 text-lg'
                variant='ghost'
                onClick={() => {
                  setFormAction('ADD_MEMBER')
                  setOpenEditGroupDialog(true)
                }}
              >
                <UserPlus className='size-5' /> Add member
              </Button>
            )}
          </div>
        </div>
      </div>
      <div className='mt-4 space-y-0.5'>
        {currentUserParticipant && !currentUserParticipant.leftAt && (
          <Button
            className='hover:bg-destructive/5 text-destructive flex h-auto w-full items-center justify-start gap-4 rounded-none p-4 text-lg'
            variant='ghost'
            onClick={() => setShowLeaveGroupAlert(true)}
          >
            <LogOutIcon className='size-5' />
            <span className='text-base'>Leave Group</span>
          </Button>
        )}
        <Button
          className='hover:bg-destructive/5 text-destructive flex h-auto w-full items-center justify-start gap-4 rounded-none p-4 text-lg'
          variant='ghost'
          onClick={() => setShowDeleteGroupAlert(true)}
        >
          <Trash2 className='size-5' />
          <span className='text-base'>Delete Group</span>
        </Button>
      </div>

      <DeleteAlertDialog
        open={showLeaveGroupAlert}
        onOpenChange={setShowLeaveGroupAlert}
        icon={<LogOut />}
        title='Leave group?'
        description='Are you sure you want to leave this group?'
        isLoading={leaveGroup.isPending}
        actionName='Leave'
        onAction={handleLeaveGroup}
      />
      <DeleteAlertDialog
        open={showDeleteGroupAlert}
        onOpenChange={setShowDeleteGroupAlert}
        title='Delete this group?'
        description='Are you sure you want to delete this group? This action cannot be undone.'
        isLoading={deleteGroup.isPending}
        onAction={handleDeleteGroup}
      />

      {formAction && (
        <EditGroup
          open={openEditGroupDialog}
          onOpenChange={setOpenEditGroupDialog}
          formAction={formAction}
          conversation={conversation}
        />
      )}
    </div>
  )
}

export default ConversationInfo
