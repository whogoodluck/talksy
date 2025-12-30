import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom'
import ComingSoon from './components/coming-soon'
import NavigationLayout from './components/navigation-layout'
import { ProtectedRoute, PublicRoute } from './components/route-guard'
import { Toaster } from './components/ui/sonner'
import Signin from './pages/auth/signin'
import Signup from './pages/auth/signup'
import VerifyEmail from './pages/auth/verify-email'
import Home from './pages/home'
import { ConversationProvider } from './providers/conversation.provider'
import { SocketProvider } from './providers/socket.provider'
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
      <SocketProvider>
        <Router>
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
                  <Route
                    path='/'
                    element={
                      <NavigationLayout>
                        <Home />
                      </NavigationLayout>
                    }
                  />
                </Route>

                <Route element={<ProtectedRoute />}>
                  <Route
                    path='*'
                    element={
                      <NavigationLayout>
                        <ComingSoon />
                      </NavigationLayout>
                    }
                  />
                </Route>
              </Routes>
              <Toaster />
            </ConversationProvider>
          </ThemeProvider>
        </Router>
      </SocketProvider>
    </QueryClientProvider>
  )
}

export default App
