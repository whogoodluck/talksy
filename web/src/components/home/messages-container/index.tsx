import MessagesList from './message-list'
import MessagesContainerHeader from './messages-container-header'

function MessagesContainer() {
  return (
    <div className='bg-background flex flex-1 flex-col'>
      <MessagesContainerHeader />
      <MessagesList />
    </div>
  )
}

export default MessagesContainer
