import React, { useState } from 'react';
//import InputField from '../components/InputField';
//import Button from '../components/Button';
import VehicleTable from '../components/VehicleTable';
import VehicleRegisterSection from '../components/VehicleRegisterSection';

// 샘플 데이터 (API로 교체 예정)
const sampleData = [
  {
    vehicleNumber: '111가 1111',
    deviceUid: 'abc123',
    createdDate: '2021-10-10',
    isRented: false,
  },
  {
    vehicleNumber: '222가 2222',
    deviceUid: 'cam456',
    createdDate: '2022-02-20',
    isRented: true,
  },
  {
    vehicleNumber: '333가 3333',
    deviceUid: 'cam789',
    createdDate: '2023-05-01',
    isRented: false,
  },
];

export default function VehicleManagement() {
  const [vehicles, setVehicles] = useState(sampleData);

  return (
    <div className="flex flex-col gap-10 px-4">
      <h1 className="head1 ">차량 등록 관리</h1>

      <VehicleRegisterSection vehicles={vehicles} setVehicles={setVehicles} />
      <VehicleTable data={vehicles}/> 
    </div>
  );
}
