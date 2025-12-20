import MessageInput from './message-input'
import MessagesList from './message-list'
import MessagesContainerHeader from './messages-container-header'

function MessagesContainer() {
  return (
    <div className='bg-accent flex flex-1 flex-col'>
      <MessagesContainerHeader />
      <MessagesList />
      <div className='p-1 md:p-4'>
        <MessageInput />
      </div>
    </div>
  )
}

export default MessagesContainer
