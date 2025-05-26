import PropTypes from 'prop-types';
import { registerVehicle, getVehicles } from '../api/vehicleApi';
import React, { useState } from 'react';
import InputField from '@/components/InputField';
import Button from '@/components/Button';
import useDriverIndexMap from '@/hooks/useDriverIndexMap';
import { saveDriverMapsToStorage } from '@/utils/storageUtils';
export default function VehicleRegisterSection({ setData }) {
  const { driverIndexMapRef, deviceUidMapRef } = useDriverIndexMap();

  const [vehicleNumber, setVehicleNumber] = useState('');
  const [deviceUid, setDeviceUid] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleRegister = async () => {
    if (!vehicleNumber || !deviceUid) {
      alert('차량 번호와 기기 ID를 모두 입력해 주세요.');
      return;
    }
    setIsLoading(true);
    try {
      await registerVehicle(vehicleNumber, deviceUid);
      deviceUidMapRef.current[vehicleNumber] = deviceUid;
      saveDriverMapsToStorage(driverIndexMapRef, deviceUidMapRef);
      const updated = await getVehicles(30, 0);
      setData(updated);
      setVehicleNumber('');
      setDeviceUid('');
      alert('차량 등록 완료!');
    } catch (error) {
      if (error.response?.status === 409) {
        alert(error.response.data.message);
      }
      console.error('🚨 차량 등록 실패:', error);
      alert('차량 등록 실패');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section>
      <h2 className="head2 mb-4">새 차량 등록</h2>
      <div className="mx-auto flex max-w-4xl flex-row items-end justify-center gap-4 sm:gap-6">
        <InputField
          label="차량 번호"
          name="vehicleNumber"
          placeholder="차량 번호를 입력하세요."
          value={vehicleNumber}
          onChange={(name, value) => setVehicleNumber(value)}
        />
        <InputField
          label="기기 ID"
          name="deviceUid"
          placeholder="기기 ID를 입력하세요."
          value={deviceUid}
          onChange={(name, value) => setDeviceUid(value)}
        />
        <div>
          <Button
            label="등록"
            size="md"
            variant="main"
            onClick={handleRegister}
            disabled={isLoading}
            isLoading={isLoading}
          />
        </div>
      </div>
    </section>
  );
}

VehicleRegisterSection.propTypes = {
  setData: PropTypes.func.isRequired,
};
