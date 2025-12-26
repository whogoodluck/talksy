import MessageInput from './message-input'
import MessagesList from './message-list'
import MessagesContainerHeader from './messages-container-header'

function MessagesContainer() {
  return (
    <div className='bg-accent relative flex h-full w-full flex-col'>
      <MessagesContainerHeader />
      <MessagesList />
      <div className='bg-background absolute bottom-0 w-full p-1 md:p-2'>
        <MessageInput />
      </div>
    </div>
  )
}

export default MessagesContainer
