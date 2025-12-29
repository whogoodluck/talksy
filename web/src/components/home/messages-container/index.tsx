import MessageInput from './message-input'
import MessagesList from './message-list'
import MessagesContainerHeader from './messages-container-header'

function MessagesContainer() {
  return (
    <div className='bg-accent relative flex flex-1 flex-col'>
      <MessagesContainerHeader />
      <MessagesList />
      <div className='bg-background z-20 absolute bottom-0 w-full p-1 py-2 md:px-2'>
        <MessageInput />
      </div>
    </div>
  )
}

export default MessagesContainer
