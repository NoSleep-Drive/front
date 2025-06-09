import React, { useMemo, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { createPortal } from 'react-dom';
import { getSleepCountByDriver } from '@/api/sleepApi';
import { calculateDriverSleepStats } from '@/utils/calculateDriverSleepStats.js';
export default function DrowsyStatsModal({ isOpen, onConfirm, onClose, data }) {
  if (!isOpen) return null;
  const { sleepList, driverIndexMap, vehicleNumber } = data;
  const [totalCount, setTotalCount] = useState(null);

  const status = useMemo(() => {
    const driverHashes = Object.keys(driverIndexMap);
    if (driverHashes.length === 0) return null;

    const latestDriverHash = driverHashes[driverHashes.length - 1];
    if (!latestDriverHash) return null;

    const index = driverIndexMap[latestDriverHash];
    const peakTime = calculateDriverSleepStats(sleepList, latestDriverHash);

    return {
      index,
      peakTime,
      hash: latestDriverHash,
    };
  }, [driverIndexMap, sleepList]);
  useEffect(() => {
    if (!isOpen || !status?.hash) return;

    const fetchCount = async () => {
      try {
        const count = await getSleepCountByDriver(status.hash);
        setTotalCount(count);
      } catch (e) {
        console.error('총 졸음 감지 횟수 조회 실패:', e);
        setTotalCount('-');
      }
    };

    fetchCount();
  }, [isOpen, status?.hash]);

  if (!status) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-400/50 backdrop-blur-sm">
      <div className="w-[90%] max-w-md rounded-2xl bg-white p-6 shadow-lg">
        <h2 className="head1 mb-6 text-center">운전자 졸음 통계</h2>
        <div key={status.hash} className="mb-6">
          <div className="mb-2 flex items-center justify-between px-2">
            <div className="caption-bold">
              {status.index !== undefined
                ? `운전자 ${status.index + 1}`
                : '운전자 ?'}
            </div>

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
              <div className="text-sm text-gray-600">최다 졸음 감지 시간대</div>
              <div className="text-cornflower-600 text-2xl font-bold">
                {status.peakTime}
              </div>
            </div>
          </div>
        </div>
        <div className="mt-4 text-center">
          <button
            type="button"
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className="bg-cornflower-400 hover:bg-cornflower-500 rounded-xl px-6 py-2 text-white transition"
          >
            닫기
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
