import { React, useState } from 'react';
import InputField from '../components/InputField';
import Button from '../components/Button';
import PropTypes from 'prop-types';
import { registerVehicle, getVehicles } from '../api/vehicleApi';

export default function VehicleRegisterSection({ setData, token }) {
  const [vehicleNumber, setVehicleNumber] = useState('');
  const [deviceUid, setDeviceUid] = useState('');

  const handleRegister = async () => {
    if (!vehicleNumber || !deviceUid) return;

    try {
      await registerVehicle(vehicleNumber, deviceUid, token);
      const updated = await getVehicles(100, 0, token);
      setData(updated);
      setVehicleNumber('');
      setDeviceUid('');
      alert('🚗 차량 등록 완료');
    } catch (error) {
      console.error('🚨 차량 등록 실패:', error);
      alert('차량 등록 실패');
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
          label="카메라 ID"
          name="deviceUid"
          placeholder="카메라 ID를 입력하세요."
          value={deviceUid}
          onChange={(name, value) => setDeviceUid(value)}
        />
        <div>
          <Button
            label="등록"
            size="md"
            variant="main"
            onClick={handleRegister}
          />
        </div>
      </div>
    </section>
  );
}

VehicleRegisterSection.propTypes = {
  setData: PropTypes.func.isRequired,
  token: PropTypes.string.isRequired,
};
