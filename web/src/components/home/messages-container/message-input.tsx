import { Button } from '@/components/ui/button'
import { EmojiPicker, EmojiPickerContent, EmojiPickerSearch } from '@/components/ui/emoji-picker'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Textarea } from '@/components/ui/textarea'
import { useGetProfile } from '@/hooks/useAuth'
import { useIsMobile } from '@/hooks/useMediaQuery'
import { useSendMessage } from '@/hooks/useMessages'
import { useTypingUsers } from '@/hooks/useTypingUser'
import { cn } from '@/lib/utils'
import { useConversationContext } from '@/providers/conversation.provider'
import { sendMessageSchema, type SendMessageRequest } from '@/schemas/message.schema'
import { MessageEnum } from '@/types/conversation'
import { zodResolver } from '@hookform/resolvers/zod'
import { ArrowUp, Camera, Smile, XIcon } from 'lucide-react'
import { useEffect, useMemo, useRef, useState, type ChangeEvent } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'

function MessageInput() {
  const { selectedConversation } = useConversationContext()
  const profile = useGetProfile()
  const { isMobile } = useIsMobile()

  const currentUserParticipant = selectedConversation?.participants.find(
    p => p.userId === profile.data?.id
  )
  const isLeft = !currentUserParticipant || !!currentUserParticipant.leftAt

  if (!selectedConversation || !profile.data) return null

  const sendMessage = useSendMessage(selectedConversation.id)
  const [imgFile, setImgFile] = useState<File | null>(null)

  const { startTyping, stopTyping } = useTypingUsers()

  const form = useForm<SendMessageRequest>({
    resolver: zodResolver(sendMessageSchema),
    defaultValues: {
      content: '',
      type: undefined,
      file: undefined,
      fileName: undefined,
      fileSize: undefined,
      replyToId: undefined,
    },
  })

  useEffect(() => {
    form.reset()
    setImgFile(null)
  }, [selectedConversation.id])

  const msgContent = form.watch('content')

  useEffect(() => {
    if (!msgContent?.trim()) {
      stopTyping(selectedConversation.id)
      return
    }

    startTyping(selectedConversation.id)

    const timeout = setTimeout(() => {
      stopTyping(selectedConversation.id)
    }, 1000)

    return () => {
      stopTyping(selectedConversation.id)
      clearTimeout(timeout)
    }
  }, [msgContent, startTyping, stopTyping, selectedConversation.id])

  const imgUrl = useMemo(() => {
    if (!imgFile) return null
    return URL.createObjectURL(imgFile)
  }, [imgFile])

  useEffect(() => {
    if (!imgUrl) return

    return () => {
      URL.revokeObjectURL(imgUrl)
    }
  }, [imgUrl])

  const inputRef = useRef<HTMLInputElement | null>(null)

  const triggerImageFileInput = () => {
    if (inputRef.current) {
      inputRef.current.click()
    }
  }

  const handleSelectImage = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const maxSize = 5 * 1024 * 1024
    if (file.size > maxSize) {
      toast.error('Image size must be less than 5MB')
      return
    }

    setImgFile(file)
    form.setValue('type', MessageEnum.IMAGE)
    form.setValue('file', file)
    form.setValue('fileName', file.name)
    form.setValue('fileSize', file.size)
  }

  const clearImage = () => {
    setImgFile(null)
    form.setValue('type', undefined)
    form.setValue('file', undefined)
    form.setValue('fileName', undefined)
    form.setValue('fileSize', undefined)
  }

  const onSubmit = (data: SendMessageRequest) => {
    if (isLeft || (!data.content?.trim() && !data.file)) return

    const msgData = new FormData()

    if (data.type) msgData.append('type', data.type)
    if (data.content) msgData.append('content', data.content)
    if (data.file) msgData.append('file', data.file)
    if (data.fileName) msgData.append('fileName', data.fileName)
    if (data.fileSize) msgData.append('fileSize', data.fileSize.toString())
    if (data.replyToId) msgData.append('replyToId', data.replyToId)

    sendMessage.mutate(msgData)

    form.reset()
    setImgFile(null)
  }

  if (isLeft) {
    return (
      <div className='bg-background fixed bottom-0 z-20 flex h-16 w-full items-center border-t md:absolute md:px-4'>
        <p className='text-foreground/50 w-full text-center'>
          You can't send messages to this group because you're no longer a member.
        </p>
      </div>
    )
  }

  return (
    <div className='bg-background fixed bottom-0 z-20 w-full border-t px-2 py-3.5 md:absolute md:px-4'>
      {imgUrl && (
        <div className='mb-4 flex items-center justify-end px-2'>
          <div className='relative h-full w-[200px] overflow-hidden rounded-sm'>
            <img
              src={imgUrl}
              alt={imgFile?.name ?? 'Selected image'}
              className='w-full object-cover'
            />
            <Button
              size='icon'
              variant='ghost'
              className='absolute top-1 right-1 size-6 rounded-full'
              onClick={clearImage}
            >
              <XIcon />
            </Button>
          </div>
        </div>
      )}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className={cn('flex')}>
          <div className='my-auto flex items-center space-x-0.5'>
            {/* <Button
              type='button'
              variant='ghost'
              size='icon'
              className='rounded-full p-2'
            >
              <Plus className='size-6' />
            </Button> */}
            <Popover>
              <PopoverTrigger asChild>
                <Button type='button' variant='ghost' size='icon' className='rounded-full p-2'>
                  <Smile className='size-6' />
                </Button>
              </PopoverTrigger>

              <PopoverContent className='mb-2 ml-2 flex items-center justify-center border-none'>
                <EmojiPicker
                  onEmojiSelect={({ emoji }) => {
                    form.setValue('content', form.getValues('content') + emoji)
                    document.getElementById('content')?.focus()
                  }}
                  className='h-80'
                >
                  <EmojiPickerSearch />
                  <EmojiPickerContent />
                </EmojiPicker>
              </PopoverContent>
            </Popover>
          </div>
          <FormField
            control={form.control}
            name='content'
            render={({ field }) => (
              <FormItem className='w-full'>
                <FormLabel className='hidden' />
                <FormControl>
                  <Textarea
                    id='content'
                    wrap='soft'
                    placeholder='Message'
                    {...field}
                    className={cn(
                      'my-auto mr-1 max-h-[120px] resize-none border-none bg-transparent pl-1 break-words whitespace-pre-wrap shadow-none',
                      'focus-visible:ring-0'
                    )}
                    onKeyDown={e => {
                      if (!isMobile && e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault()
                        form.handleSubmit(onSubmit)()
                      }
                    }}
                  />
                </FormControl>
                <FormMessage className='hidden' />
              </FormItem>
            )}
          />
          <div className='my-auto flex items-center space-x-0.5'>
            {(msgContent && msgContent.trim()) || imgFile ? (
              <Button type='submit' variant='secondary' size='icon' className='rounded-full p-2'>
                <ArrowUp className='size-6' />
              </Button>
            ) : (
              <Button
                type='button'
                variant='ghost'
                size='icon'
                className='rounded-full p-2'
                onClick={triggerImageFileInput}
              >
                <Camera className='size-6' />
              </Button>
            )}
            <input
              type='file'
              accept='image/*'
              ref={inputRef}
              onChange={handleSelectImage}
              className='hidden'
            />
          </div>
        </form>
      </Form>
    </div>
  )
}

export default MessageInput
