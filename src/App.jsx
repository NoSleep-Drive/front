import { React, useRef } from 'react';
import Layout from './pages/Layout';
import { Routes, Route } from 'react-router-dom';
import '../index.css';

import Dashboard from './pages/Dashboard';
import DriverDrowsiness from './components/DrowsyStatsModal';
import DrowsinessDetail from './pages/DrowsinessDetail';
import DrowsinessSearch from './pages/DrowsinessSearch';
import WelcomePage from './pages/WelcomePage';
import Settings from './pages/Settings';
import SignUp from './pages/SignUp';
import EditProfile from './pages/EditProfile/EditProfile';
import VehicleManagement from './pages/VehicleManagement';
import { DriverIndexMapContext } from './contexts/DriverIndexMapContext';

function App() {
  const driverIndexMapRef = useRef({});
  return (
    <DriverIndexMapContext.Provider value={{ driverIndexMapRef }}>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<WelcomePage />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="driver/:id/stats" element={<DriverDrowsiness />} />
          <Route path="drowsiness/search" element={<DrowsinessSearch />} />
          <Route path="drowsiness/:id" element={<DrowsinessDetail />} />
          <Route path="settings" element={<Settings />} />
          <Route path="signup" element={<SignUp />} />
          <Route path="edit" element={<EditProfile />} />
          <Route path="vehicles" element={<VehicleManagement />} />
        </Route>
      </Routes>
    </DriverIndexMapContext.Provider>
  );
}

export default App;
