import UserAvatar from '@/components/common/user-avatar'
import { LoadingButton } from '@/components/loading-button'
import { Badge } from '@/components/ui/badge'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from '@/components/ui/drawer'
import { Input } from '@/components/ui/input'
import { SearchInput } from '@/components/ui/search-input'
import { useCreateDirectConversation, useCreateGroupConversation } from '@/hooks/useConversations'
import { useIsMobile } from '@/hooks/useMediaQuery'
import { useSearchUsers } from '@/hooks/useUsers'
import { ConversationEnum, type ConversationType } from '@/types/conversation'
import type { User } from '@/types/user'
import { XIcon } from 'lucide-react'
import { useEffect, useState, type Dispatch, type SetStateAction } from 'react'
import { Button } from '../../ui/button'

interface CreateConversationFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  conversationType: ConversationType
}

function CreateConversationForm({
  open,
  onOpenChange,
  conversationType,
}: CreateConversationFormProps) {
  const [searchValue, setSearchValue] = useState('')
  const [debouncedSearchValue, setDebouncedSearchValue] = useState('')
  const [selectedUsers, setSelectedUsers] = useState<User[]>([])
  const [groupName, setGroupName] = useState('')
  const users = useSearchUsers(debouncedSearchValue)
  const isMobile = useIsMobile()

  const directConversation = useCreateDirectConversation()
  const groupConversation = useCreateGroupConversation()

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchValue(searchValue.trim())
    }, 500)

    return () => clearTimeout(timer)
  }, [searchValue])

  useEffect(() => {
    users.refetch()
  }, [debouncedSearchValue])

  const handleCreateConversation = () => {
    if (conversationType === ConversationEnum.DIRECT) {
      directConversation.mutate({ type: conversationType, participantId: selectedUsers[0].id })
      setSelectedUsers([])
      onOpenChange(false)
    } else {
      groupConversation.mutate({
        type: conversationType,
        participantIds: selectedUsers.map(user => user.id),
        name: groupName,
      })
      onOpenChange(false)
      setSelectedUsers([])
      setGroupName('')
    }
  }

  if (users.isLoading) return

  const usersList: User[] = users.data!.users

  if (isMobile) {
    return (
      <Drawer open={open} onOpenChange={onOpenChange}>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>New Conversation</DrawerTitle>
            <DrawerDescription className='hidden' />
          </DrawerHeader>
          <div className='space-y-2 px-4'>
            <SearchInput
              value={searchValue}
              onChange={setSearchValue}
              onClear={() => setSearchValue('')}
            />
            <ConversationForm
              conversationType={conversationType}
              usersList={usersList}
              selectedUsers={selectedUsers}
              setSelectedUsers={setSelectedUsers}
              groupName={groupName}
              setGroupName={setGroupName}
            />
          </div>
          <DrawerFooter>
            <LoadingButton
              isLoading={directConversation.isPending || groupConversation.isPending}
              onClick={handleCreateConversation}
            >
              Create
            </LoadingButton>
            <Button
              variant='ghost'
              onClick={() => {
                onOpenChange(false)
              }}
            >
              Cancel
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    )
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className='text-center'>New Conversation</DialogTitle>
          <DialogDescription className='hidden' />
        </DialogHeader>
        <SearchInput
          value={searchValue}
          onChange={setSearchValue}
          onClear={() => setSearchValue('')}
        />
        <ConversationForm
          conversationType={conversationType}
          usersList={usersList}
          selectedUsers={selectedUsers}
          setSelectedUsers={setSelectedUsers}
          groupName={groupName}
          setGroupName={setGroupName}
        />
        <div className='flex flex-col space-y-2'>
          <LoadingButton
            isLoading={directConversation.isPending || groupConversation.isPending}
            onClick={handleCreateConversation}
          >
            Create
          </LoadingButton>
          <Button
            className=''
            variant='ghost'
            onClick={() => {
              onOpenChange(false)
            }}
          >
            Cancel
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default CreateConversationForm

interface ConversationFormProps {
  conversationType: ConversationType
  usersList: User[]
  selectedUsers: User[]
  setSelectedUsers: Dispatch<SetStateAction<User[]>>
  groupName: string
  setGroupName: Dispatch<SetStateAction<string>>
}

function ConversationForm({
  conversationType,
  usersList,
  selectedUsers,
  setSelectedUsers,
  groupName,
  setGroupName,
}: ConversationFormProps) {
  const handleAddUser = (user: User) => {
    if (conversationType === ConversationEnum.DIRECT && selectedUsers.length > 0) return

    setSelectedUsers(prev => [user, ...prev])
  }

  const handleRemoveUser = (id: string) => {
    setSelectedUsers(prev => prev.filter(user => user.id !== id))
  }

  return (
    <>
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
      <div className='bg-foreground/5 flex max-h-[250px] min-h-[100px] flex-col overflow-y-auto rounded-sm p-2'>
        {!!usersList.length ? (
          usersList.map(user => (
            <div
              key={user.id}
              className='hover:bg-accent flex items-center justify-between rounded-sm p-2'
            >
              <div className='flex items-center'>
                <UserAvatar size='sm' avatarUrl={user.picture} name={user.name} />
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
                  disabled={
                    conversationType === ConversationEnum.DIRECT && selectedUsers.length > 0
                  }
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
      {conversationType === ConversationEnum.GROUP && (
        <Input
          placeholder='Enter group name'
          value={groupName}
          onChange={e => setGroupName(e.target.value)}
        />
      )}
    </>
  )
}
