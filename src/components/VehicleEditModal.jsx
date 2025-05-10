import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { createPortal } from 'react-dom';
import InputField from './InputField';
import Button from './Button';

export default function VehicleEditModal({
  isOpen,
  onClose,
  onConfirm,
  originalVehicle,
}) {
  const [vehicleNumber, setVehicleNumber] = useState(
    originalVehicle?.vehicleNumber || ''
  );

  useEffect(() => {
    setVehicleNumber(originalVehicle?.vehicleNumber || '');
  }, [originalVehicle]);

  if (!isOpen) return null;

  return createPortal(
<div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-400/50 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
        <h2 className="head2 mb-4 text-center">차량 번호 수정</h2>
        <InputField
          label="차량 번호"
          value={vehicleNumber}
          onChange={(e) => setVehicleNumber(e.target.value)}
        />
        <div className="mt-6 flex justify-end gap-2">
          <Button label="취소" variant="white" onClick={onClose} />
          <Button
            label="저장"
            variant="main"
            onClick={() => onConfirm(vehicleNumber)}
          />
        </div>
      </div>
    </div>,
    document.body
  );
}

VehicleEditModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired,
  originalVehicle: PropTypes.shape({
    vehicleNumber: PropTypes.string.isRequired,
  }),
};
