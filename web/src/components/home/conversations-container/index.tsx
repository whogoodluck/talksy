import { HOME_TABS } from '@/constants'
import { cn } from '@/lib/utils'
import { useConversationContext } from '@/providers/conversation.provider'
import { ConversationEnum, type ConversationType } from '@/types/conversation'
import { useEffect, useState } from 'react'
import Logo from '../../common/logo'
import { SearchInput } from '../../ui/search-input'
import { Tabs } from '../../ui/tabs'
import CreateNewConversation from '../create-new-conversation'
import { HomeMenu } from '../home-menu'
import ConversationList from './conversations-list'

function ConversationsContainer() {
  const { selectedConversation } = useConversationContext()
  const [activeTab, setActiveTab] = useState<ConversationType>(ConversationEnum.ALL)
  const [searchQuery, setSearchQuery] = useState('')
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('')

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery)
    }, 500)

    return () => clearTimeout(timer)
  }, [searchQuery])

  const handleCloseSearch = () => {
    setSearchQuery('')
    setDebouncedSearchQuery('')
  }

  return (
    <aside
      className={cn('flex h-full w-full flex-col overflow-y-hidden md:w-2/7 md:border-r', {
        'hidden md:flex': !!selectedConversation,
      })}
    >
      <div
        className={cn(
          'bg-background flex w-full flex-col gap-4 px-2 py-3 md:p-4',
          'sticky top-0 right-0 z-10'
        )}
      >
        <div className='flex items-center justify-between'>
          <Logo />
          <div className='flex items-center gap-1'>
            <CreateNewConversation />
            <HomeMenu />
          </div>
        </div>
        <SearchInput value={searchQuery} onChange={setSearchQuery} onClear={handleCloseSearch} />

        <Tabs tabs={HOME_TABS} activeTab={activeTab} setActiveTab={setActiveTab} />
      </div>

      <ConversationList debouncedSearchQuery={debouncedSearchQuery} activeTab={activeTab} />
    </aside>
  )
}

export default ConversationsContainer
