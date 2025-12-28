import { Button } from '@/components/ui/button'
import { EmojiPicker, EmojiPickerContent, EmojiPickerSearch } from '@/components/ui/emoji-picker'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Textarea } from '@/components/ui/textarea'
import { useSendMessage } from '@/hooks/useMessages'
import { useTypingUsers } from '@/hooks/useTypingUser'
import { cn } from '@/lib/utils'
import { useConversationContext } from '@/providers/conversation.provider'
import { sendMessageSchema } from '@/schemas/message.schema'
import { ArrowUp, Camera, Smile, XIcon } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'

function MessageInput() {
  const { selectedConversation } = useConversationContext()
  const sendMessage = useSendMessage(selectedConversation!.id)
  const [message, setMessage] = useState('')
  const [img, setImg] = useState<File | null>(null)

  const { startTyping, stopTyping } = useTypingUsers()

  useEffect(() => {
    if (!message.trim()) return

    startTyping(selectedConversation!.id)

    const timeout = setTimeout(() => {
      stopTyping(selectedConversation!.id)
    }, 1000)

    return () => {
      stopTyping(selectedConversation!.id)
      clearTimeout(timeout)
    }
  }, [message])

  const inputRef: any = useRef(null)

  const handleSelectImg = () => {
    if (inputRef.current) {
      inputRef.current.click()
    }
  }

  const handleSendMessage = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const values = sendMessageSchema.parse({ content: message })
    sendMessage.mutate(values)
    setMessage('')
  }

  return (
    <div>
      {
        img && (
          <div className='pb-2 px-2 flex items-center justify-end'>
            <div className='h-full relative size-40 rounded-sm overflow-hidden'>
            <img src={URL.createObjectURL(img)} className='w-full object-cover' />
            <Button size='icon' variant='ghost' className='absolute top-1 right-1 rounded-full size-6' onClick={() => setImg(null)}><XIcon /></Button>
          </div>
          </div>
        )
      }
      <form
      onSubmit={handleSendMessage}
      className={cn('bg-foreground/5 flex items-end rounded-full border px-4 py-[6px] shadow-sm')}
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

          <PopoverContent className='flex items-center justify-center border-none ml-2 mb-2'>
            <EmojiPicker
              onEmojiSelect={({ emoji }) => setMessage(prev => prev + emoji)}
              className='h-80 '
            >
              <EmojiPickerSearch />
              <EmojiPickerContent />
            </EmojiPicker>
          </PopoverContent>
        </Popover>
      </div>
      <Textarea
        name='comment'
        id='comment'
        wrap='soft'
        placeholder='Type a message'
        value={message}
        onChange={e => setMessage(e.target.value)}
        className={cn(
          'my-auto mr-1 max-h-[150px] resize-none border-none bg-transparent pl-1 break-words whitespace-pre-wrap',
          'focus-visible:ring-0'
        )}
      />
      <div className='my-auto flex items-center gap-1'>
        {message.trim() || img ? (
          <button
            type='submit'
            className={cn(
              'bg-secondary text-secondary-foreground cursor-pointer rounded-full p-2',
              {
                invisible: !message && !img,
              }
            )}
          >
            <ArrowUp />
          </button>
        ) : (
          <button
            type='button'
            onClick={handleSelectImg}
            className='hover:bg-foreground/5 active:bg-foreground/5 cursor-pointer rounded-full p-2'
          >
            <Camera />
          </button>
        )}
        <input type='file' accept='image/*' ref={inputRef} onChange={e => setImg(e.target.files![0])} className='hidden' />
      </div>
    </form>
    </div>
  )
}

export default MessageInput
