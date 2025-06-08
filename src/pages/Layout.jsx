import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Header from '@/components/Header';
import { useCompany } from '@/contexts/CompanyContext.jsx';
export default function Layout() {
  const location = useLocation();
  const isAuthPage =
    location.pathname === '/signup' || location.pathname === '/';
  const { companyName, setCompanyName, isCompanyLoaded } = useCompany();
  return (
    <div className="flex min-h-screen flex-col">
      {!isAuthPage && isCompanyLoaded && <Header companyName={companyName} />}

      <main
        className={`flex-1 ${isAuthPage ? 'bg-white p-0' : 'bg-gray-100 p-6'}`}
      >
        <Outlet context={{ companyName, setCompanyName }} />
      </main>
    </div>
  );
}
