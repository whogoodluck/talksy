import type { Conversation } from '@/types/conversation'
import {
  createContext,
  useContext,
  useState,
  type Dispatch,
  type ReactNode,
  type SetStateAction,
} from 'react'

interface ConversationContextType {
  selectedConversation: Conversation | null
  setSelectedConversation: Dispatch<SetStateAction<Conversation | null>>
}

const conversationContext = createContext<ConversationContextType>({
  selectedConversation: null,
  setSelectedConversation: () => {},
})

interface ConversationProviderProps {
  children: ReactNode
}

export function ConversationProvider({ children }: ConversationProviderProps) {
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null)

  return (
    <conversationContext.Provider value={{ selectedConversation, setSelectedConversation }}>
      {children}
    </conversationContext.Provider>
  )
}

export const useConversationContext = () => {
  return useContext(conversationContext)
}
