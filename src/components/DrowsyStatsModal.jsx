import React from 'react';
import PropTypes from 'prop-types';
import { createPortal } from 'react-dom';

export default function DrowsyStatsModal({ isOpen, onConfirm, onClose, data }) {
  if (!isOpen) return null;

  return createPortal(
<div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-400/50 backdrop-blur-sm">
      <div className="w-[90%] max-w-md rounded-2xl bg-white p-6 shadow-lg">
        <h2 className="head1 mb-6 text-center">운전자 졸음 통계</h2>

        <div className="mb-4 flex items-center justify-between px-2">
          <div className="caption-bold">{data.name}님</div>
          <div className="caption">{data.vehicleNumber}</div>
          <div className="caption">{data.dateRange}</div>
        </div>

        <hr className="my-4" />

        <div className="mb-6 flex justify-around gap-4 text-center">
          <div className="flex flex-col items-center gap-2">
            <div className="text-sm text-gray-600">총 졸음 감지 횟수</div>
            <div className="text-cornflower-600 text-3xl font-bold">
              {data.totalCount}회
            </div>
          </div>
          <div className="flex flex-col items-center gap-2">
            <div className="text-sm text-gray-600">최다 졸음 감지 시간대</div>
            <div className="text-cornflower-600 text-2xl font-bold">
              {data.peakTime}
            </div>
          </div>
        </div>

        <div className="text-center">
          <button
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className="bg-cornflower-400 hover:bg-cornflower-500 rounded-xl px-6 py-2 text-white transition"
          >
            확인
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
DrowsyStatsModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onConfirm: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
  data: PropTypes.shape({
    name: PropTypes.string.isRequired,
    vehicleNumber: PropTypes.string.isRequired,
    dateRange: PropTypes.string.isRequired,
    totalCount: PropTypes.number.isRequired,
    peakTime: PropTypes.string.isRequired,
  }).isRequired,
};
