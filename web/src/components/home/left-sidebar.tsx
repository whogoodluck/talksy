import { HOME_TABS } from '@/constants'
import { cn } from '@/lib/utils'
import { useConversationContext } from '@/providers/conversation.provider'
import { ConversationEnum, type ConversationType } from '@/types/conversation'
import { Search, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import Logo from '../common/logo'
import { Input } from '../ui/input'
import { Tabs } from '../ui/tabs'
import ConversationList from './conversation-list'
import { HomeMenu } from './home-menu'

function LeftSidebar() {
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
      className={cn('bg-background flex w-full flex-col border-r md:w-1/4', {
        'hidden md:flex': !!selectedConversation,
      })}
    >
      <div className='flex flex-col gap-4 p-4'>
        <div className='flex items-center justify-between'>
          <Logo />
          <div className='flex items-center'>
            <HomeMenu />
          </div>
        </div>
        <div className='relative'>
          <Search size={20} className='absolute top-1/2 left-5 -translate-y-1/2 transform' />
          <Input
            type='text'
            placeholder='Search'
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className={cn(
              'rounded-full px-12',
              'focus-visible:border-primary focus-visible:border focus-visible:ring-0'
            )}
          />
          {searchQuery && (
            <button
              type='button'
              className='absolute top-1/2 right-4 -translate-y-1/2 cursor-pointer'
              onClick={handleCloseSearch}
              tabIndex={-1}
            >
              <X className='size-4' />
            </button>
          )}
        </div>

        <Tabs tabs={HOME_TABS} activeTab={activeTab} setActiveTab={setActiveTab} />
      </div>

      <div className='flex flex-1 md:px-1'>
        <ConversationList debouncedSearchQuery={debouncedSearchQuery} activeTab={activeTab} />
      </div>
    </aside>
  )
}

export default LeftSidebar
