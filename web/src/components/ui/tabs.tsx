import type { HomeTab } from '@/constants'
import { cn } from '@/lib/utils'
import type { Dispatch, SetStateAction } from 'react'

interface Tab {
  value: string
  label: string
  disabled?: boolean
  icon?: React.ComponentType<{ className?: string }>
}

interface TabsProps {
  tabs: readonly Tab[]
  activeTab: HomeTab
  setActiveTab: Dispatch<SetStateAction<HomeTab>>
  className?: string
}

export function Tabs({ tabs, activeTab, setActiveTab, className }: TabsProps) {
  return (
    <div className={cn('relative flex flex-wrap gap-2', className)}>
      {tabs.map(tab => {
        const isActive = activeTab === tab.label
        const Icon = tab.icon
        return (
          <button
            key={tab.value}
            disabled={tab.disabled}
            className={cn(
              'relative cursor-pointer rounded-full border px-4 py-1 text-sm font-medium whitespace-nowrap',
              'transition-all duration-200 ease-out',
              'disabled:cursor-not-allowed disabled:opacity-50',
              'hover:text-foreground/60 hover:border-foreground/60 hover:bg-foreground/10',
              isActive
                ? 'text-primary bg-primary/20 border-primary hover:text-primary hover:bg-primary/20 hover:border-primary'
                : 'text-muted-foreground'
            )}
            onClick={() => {
              if (!tab.disabled) {
                setActiveTab(tab.label)
              }
            }}
          >
            <span className='flex items-center gap-3'>
              {Icon && <Icon className='size-4' />}
              {tab.value}
            </span>
          </button>
        )
      })}
    </div>
  )
}
