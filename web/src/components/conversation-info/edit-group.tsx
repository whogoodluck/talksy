import { useAddParticipants, useUpdateGroupInfo } from '@/hooks/useGroupConversations'
import { useIsMobile } from '@/hooks/useMediaQuery'
import { useSearchUsers } from '@/hooks/useUsers'
import {
  addParticipantsInGroupConversationSchema,
  updateGroupConversationSchema,
  type AddParticipantsInGroupConversationRequest,
  type UpdateConversationRequest,
} from '@/schemas/conversation.schema'
import { type Conversation } from '@/types/conversation'
import type { User } from '@/types/user'
import { zodResolver } from '@hookform/resolvers/zod'
import { XIcon } from 'lucide-react'
import { useEffect, useState, type Dispatch, type SetStateAction } from 'react'
import { useForm } from 'react-hook-form'
import UserAvatar from '../common/user-avatar'
import { Loader } from '../loader'
import { LoadingButton } from '../loading-button'
import { Badge } from '../ui/badge'
import { Button } from '../ui/button'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../ui/dialog'
import { Drawer, DrawerContent, DrawerDescription, DrawerHeader, DrawerTitle } from '../ui/drawer'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form'
import { Input } from '../ui/input'
import { SearchInput } from '../ui/search-input'

interface EditGroupProps {
  open: boolean
  onOpenChange: Dispatch<SetStateAction<boolean>>
  formAction: 'EDIT_NAME' | 'ADD_MEMBER'
  conversation: Conversation
}

function EditGroup({ open, onOpenChange, formAction, conversation }: EditGroupProps) {
  const { isMobile } = useIsMobile()

  if (isMobile) {
    return (
      <Drawer open={open} onOpenChange={onOpenChange}>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>{formAction === 'EDIT_NAME' ? 'Edit Name' : 'Add Member'}</DrawerTitle>
            <DrawerDescription className='hidden' />
            <EditGroupForm
              conversation={conversation}
              onOpenChange={onOpenChange}
              formAction={formAction}
            />
          </DrawerHeader>
        </DrawerContent>
      </Drawer>
    )
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{formAction === 'EDIT_NAME' ? 'Edit Name' : 'Add Member'}</DialogTitle>
          <DialogDescription className='hidden' />
        </DialogHeader>
        <EditGroupForm
          conversation={conversation}
          onOpenChange={onOpenChange}
          formAction={formAction}
        />
      </DialogContent>
    </Dialog>
  )
}

export default EditGroup

interface EditGroupFormProps {
  conversation: Conversation
  onOpenChange: Dispatch<SetStateAction<boolean>>
  formAction: 'EDIT_NAME' | 'ADD_MEMBER'
}

