import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { createPortal } from 'react-dom';
import BaseTable from './BaseTable';
import Pagination from './Pagination';
import { fetchDriversByDeviceUid } from '@/api/driverApi';
import Button from './Button';
const DriverListModal = ({ isOpen, onClose, deviceUid }) => {
  const [drivers, setDrivers] = useState([]);
  const [pageIdx, setPageIdx] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const pageSize = 5;

  useEffect(() => {
    if (isOpen && deviceUid) fetchDrivers();
  }, [isOpen, deviceUid, pageIdx]);

  const fetchDrivers = async () => {
    try {
      const result = await fetchDriversByDeviceUid(
        deviceUid,
        pageSize,
        pageIdx
      );
      setDrivers(result);
      setTotalPages(result.length < pageSize ? pageIdx + 1 : pageIdx + 2);
    } catch (err) {
      console.error('운전자 목록 조회 실패:', err);
    }
  };

  const columns = [
    {
      key: 'index',
      label: '운전자',
      render: (_, __, idx) => `운전자 ${idx + 1 + pageIdx * pageSize}`,
    },
    {
      key: 'startTime',
      label: '대여 시작 시간',
      render: (value) => new Date(value).toLocaleString(),
    },
    {
      key: 'endTime',
      label: '반납 시간',
      render: (value) => (value ? new Date(value).toLocaleString() : '진행 중'),
    },
  ];

  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-400/50 backdrop-blur-sm">
      <div className="w-full max-w-2xl rounded-2xl bg-white p-6 shadow-xl">
        <h2 className="head2 mb-4 text-center">운전자 목록</h2>
        <div className="mb-6 text-center text-xl font-normal whitespace-pre-line">
          차량 <strong>{deviceUid}</strong>의 운전자 목록입니다.
        </div>
        <BaseTable columns={columns} data={drivers} />
        <div className="mt-6">
          <Pagination
            page={pageIdx + 1}
            setPage={(newPage) => setPageIdx(newPage - 1)}
            totalPages={totalPages}
          />
        </div>
        <div className="mt-6 flex flex-col items-center justify-end">
          <Button
            size="sm"
            className="h-10 w-16"
            label="확인"
            onClick={onClose}
          >
            닫기
          </Button>
        </div>
      </div>
    </div>,
    document.body
  );
};

DriverListModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  deviceUid: PropTypes.string.isRequired,
};

export default DriverListModal;
