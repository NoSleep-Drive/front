import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Header from '../components/Header';

export default function Layout() {
  const location = useLocation();
  const isAuthPage =
    location.pathname === '/signup' || location.pathname === '/';

  return (
    <div className="flex min-h-screen flex-col">
      {!isAuthPage && <Header companyName="ㅇㅇㅇ 업체" />}

      <main
        className={`flex-1 ${isAuthPage ? 'bg-white p-0' : 'bg-gray-100 p-6'}`}
      >
        <Outlet />
      </main>
    </div>
  );
}
