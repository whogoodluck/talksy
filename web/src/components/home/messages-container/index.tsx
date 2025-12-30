import MessageInput from './message-input'
import MessagesList from './message-list'
import MessagesContainerHeader from './messages-container-header'

function MessagesContainer() {
  return (
    <div className='relative flex flex-1 flex-col'>
      <MessagesContainerHeader />
      <MessagesList />
      <div className='bg-background fixed bottom-0 z-20 w-full p-1 py-2 md:absolute md:px-2'>
        <MessageInput />
      </div>
    </div>
  )
}

export default MessagesContainer
