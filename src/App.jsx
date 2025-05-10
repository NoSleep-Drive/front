import React from 'react';
import Layout from './pages/Layout';
import { Routes, Route } from 'react-router-dom';
import '../index.css';

import Dashboard from './pages/Dashboard';
import DriverDrowsiness from './components/DrowsyStatsModal';
import DrowsinessDetail from './pages/DrowsinessDetail';
import DrowsinessSearch from './pages/DrowsinessSearch';
import Onboarding from './pages/Onboarding';
import Settings from './pages/Settings';
import SignUp from './pages/SignUp';
import VehicleManagement from './pages/VehicleManagement';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Dashboard />} />
        <Route path="driver/:id/stats" element={<DriverDrowsiness />} />
        <Route path="detail/:id" element={<DrowsinessDetail />} />
        <Route path="search" element={<DrowsinessSearch />} />
        <Route path="onboarding" element={<Onboarding />} />
        <Route path="settings" element={<Settings />} />
        <Route path="signup" element={<SignUp />} />
        <Route path="vehicles" element={<VehicleManagement />} />
      </Route>
    </Routes>
  );
}

export default App;
