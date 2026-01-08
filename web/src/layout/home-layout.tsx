import { useIsMobile } from '@/hooks/useMediaQuery'
import Home from '@/pages/home'
import { Outlet, useLocation } from 'react-router-dom'

export default function HomeLayout() {
  const { isMobile } = useIsMobile()
  const { pathname } = useLocation()

  const isRoot = pathname === '/'

  return (
    <>
      {(!isMobile || isRoot) && <Home />}
      <Outlet />
    </>
  )
}
