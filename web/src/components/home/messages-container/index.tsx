import MessageInput from './message-input'
import MessagesList from './messages-list'
import MessagesContainerHeader from './messages-container-header'

function MessagesContainer() {
  return (
    <div className='relative flex flex-1 flex-col'>
      <MessagesContainerHeader />
      <MessagesList />
      <MessageInput />
    </div>
  )
}

export default MessagesContainer
