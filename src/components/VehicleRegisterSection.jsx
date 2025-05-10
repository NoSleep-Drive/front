import React, { useState } from 'react';
import InputField from '../components/InputField';
import Button from '../components/Button';
import PropTypes from 'prop-types';

export default function VehicleRegisterSection({ vehicles, setVehicles }) {
  const [vehicleNumber, setVehicleNumber] = useState('');
  const [deviceUid, setDeviceUid] = useState('');

  const handleRegister = () => {
    if (!vehicleNumber || !deviceUid) return;

    const newVehicle = {
      vehicleNumber,
      deviceUid,
      createdDate: new Date().toISOString(),
      isRented: false,
    };

    setVehicles([...vehicles, newVehicle]);
    setVehicleNumber('');
    setDeviceUid('');
    // TODO: 유효성 검사 + 등록 API 연결
  };

  return (
    <section>
      <h2 className="head2 mb-4">새 차량 등록</h2>

      <div className="mx-auto flex max-w-4xl flex-row justify-center gap-4 sm:gap-6">
        <InputField
          label="차량 번호"
          placeholder="차량 번호를 입력하세요."
          value={vehicleNumber}
          onChange={(e) => setVehicleNumber(e.target.value)}
        />
        <InputField
          label="카메라 ID"
          placeholder="카메라 ID를 입력하세요."
          value={deviceUid}
          onChange={(e) => setDeviceUid(e.target.value)}
        />
        <div className="mt-[31px] h-[62px]">
          <Button
            label="등록"
            size="lg"
            variant="main"
            onClick={handleRegister}
            className=""
          />
        </div>
      </div>
    </section>
  );
}

VehicleRegisterSection.propTypes = {
  vehicles: PropTypes.array.isRequired,
  setVehicles: PropTypes.func.isRequired,
};
