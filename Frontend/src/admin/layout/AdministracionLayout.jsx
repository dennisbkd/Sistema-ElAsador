
import { Outlet } from 'react-router';
import SideBar from '../../sideBar/layout/SideBar';

export const AdministracionLayout = () => {
  return (
    <div className="flex h-screen bg-gray-50">
      <SideBar />
      <main className="flex-1 overflow-auto p-6">
        <Outlet />
      </main>
    </div>
  );
}
