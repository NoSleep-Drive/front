import React from 'react';
import PropTypes from 'prop-types';
import { createPortal } from 'react-dom';
import { calculateDriverSleepStats } from '../utils/calculateDriverSleepStats.js';
export default function DrowsyStatsModal({ isOpen, onConfirm, onClose, data }) {
  if (!isOpen) return null;
  const { sleepList, driverIndexMap, vehicleNumber } = data;
  const driverHashes = Object.keys(driverIndexMap);

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-400/50 backdrop-blur-sm">
      <div className="w-[90%] max-w-md rounded-2xl bg-white p-6 shadow-lg">
        <h2 className="head1 mb-6 text-center">운전자 졸음 통계</h2>

        {driverHashes.map((driverHash) => {
          const index = driverIndexMap[driverHash];
          const { totalCount, peakTime } = calculateDriverSleepStats(
            sleepList,
            driverHash
          );

          return (
            <div
              key={driverHash}
              className="mb-6 border-b pb-4 last:border-none"
            >
              <div className="mb-2 flex items-center justify-between px-2">
                <div className="caption-bold">운전자 {index}</div>
                <div className="caption">{vehicleNumber}</div>
              </div>

              <div className="flex justify-around gap-4 text-center">
                <div className="flex flex-col items-center gap-2">
                  <div className="text-sm text-gray-600">총 졸음 감지 횟수</div>
                  <div className="text-cornflower-600 text-3xl font-bold">
                    {totalCount}회
                  </div>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <div className="text-sm text-gray-600">
                    최다 졸음 감지 시간대
                  </div>
                  <div className="text-cornflower-600 text-2xl font-bold">
                    {peakTime}
                  </div>
                </div>
              </div>
            </div>
          );
        })}

        <div className="mt-4 text-center">
          <button
            type="button"
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
    vehicleNumber: PropTypes.string.isRequired,
    sleepList: PropTypes.arrayOf(
      PropTypes.shape({
        driverHash: PropTypes.string.isRequired,
        detectedTime: PropTypes.string.isRequired,
      })
    ).isRequired,
    driverIndexMap: PropTypes.object.isRequired,
  }).isRequired,
};
