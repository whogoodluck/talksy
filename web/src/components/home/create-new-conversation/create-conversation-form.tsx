import UserAvatar from '@/components/common/user-avatar'
import { Loader } from '@/components/loader'
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
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { SearchInput } from '@/components/ui/search-input'
import { useCreateDirectConversation, useCreateGroupConversation } from '@/hooks/useConversations'
import { useIsMobile } from '@/hooks/useMediaQuery'
import { useSearchUsers } from '@/hooks/useUsers'
import {
  createConversationSchema,
  type CreateConversationRequest,
} from '@/schemas/conversation.schema'
import { ConversationEnum, type ConversationType } from '@/types/conversation'
import type { User } from '@/types/user'
import { zodResolver } from '@hookform/resolvers/zod'
import { XIcon } from 'lucide-react'
import { useEffect, useState, type Dispatch, type SetStateAction } from 'react'
import { useForm } from 'react-hook-form'
import { Button } from '../../ui/button'

interface CreateConversationFormProps {
  open: boolean
  onOpenChange: Dispatch<SetStateAction<boolean>>
  conversationType: ConversationType
}

function CreateConversationForm({
  open,
  onOpenChange,
  conversationType,
}: CreateConversationFormProps) {
  const [searchValue, setSearchValue] = useState('')
  const [debouncedSearchValue, setDebouncedSearchValue] = useState('')
  const { isMobile } = useIsMobile()

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchValue(searchValue.trim())
    }, 500)

    return () => clearTimeout(timer)
  }, [searchValue])

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
              debouncedSearchValue={debouncedSearchValue}
              conversationType={conversationType}
              onOpenChange={onOpenChange}
            />
          </div>
          <DrawerFooter />
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
        <div className='space-y-2'>
          <SearchInput
            value={searchValue}
            onChange={setSearchValue}
            onClear={() => setSearchValue('')}
          />
          <ConversationForm
            debouncedSearchValue={debouncedSearchValue}
            conversationType={conversationType}
            onOpenChange={onOpenChange}
          />
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default CreateConversationForm

interface ConversationFormProps {
  debouncedSearchValue: string
  conversationType: ConversationType
  onOpenChange: Dispatch<SetStateAction<boolean>>
}

function ConversationForm({
  debouncedSearchValue,
  conversationType,
  onOpenChange,
}: ConversationFormProps) {
  const [selectedUsers, setSelectedUsers] = useState<User[]>([])
  const users = useSearchUsers(debouncedSearchValue)

  const usersList: User[] | undefined = users.data?.users

  const directConversation = useCreateDirectConversation()
  const groupConversation = useCreateGroupConversation()

  const form = useForm<CreateConversationRequest>({
    resolver: zodResolver(createConversationSchema),
    defaultValues: {
      type:
        conversationType === ConversationEnum.DIRECT
          ? ConversationEnum.DIRECT
          : ConversationEnum.GROUP,
      name: '',
    },
  })

  const handleAddUser = (user: User) => {
    if (conversationType === ConversationEnum.DIRECT && selectedUsers.length < 1) {
      form.setValue('participantId', user.id)
    } else {
      form.setValue('participantIds', [...selectedUsers.map(user => user.id), user.id])
    }

    setSelectedUsers(prev => [user, ...prev])
  }

  const handleRemoveUser = (id: string) => {
    if (conversationType === ConversationEnum.DIRECT) {
      form.setValue('participantId', '')
    } else {
      form.setValue(
        'participantIds',
        selectedUsers.filter(user => user.id !== id).map(user => user.id)
      )
    }

    setSelectedUsers(prev => prev.filter(user => user.id !== id))
  }

  const onSubmit = (data: CreateConversationRequest) => {
    if (data.type === ConversationEnum.DIRECT) {
      directConversation.mutate(data, {
        onSuccess: () => {
          setSelectedUsers([])
          form.reset()
          onOpenChange(false)
        },
      })
    } else {
      groupConversation.mutate(data, {
        onSuccess: () => {
          setSelectedUsers([])
          form.reset()
          onOpenChange(false)
        },
      })
    }
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
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className='mt-4'>
          {conversationType === ConversationEnum.GROUP && (
            <FormField
              control={form.control}
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
          )}

          <div className='mt-4 flex flex-col space-y-2'>
            <LoadingButton
              type='submit'
              isLoading={directConversation.isPending || groupConversation.isPending}
              disabled={selectedUsers.length < 1}
            >
              Create
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
    </>
  )
}
