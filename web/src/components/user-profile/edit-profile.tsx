import { LoadingButton } from '@/components/loading-button'
import { Button } from '@/components/ui/button'
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
import { Textarea } from '@/components/ui/textarea'
import { useIsMobile } from '@/hooks/useMediaQuery'
import { useUpdateProfile } from '@/hooks/useUser'
import { updateProfileSchema, type UpdateProfileRequest } from '@/schemas/user.schema'
import type { User } from '@/types/user'
import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect, type Dispatch, type SetStateAction } from 'react'
import { useForm } from 'react-hook-form'

interface EditProfileProps {
  open: boolean
  onOpenChange: Dispatch<SetStateAction<boolean>>
  user: User
}

function EditProfile({ open, onOpenChange, user }: EditProfileProps) {
  const { isMobile } = useIsMobile()

  if (isMobile) {
    return (
      <Drawer open={open} onOpenChange={onOpenChange}>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>Edit Profile</DrawerTitle>
            <DrawerDescription className='hidden' />
          </DrawerHeader>
          <EditProfileForm user={user} onOpenChange={onOpenChange} />
        </DrawerContent>
      </Drawer>
    )
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='sm:max-w-[500px]'>
        <DialogHeader>
          <DialogTitle>Edit Profile</DialogTitle>
          <DialogDescription className='hidden' />
        </DialogHeader>
        <EditProfileForm user={user} onOpenChange={onOpenChange} />
      </DialogContent>
    </Dialog>
  )
}

export default EditProfile

interface EditProfileFormProps {
  user: User
  onOpenChange: Dispatch<SetStateAction<boolean>>
}

function EditProfileForm({ user, onOpenChange }: EditProfileFormProps) {
  const updateProfile = useUpdateProfile()

  const form = useForm<UpdateProfileRequest>({
    resolver: zodResolver(updateProfileSchema),
    defaultValues: {
      name: user.name || '',
      username: user.username || '',
      bio: user.bio || '',
      location: user.location || '',
    },
  })

  useEffect(() => {
    if (open) {
      form.reset({
        name: user.name || '',
        username: user.username || '',
        bio: user.bio || '',
        location: user.location || '',
      })
    }
  }, [open, user, form])

  const handleSubmit = (data: UpdateProfileRequest) => {
    updateProfile.mutate(data, {
      onSuccess: () => {
        form.reset()
        onOpenChange(false)
      },
    })
  }

  return (
    <div className='space-y-2'>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className='space-y-4'>
          <FormField
            control={form.control}
            name='name'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input placeholder='Enter your name' maxLength={100} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name='username'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Username</FormLabel>
                <FormControl>
                  <Input placeholder='Enter your username' maxLength={30} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name='bio'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Bio</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder='Tell us about yourself'
                    maxLength={500}
                    rows={4}
                    className='resize-none'
                    {...field}
                  />
                </FormControl>
                <p className='text-muted-foreground text-xs'>
                  {field.value?.length || 0}/500 characters
                </p>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name='location'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Location</FormLabel>
                <FormControl>
                  <Input placeholder='Enter your location' maxLength={100} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className='flex flex-col space-y-2 pt-2'>
            <LoadingButton type='submit' isLoading={updateProfile.isPending}>
              Save changes
            </LoadingButton>
            <Button
              type='button'
              variant='accent'
              onClick={() => onOpenChange(false)}
              disabled={updateProfile.isPending}
            >
              Cancel
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
}
