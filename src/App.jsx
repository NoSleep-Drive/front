import React, { useState, useRef, useEffect } from 'react';
import { loadDriverMapsFromStorage } from './utils/storageUtils';
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
import { DriverIndexMapContext } from '@/contexts/DriverIndexMapContext';
function App() {
  const driverIndexMapRef = useRef({});
  const deviceUidMapRef = useRef({});
  const setDriverIndexMap = useState({})[1];
  useEffect(() => {
    loadDriverMapsFromStorage(driverIndexMapRef, deviceUidMapRef);
  }, []);
  return (
    <DriverIndexMapContext.Provider
      value={{
        driverIndexMapRef,
        setDriverIndexMap,
        deviceUidMapRef,
      }}
    >
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
    </DriverIndexMapContext.Provider>
  );
}

export default App;
