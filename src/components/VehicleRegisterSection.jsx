import React, { useState } from 'react';
import InputField from '../components/InputField';
import Button from '../components/Button';
import PropTypes from 'prop-types';
export default function VehicleRegisterSection({ data, setData }) {
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

    setData([...data, newVehicle]);
    setVehicleNumber('');
    setDeviceUid('');
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
  data: PropTypes.array.isRequired,
  setData: PropTypes.func.isRequired,
};
