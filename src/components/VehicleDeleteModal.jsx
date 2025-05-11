import React from 'react';
import PropTypes from 'prop-types';
import { createPortal } from 'react-dom';
import Button from './Button';

export default function VehicleDeleteModal({
  isOpen,
  onClose,
  onConfirm,
  vehicleNumber,
}) {
  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-400/50 backdrop-blur-sm">
      <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl">
        <h2 className="head2 mb-4 text-center">차량 삭제 확인</h2>
        <p className="text-cornflower-950 mb-6 text-center text-xl font-normal">
          차량 <strong>{vehicleNumber}</strong>을(를) 삭제할까요?
        </p>
        <div className="flex justify-center gap-2">
          <Button label="취소" variant="white" onClick={onClose} />
          <Button label="삭제" variant="main" onClick={onConfirm} />
        </div>
      </div>
    </div>,
    document.body
  );
}

VehicleDeleteModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired,
  vehicleNumber: PropTypes.string.isRequired,
};
