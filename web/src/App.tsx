import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom'
import { Toaster } from 'sonner'
import { ProtectedRoute, PublicRoute } from './components/route-guard'
import { AuthProvider } from './contexts/AuthContext'
import Signin from './pages/auth/signin'
import Signup from './pages/auth/signup'
import Home from './pages/home'

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
          <Routes>
            <Route element={<PublicRoute />}>
              <Route path='/auth/signin' element={<Signin />} />
            </Route>

            <Route element={<PublicRoute />}>
              <Route path='/auth/signup' element={<Signup />} />
            </Route>

            <Route element={<ProtectedRoute />}>
              <Route path='/' element={<Home />} />
            </Route>
          </Routes>
          <Toaster position='top-right' richColors />
        </AuthProvider>
      </Router>
    </QueryClientProvider>
  )
}

export default App
