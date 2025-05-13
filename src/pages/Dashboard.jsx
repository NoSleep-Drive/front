import { React, useState } from 'react';
import { Link } from 'react-router-dom';
import { Download, ChevronRight, Car, EyeClosed, VideoOff } from 'lucide-react';

import SummaryCard from '../components/SummaryCard';
import VehicleCard from '../components/VehicleCard';
import BaseTable from '../components/BaseTable';
import VehicleEditModal from '../components/VehicleEditModal';
import VehicleDeleteModal from '../components/VehicleDeleteModal.jsx';
//임시 졸음 데이터
const sleepData = [
  {
    uid: 1,
    vehicleNumber: '111가 1111',
    detectedTime: '2025-05-07T12:34:56',
    driverHash: 'abc123',
  },
  {
    uid: 2,
    vehicleNumber: '222가 1111',
    detectedTime: '2025-05-07T17:34:56',
    driverHash: 'abc333',
  },
  {
    uid: 3,
    vehicleNumber: '333가 1111',
    detectedTime: '2025-05-07T02:34:56',
    driverHash: 'abc777',
  },
  {
    uid: 1,
    vehicleNumber: '111가 1111',
    detectedTime: '2025-05-07T12:34:56',
    driverHash: 'abc123',
  },
  {
    uid: 2,
    vehicleNumber: '222가 1111',
    detectedTime: '2025-05-07T17:34:56',
    driverHash: 'abc333',
  },
  {
    uid: 3,
    vehicleNumber: '333가 1111',
    detectedTime: '2025-05-07T02:34:56',
    driverHash: 'abc777',
  },
  {
    uid: 1,
    vehicleNumber: '111가 1111',
    detectedTime: '2025-05-07T12:34:56',
    driverHash: 'abc123',
  },
  {
    uid: 2,
    vehicleNumber: '222가 1111',
    detectedTime: '2025-05-07T17:34:56',
    driverHash: 'abc333',
  },
  {
    uid: 3,
    vehicleNumber: '333가 1111',
    detectedTime: '2025-05-07T02:34:56',
    driverHash: 'abc777',
  },
];

export default function Dashboard() {
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const openEditModal = (vehicle) => {
    setSelectedVehicle(vehicle);
    setShowEditModal(true);
  };

  const openDeleteModal = (vehicle) => {
    setSelectedVehicle(vehicle);
    setShowDeleteModal(true);
  };

  const handleDownload = async (uid) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/sleep/${uid}/video/download`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        if (response.status === 401)
          throw new Error('인증 정보가 유효하지 않습니다.');
        if (response.status === 404)
          throw new Error('해당 영상이 존재하지 않습니다.');
        throw new Error('다운로드에 실패했습니다.');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `sleep_${uid}.mp4`;
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      alert(err.message);
    }
  };

  const columns = [
    { key: 'vehicleNumber', label: '차량 번호' },
    { key: 'driverHash', label: '운전자' },
    {
      key: 'detectedTime',
      label: '감지 날짜',
      render: (value) => new Date(value).toLocaleDateString(),
    },
    {
      key: 'download',
      label: '다운로드',
      render: (_, row) => (
        <button
          type="button"
          onClick={() => handleDownload(row.uid)}
          className="text-cornflower-950 hover:bg-cornflower-100 hover:text-cornflower-600 inline-flex items-center justify-center rounded-xl p-2 transition-colors"
        >
          <Download size={18} />
        </button>
      ),
    },
  ];
  return (
    <div className="flex flex-col gap-10 px-4">
      <section>
        <h2 className="head1 mb-4">대시보드 요약</h2>
        <div className="mx-auto grid w-full max-w-6xl grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
          <SummaryCard
            label="총 등록 차량 수"
            count={125}
            icon={<Car size={24} />}
          />{' '}
          {/*TODO: 총 차량수 api 연동*/}
          <SummaryCard
            label="오늘 졸음 감지 횟수"
            count={125}
            icon={<EyeClosed size={24} />}
          />{' '}
          {/*TODO: api 연동 - 졸음 감지 횟수*/}
          <SummaryCard
            label="이상 카메라 수"
            count={125}
            icon={<VideoOff size={24} />}
          />{' '}
          {/*TODO: api 연동 - 이상 카메라 수 */}
        </div>
      </section>

      <section>
        <div className="mb-6 flex items-center gap-2">
          <h2 className="head1">최근 졸음 데이터</h2>
          <Link
            to="/drowsiness/search"
            className="text-cornflower-950 hover:text-cornflower-500 transition"
            aria-label="최근 졸음 데이터 더보기"
          >
            <ChevronRight size={20} />
          </Link>
        </div>
        <div className="mx-auto w-full max-w-6xl overflow-x-auto rounded-xl">
          <BaseTable columns={columns} data={sleepData.slice(0, 5)} />
        </div>
      </section>

      <section>
        <div className="mb-6 flex items-center gap-2">
          <h2 className="head1">최근 등록된 차량</h2>
          <Link
            to="/vehicles"
            className="text-cornflower-950 hover:text-cornflower-500 transition"
            aria-label="최근 등록된 차량 더보기"
          >
            <ChevronRight size={20} />
          </Link>
        </div>
        <div className="mx-auto grid w-full max-w-6xl grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
          {/* TODO: API 연동 - 최근 등록 차량 3대*/}
          <VehicleCard
            vehicleNumber={'99카 9999'}
            deviceUid={'XYZ789'}
            createdDate={new Date()}
            onEdit={() =>
              openEditModal({ vehicleNumber: '99카 9999', deviceUid: 'XYZ789' })
            }
            onDelete={() =>
              openDeleteModal({
                vehicleNumber: '99카 9999',
                deviceUid: 'XYZ789',
              })
            }
          />
          <VehicleCard
            vehicleNumber={'99카 9999'}
            deviceUid={'XYZ789'}
            createdDate={new Date()}
            onEdit={() =>
              openEditModal({ vehicleNumber: '99카 9999', deviceUid: 'XYZ789' })
            }
            onDelete={() =>
              openDeleteModal({
                vehicleNumber: '99카 9999',
                deviceUid: 'XYZ789',
              })
            }
          />
          <VehicleCard
            vehicleNumber={'99카 9999'}
            deviceUid={'XYZ789'}
            createdDate={new Date()}
            onEdit={() =>
              openEditModal({ vehicleNumber: '99카 9999', deviceUid: 'XYZ789' })
            }
            onDelete={() =>
              openDeleteModal({
                vehicleNumber: '99카 9999',
                deviceUid: 'XYZ789',
              })
            }
          />
        </div>
      </section>
      {showEditModal && selectedVehicle && (
        <VehicleEditModal
          isOpen={true}
          originalVehicle={selectedVehicle}
          onClose={() => setShowEditModal(false)}
          onConfirm={(newNumber) => {
            console.log('수정된 번호:', newNumber);
            setShowEditModal(false);
          }}
        />
      )}

      {showDeleteModal && selectedVehicle && (
        <VehicleDeleteModal
          isOpen={true}
          vehicleNumber={selectedVehicle.vehicleNumber}
          onClose={() => setShowDeleteModal(false)}
          onConfirm={() => {
            console.log('삭제 확인됨:', selectedVehicle);
            setShowDeleteModal(false);
          }}
        />
      )}
    </div>
  );
}
