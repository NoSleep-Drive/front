import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { createPortal } from 'react-dom';
import InputField from './InputField';
import Button from './Button';

export default function DriverAssignModal({
  isOpen,
  onClose,
  onConfirm,
  vehicleNumber,
}) {
  const [driverName, setDriverName] = useState('');

  if (!isOpen) return null;

  const generateHash = async (name) => {
    const encoder = new TextEncoder();
    const now = new Date().toISOString();
    const data = encoder.encode(`${name}|${now}`);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    return Array.from(new Uint8Array(hashBuffer))
      .map((b) => b.toString(16).padStart(2, '0'))
      .join('');
  };

  const handleRegister = async () => {
    if (!driverName) return;
    const driverHash = await generateHash(driverName);
    onConfirm({ driverName, driverHash, vehicleNumber });
    onClose();
  };

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-400/50 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
        <h2 className="head2 mb-4 text-center">운전자 등록</h2>
        <p className="text-cornflower-950 mb-6 text-center text-xl font-normal whitespace-pre-line">
          차량 <strong>{vehicleNumber}</strong>에{'\n'}
          등록할 운전자 정보를 입력하세요.
        </p>
        <div className="space-y-4">
          <InputField
            label="운전자 이름"
            placeholder="운전자 이름을 입력하세요."
            value={driverName}
            onChange={(name, value) => setDriverName(value)}
          />
        </div>

        <div className="mt-6 flex justify-end gap-2">
          <Button label="취소" variant="white" onClick={onClose} />
          <Button label="등록" variant="main" onClick={handleRegister} />
        </div>
      </div>
    </div>,
    document.body
  );
}

DriverAssignModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired,
  vehicleNumber: PropTypes.string.isRequired,
};
