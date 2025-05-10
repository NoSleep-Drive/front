import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from '../components/Header';

export default function Layout() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header companyName='ㅇㅇㅇ 업체'>
        </Header> 

      <main className="flex-1 p-6  bg-gray-100" >
        <Outlet/>
        </main>
      
      
    </div>

    
  );
}
