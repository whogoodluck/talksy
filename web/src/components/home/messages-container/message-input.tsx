import { Textarea } from '@/components/ui/textarea'
import { useSendMessage } from '@/hooks/useMessages'
import { useTypingUsers } from '@/hooks/useTypingUser'
import { cn } from '@/lib/utils'
import { useConversationContext } from '@/providers/conversation.provider'
import { sendMessageSchema } from '@/schemas/message.schema'
import { ArrowUp, Camera, Plus, Smile } from 'lucide-react'
import { useEffect, useState } from 'react'

function MessageInput() {
  const { selectedConversation } = useConversationContext()
  const sendMessage = useSendMessage(selectedConversation!.id)
  const [message, setMessage] = useState('')

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

  const handleSendMessage = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const values = sendMessageSchema.parse({ content: message })
    sendMessage.mutate(values)
    setMessage('')
  }

  return (
    <form
      onSubmit={handleSendMessage}
      className={cn('bg-foreground/5 flex items-end rounded-full border px-4 py-[6px] shadow-sm')}
    >
      <div className='my-auto flex items-center'>
        <button className='hover:bg-foreground/5 active:bg-foreground/5 cursor-pointer rounded-full p-2'>
          <Plus />
        </button>
        <button className='hover:bg-foreground/5 active:bg-foreground/5 cursor-pointer rounded-full p-2'>
          <Smile />
        </button>
      </div>
      <Textarea
        name='comment'
        id='comment'
        wrap='soft'
        placeholder='Type a message'
        value={message}
        onChange={e => setMessage(e.target.value)}
        className={cn(
          'bg-transparent my-auto mr-1 max-h-[150px] resize-none border-none pl-1 break-words whitespace-pre-wrap',
          'focus-visible:ring-0'
        )}
      />
      <div className='my-auto flex items-center gap-1'>
        {message.trim() ? (
          <button
            className={cn('bg-secondary cursor-pointer rounded-full p-2 text-black', {
              invisible: !message,
            })}
          >
            <ArrowUp />
          </button>
        ) : (
          <button className='hover:bg-foreground/5 active:bg-foreground/5 cursor-pointer rounded-full p-2'>
            <Camera />
          </button>
        )}
      </div>
    </form>
  )
}

export default MessageInput
