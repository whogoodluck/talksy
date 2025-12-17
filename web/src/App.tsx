import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom'
import ComingSoon from './components/coming-soon'
import { ProtectedRoute, PublicRoute } from './components/route-guard'
import { Toaster } from './components/ui/sonner'
import Signin from './pages/auth/signin'
import Signup from './pages/auth/signup'
import VerifyEmail from './pages/auth/verify-email'
import Home from './pages/home'
import { AuthProvider } from './providers/auth.provider'
import { ConversationProvider } from './providers/conversation.provider'
import { ThemeProvider } from './providers/theme-provider'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      refetchOnWindowFocus: false,
    },
  },
})

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <AuthProvider>
          <ThemeProvider>
            <ConversationProvider>
              <Routes>
                <Route element={<PublicRoute />}>
                  <Route path='/auth/signin' element={<Signin />} />
                </Route>

                <Route element={<PublicRoute />}>
                  <Route path='/auth/signup' element={<Signup />} />
                </Route>

                <Route element={<PublicRoute />}>
                  <Route path='/auth/verify-email' element={<VerifyEmail />} />
                </Route>

                <Route element={<ProtectedRoute />}>
                  <Route path='/' element={<Home />} />
                </Route>

                <Route path='*' element={<ComingSoon />} />
              </Routes>
              <Toaster />
            </ConversationProvider>
          </ThemeProvider>
        </AuthProvider>
      </Router>
    </QueryClientProvider>
  )
}

export default App
