import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from '../components/Header';

export default function Layout() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header companyName="ㅇㅇㅇ 업체"></Header>

      <main className="flex-1 bg-gray-100 p-6">
        <Outlet />
      </main>
    </div>
  );
}
