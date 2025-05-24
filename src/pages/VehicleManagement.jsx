import { React, useEffect, useState } from 'react';
import VehicleTable from '@/components/VehicleTable';
import VehicleRegisterSection from '@/components/VehicleRegisterSection';
import { getVehicles } from '@/api/vehicleApi';
export default function VehicleManagement() {
  const [vehicles, setVehicles] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  useEffect(() => {
    const fetchVehicles = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await getVehicles(100, 0);
        setVehicles(data);
      } catch (error) {
        console.error('🚨 차량 조회 실패:', error);
        setError('차량 정보를 불러오는데 실패했습니다.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchVehicles();
  }, []);

  return (
    <div className="flex flex-col gap-10 px-4">
      <h1 className="head1">차량 등록 관리</h1>
      {isLoading && <p className="text text-center">데이터를 불러오는 중...</p>}
      {error && <p className="text-center text-red-500">{error}</p>}
      <VehicleRegisterSection setData={setVehicles} />
      <VehicleTable data={vehicles} setData={setVehicles} />
    </div>
  );
}