function EditGroupForm({ conversation, onOpenChange, formAction }: EditGroupFormProps) {
  const [searchValue, setSearchValue] = useState('')
  const [selectedUsers, setSelectedUsers] = useState<User[]>([])
  const [debouncedSearchValue, setDebouncedSearchValue] = useState('')
  const users = useSearchUsers(debouncedSearchValue)
  const groupInfo = useUpdateGroupInfo(conversation.id)
  const addParticipants = useAddParticipants(conversation.id)

  const usersList: User[] | undefined = users.data?.users.filter(
    user => !conversation.participants.some(participant => participant.userId === user.id)
  )

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchValue(searchValue.trim())
    }, 500)

    return () => clearTimeout(timer)
  }, [searchValue])

  const editNameform = useForm<UpdateConversationRequest>({
    resolver: zodResolver(updateGroupConversationSchema),
    defaultValues: {
      name: conversation.name || '',
    },
  })

  const addMemberForm = useForm<AddParticipantsInGroupConversationRequest>({
    resolver: zodResolver(addParticipantsInGroupConversationSchema),
    defaultValues: {
      participantIds: conversation.participants.map(participant => participant.id),
    },
  })

  const handleAddUser = (user: User) => {
    addMemberForm.setValue('participantIds', [...selectedUsers.map(user => user.id), user.id])

    setSelectedUsers(prev => [user, ...prev])
  }

  const handleRemoveUser = (id: string) => {
    addMemberForm.setValue(
      'participantIds',
      selectedUsers.filter(user => user.id !== id).map(user => user.id)
    )

    setSelectedUsers(prev => prev.filter(user => user.id !== id))
  }

  const handleAddParticipant = (data: AddParticipantsInGroupConversationRequest) => {
    addParticipants.mutate(data, {
      onSuccess: () => {
        editNameform.reset()
        addMemberForm.reset()
        onOpenChange(false)
      },
    })
  }

  const handleUpdateName = (data: UpdateConversationRequest) => {
    if (data.name === conversation.name) {
      onOpenChange(false)
      return
    }

    groupInfo.mutate(data, {
      onSuccess: () => {
        editNameform.reset()
        addMemberForm.reset()
        onOpenChange(false)
      },
    })
  }

  if (formAction === 'ADD_MEMBER') {
    return (
      <div className='space-y-2'>
        <>
          <SearchInput
            value={searchValue}
            onChange={setSearchValue}
            onClear={() => setSearchValue('')}
          />
          <div className='flex flex-wrap gap-2'>
            {selectedUsers.length > 0 &&
              selectedUsers.map(user => (
                <Badge variant='outline' key={user.id}>
                  <p className='text-foreground mr-2 text-sm'>{user.name}</p>{' '}
                  <button onClick={() => handleRemoveUser(user.id)}>
                    <XIcon
                      size={15}
                      className='text-destructive hover:text-destructive/50 cursor-pointer'
                    />
                  </button>
                </Badge>
              ))}
          </div>
          <div className='bg-foreground/5 flex max-h-[250px] min-h-[75px] flex-col overflow-y-auto rounded-sm p-2'>
            {users.isLoading ? (
              <div className='flex flex-1 items-center justify-center'>
                <Loader size='sm' />
              </div>
            ) : usersList && !!usersList.length ? (
              usersList.map(user => (
                <div
                  key={user.id}
                  className='hover:bg-accent flex items-center justify-between rounded-sm p-2'
                >
                  <div className='flex items-center'>
                    <UserAvatar size='sm' user={user} />
                    <div className='ml-2 text-sm'>
                      <p>{user.name}</p>
                      <p className='text-foreground/50'>{user.username}</p>
                    </div>
                  </div>
                  {selectedUsers.includes(user) ? (
                    <Button
                      variant='ghost'
                      size='sm'
                      className='text-destructive w-[80px]'
                      onClick={() => handleRemoveUser(user.id)}
                    >
                      remove
                    </Button>
                  ) : (
                    <Button
                      variant='ghost'
                      size='sm'
                      className='text-secondary w-[80px]'
                      onClick={() => handleAddUser(user)}
                    >
                      Add
                    </Button>
                  )}
                </div>
              ))
            ) : (
              <div className='flex flex-1 items-center justify-center'>
                <p>No users found.</p>
              </div>
            )}
          </div>
        </>
        <Form {...addMemberForm}>
          <form
            onSubmit={addMemberForm.handleSubmit(handleAddParticipant)}
            className='mt-4 flex flex-col space-y-2'
          >
            <LoadingButton type='submit' isLoading={groupInfo.isPending}>
              Save
            </LoadingButton>
            <Button
              type='button'
              variant='accent'
              onClick={() => {
                onOpenChange(false)
              }}
            >
              Cancel
            </Button>
          </form>
        </Form>
      </div>
    )
  }

  return (
    <div className='space-y-2'>
      <Form {...editNameform}>
        <form onSubmit={editNameform.handleSubmit(handleUpdateName)} className='mt-4'>
          <FormField
            control={editNameform.control}
            name='name'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Group Name</FormLabel>
                <FormControl>
                  <Input placeholder='Group Name' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className='mt-4 flex flex-col space-y-2'>
            <LoadingButton type='submit' isLoading={groupInfo.isPending}>
              Save
            </LoadingButton>
            <Button
              type='button'
              variant='accent'
              onClick={() => {
                onOpenChange(false)
              }}
            >
              Cancel
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
}
