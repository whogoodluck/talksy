import { useGetProfile } from '@/hooks/useAuth'
import { useIsMobile } from '@/hooks/useMediaQuery'
import { useUpdateProfile } from '@/hooks/useUsers'
import { type UpdateProfileRequest, updateProfileSchema } from '@/schemas/user.schema'
import { zodResolver } from '@hookform/resolvers/zod'
import { type Dispatch, type SetStateAction } from 'react'
import { useForm } from 'react-hook-form'
import { LoadingButton } from '../loading-button'
import { Button } from '../ui/button'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../ui/dialog'
import { Drawer, DrawerContent, DrawerDescription, DrawerHeader, DrawerTitle } from '../ui/drawer'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form'
import { Input } from '../ui/input'
import { Textarea } from '../ui/textarea'

interface EditProfileProps {
  open: boolean
  onOpenChange: Dispatch<SetStateAction<boolean>>
}

function EditProfile({ open, onOpenChange }: EditProfileProps) {
  const { isMobile } = useIsMobile()

  if (isMobile) {
    return (
      <Drawer open={open} onOpenChange={onOpenChange}>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>Edit Profile</DrawerTitle>
            <DrawerDescription className='hidden' />
          </DrawerHeader>
          <div className='px-4 pb-4'>
            <EditProfileForm onOpenChange={onOpenChange} />
          </div>
        </DrawerContent>
      </Drawer>
    )
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Profile</DialogTitle>
          <DialogDescription className='hidden' />
        </DialogHeader>
        <EditProfileForm onOpenChange={onOpenChange} />
      </DialogContent>
    </Dialog>
  )
}

export default EditProfile

interface EditProfileFormProps {
  onOpenChange: Dispatch<SetStateAction<boolean>>
}

function EditProfileForm({ onOpenChange }: EditProfileFormProps) {
  const { data: user } = useGetProfile()
  if (!user) return

  const updateProfile = useUpdateProfile()

  const form = useForm<UpdateProfileRequest>({
    resolver: zodResolver(updateProfileSchema),
    defaultValues: {
      name: user.name ?? '',
      username: user.username ?? '',
      bio: user.bio ?? '',
      location: user.location ?? '',
    },
  })

  const isChanges = form.formState.isDirty

  const onSubmit = (data: UpdateProfileRequest) => {
    if (!isChanges) return

    updateProfile.mutate(data, {
      onSuccess: () => {
        onOpenChange(false)
      },
    })
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
        <FormField
          control={form.control}
          name='name'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name*</FormLabel>
              <FormControl>
                <Input placeholder='Enter your name' {...field} />
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
                  placeholder='Tell us about yourself...'
                  className='min-h-[60px] resize-none'
                  {...field}
                />
              </FormControl>
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
                <Input placeholder='Where are you from?' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className='mt-4 flex flex-col space-y-2'>
          <LoadingButton
            type='submit'
            isLoading={updateProfile.isPending}
            loadingText='Saving...'
            disabled={!isChanges}
          >
            Save
          </LoadingButton>
          <Button
            type='button'
            variant='accent'
            onClick={() => onOpenChange?.(false)}
            disabled={updateProfile.isPending}
          >
            Cancel
          </Button>
        </div>
      </form>
    </Form>
  )
}
