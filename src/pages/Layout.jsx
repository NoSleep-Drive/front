import React, { useEffect, useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Header from '@/components/Header';
import { getCompanyInformation } from '@/api/companyApi';

export default function Layout() {
  const location = useLocation();
  const isAuthPage =
    location.pathname === '/signup' || location.pathname === '/';
  const [companyName, setCompanyName] = useState(
    localStorage.getItem('companyName') || '회사 명'
  );
  useEffect(() => {
    const token = localStorage.getItem('auth_token');
    if (!token) {
      console.warn('토큰 없음, 회사 정보 요청 건너뜀');
      return;
    }
    (async () => {
      try {
        const result = await getCompanyInformation();
        setCompanyName(result?.companyName);
        localStorage.setItem('companyName', result?.companyName);
      } catch (err) {
        console.error('회사 정보 불러오기 실패:', err.message);
        setCompanyName('');
      }
    })();
  }, []);

  return (
    <div className="flex min-h-screen flex-col">
      {!isAuthPage && <Header companyName={companyName} />}

      <main
        className={`flex-1 ${isAuthPage ? 'bg-white p-0' : 'bg-gray-100 p-6'}`}
      >
        <Outlet context={{ companyName, setCompanyName }} />
      </main>
    </div>
  );
}
