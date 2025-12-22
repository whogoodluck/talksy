import MessageInput from './message-input'
import MessagesList from './message-list'
import MessagesContainerHeader from './messages-container-header'

function MessagesContainer() {
  return (
    <div className='bg-accent flex flex-col w-full h-full'>
      <MessagesContainerHeader />
      <MessagesList />
      <div className='p-1 md:p-2 bg-background'>
        <MessageInput />
      </div>
    </div>
  )
}

export default MessagesContainer
