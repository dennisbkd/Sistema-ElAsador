import { SideBar } from '../components/SideBar'
import { Outlet } from 'react-router'

export const SideBarLayout = () => {
  return (
    <div className="flex h-screen">
      <SideBar />
      <main className="flex-1 bg-gray-50 overflow-auto">
        <Outlet />
      </main>
    </div>
  )
}
