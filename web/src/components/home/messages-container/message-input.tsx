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
import { useSendMessage } from '@/hooks/useMessages'
import { useTypingUsers } from '@/hooks/useTypingUser'
import { cn } from '@/lib/utils'
import { useConversationContext } from '@/providers/conversation.provider'
import { sendMessageSchema, type SendMessageRequest } from '@/schemas/message.schema'
import { MessageEnum } from '@/types/conversation'
import { zodResolver } from '@hookform/resolvers/zod'
import { ArrowUp, Camera, Smile, XIcon } from 'lucide-react'
import { useEffect, useRef, useState, type ChangeEvent } from 'react'
import { useForm } from 'react-hook-form'

function MessageInput() {
  const { selectedConversation } = useConversationContext()
  const sendMessage = useSendMessage(selectedConversation!.id)
  const [img, setImg] = useState<File | null>(null)

  const { startTyping, stopTyping } = useTypingUsers()

  const form = useForm<SendMessageRequest>({
    resolver: zodResolver(sendMessageSchema),
    defaultValues: {
      content: '',
      file: undefined,
      fileName: undefined,
      fileSize: undefined,
      replyToId: undefined,
    },
  })

  const msgContent = form.watch('content')

  useEffect(() => {
    if (!msgContent || !msgContent.trim()) return

    startTyping(selectedConversation!.id)

    const timeout = setTimeout(() => {
      stopTyping(selectedConversation!.id)
    }, 1000)

    return () => {
      stopTyping(selectedConversation!.id)
      clearTimeout(timeout)
    }
  }, [msgContent])

  const inputRef: any = useRef(null)

  const triggerImageFileInput = () => {
    if (inputRef.current) {
      inputRef.current.click()
    }
  }

  const handleSelectImage = (e: ChangeEvent<HTMLInputElement>) => {
    setImg(e.target.files![0])
    form.setValue('type', MessageEnum.IMAGE)
    form.setValue('file', e.target.files![0])
    form.setValue('fileName', e.target.files![0].name)
    form.setValue('fileSize', e.target.files![0].size)
  }

  const onSubmit = (data: SendMessageRequest) => {
    const msgData = new FormData()

    if (data.type) msgData.append('type', data.type)
    if (data.content) msgData.append('content', data.content)
    if (data.file) msgData.append('file', data.file)
    if (data.fileName) msgData.append('fileName', data.fileName)
    if (data.fileSize) msgData.append('fileSize', data.fileSize.toString())
    if (data.replyToId) msgData.append('replyToId', data.replyToId)

    sendMessage.mutate(msgData)

    form.reset()
    setImg(null)
  }

  return (
    <div>
      {img && (
        <div className='flex items-center justify-end px-2 pb-2'>
          <div className='relative size-40 h-full overflow-hidden rounded-sm'>
            <img src={URL.createObjectURL(img)} className='w-full object-cover' />
            <Button
              size='icon'
              variant='ghost'
              className='absolute top-1 right-1 size-6 rounded-full'
              onClick={() => setImg(null)}
            >
              <XIcon />
            </Button>
          </div>
        </div>
      )}
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className={cn(
            'bg-foreground/5 flex items-end rounded-full border px-4 py-[6px] shadow-sm'
          )}
        >
          <div className='my-auto flex items-center'>
            {/* <button
              type='button'
              className='hover:bg-foreground/5 active:bg-foreground/5 cursor-pointer rounded-full p-2'
            >
              <Plus />
            </button> */}

            <Popover>
              <PopoverTrigger asChild>
                <button
                  type='button'
                  className='hover:bg-foreground/5 active:bg-foreground/5 cursor-pointer rounded-full p-2'
                >
                  <Smile />
                </button>
              </PopoverTrigger>

              <PopoverContent className='mb-2 ml-2 flex items-center justify-center border-none'>
                <EmojiPicker
                  onEmojiSelect={({ emoji }) => {
                    form.setValue('content', form.getValues('content') + emoji)
                    // setMessage(prev => prev + emoji)
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
                    placeholder='Type a message'
                    {...field}
                    className={cn(
                      'my-auto mr-1 max-h-[150px] resize-none border-none bg-transparent pl-1 break-words whitespace-pre-wrap',
                      'focus-visible:ring-0'
                    )}
                  />
                </FormControl>
                <FormMessage className='hidden' />
              </FormItem>
            )}
          />
          <div className='my-auto flex items-center gap-1'>
            {(msgContent && msgContent.trim()) || img ? (
              <button
                type='submit'
                className='bg-secondary text-secondary-foreground cursor-pointer rounded-full p-2'
              >
                <ArrowUp />
              </button>
            ) : (
              <button
                type='button'
                onClick={triggerImageFileInput}
                className='hover:bg-foreground/5 active:bg-foreground/5 cursor-pointer rounded-full p-2'
              >
                <Camera />
              </button>
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
