import { React, useEffect, useState } from 'react';
import VehicleTable from '../components/VehicleTable';
import VehicleRegisterSection from '../components/VehicleRegisterSection';
import { getVehicles } from '../api/vehicleApi';

export default function VehicleManagement() {
  const [vehicles, setVehicles] = useState([]);
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        const data = await getVehicles(100, 0, token);
        setVehicles(data);
      } catch (error) {
        console.error('🚨 차량 조회 실패:', error);
      }
    };

    fetchVehicles();
  }, [token]);

  return (
    <div className="flex flex-col gap-10 px-4">
      <h1 className="head1">차량 등록 관리</h1>
      <VehicleRegisterSection setData={setVehicles} token={token} />
      <VehicleTable data={vehicles} setData={setVehicles} token={token} />
    </div>
  );
}
