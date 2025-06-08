import React, { useState, useRef, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from '@/pages/Layout';
import '../index.css';

import Dashboard from '@/pages/Dashboard/Dashboard';
import DrowsinessDetail from '@/pages/DrowsinessDetail';
import DrowsinessSearch from '@/pages/DrowsinessSearch';
import WelcomePage from '@/pages/WelcomePage';
import SignUp from '@/pages/SignUp';
import EditProfile from '@/pages/EditProfile/EditProfile';
import VehicleManagement from '@/pages/VehicleManagement';
import { recoverMappingsIfEmpty } from './utils/mappingUtils';
import { DriverIndexMapContext } from '@/contexts/DriverIndexMapContext';
import { CompanyProvider } from '@/contexts/CompanyContext.jsx';

function App() {
  const driverIndexMapRef = useRef({});
  const deviceUidMapRef = useRef({});
  const setDriverIndexMap = useState({})[1];
  useEffect(() => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      recoverMappingsIfEmpty(driverIndexMapRef, deviceUidMapRef);
    } else {
      console.log('로그인 상태 아님. 매핑 복구 건너뜀');
    }
  }, []);
  return (
    <DriverIndexMapContext.Provider
      value={{
        driverIndexMapRef,
        setDriverIndexMap,
        deviceUidMapRef,
      }}
    >
      <CompanyProvider>
        <Routes>
          <Route path="/signup" element={<SignUp />} />
          <Route element={<Layout />}>
            <Route index element={<WelcomePage />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="drowsiness/search" element={<DrowsinessSearch />} />
            <Route path="drowsiness/:id" element={<DrowsinessDetail />} />
            <Route path="edit" element={<EditProfile />} />
            <Route path="vehicles" element={<VehicleManagement />} />
          </Route>
        </Routes>
      </CompanyProvider>
    </DriverIndexMapContext.Provider>
  );
}

export default App;
