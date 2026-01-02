import MessageInput from './message-input'
import MessagesContainerHeader from './messages-container-header'
import MessagesList from './messages-list'

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
