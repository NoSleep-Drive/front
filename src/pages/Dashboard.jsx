import { React, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Download, ChevronRight, Car, EyeClosed, VideoOff } from 'lucide-react';

import SummaryCard from '../components/SummaryCard';
import VehicleCard from '../components/VehicleCard';
import BaseTable from '../components/BaseTable';
import VehicleEditModal from '../components/VehicleEditModal';
import VehicleDeleteModal from '../components/VehicleDeleteModal.jsx';
import { getVehicles, deleteVehicle, updateVehicle } from '../api/vehicleApi';
import { getRecentSleepData } from '../api/dashboardApi';
import {
  getVehicleCount,
  getSleepTodayCount,
  getAbnormalVehicleCount,
} from '../api/dashboardApi';

export default function Dashboard() {
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [recentVehicles, setRecentVehicles] = useState([]);
  const token = localStorage.getItem('token');
  const [recentSleepData, setRecentSleepData] = useState([]);
  const [summaryData, setSummaryData] = useState({
    totalVehicles: 0,
    sleepDetectedToday: 0,
    abnormalVehicles: 0,
  });

  useEffect(() => {
    fetchRecentVehicles();
    fetchRecentSleep();
    fetchSummaryData();
  }, [token]);

  const fetchSummaryData = async () => {
    try {
      const [vehicle, sleep, abnormal] = await Promise.all([
        getVehicleCount(token),
        getSleepTodayCount(token),
        getAbnormalVehicleCount(token),
      ]);

      setSummaryData({
        totalVehicles: vehicle.totalVehicles,
        sleepDetectedToday: sleep.sleepDetectedToday,
        abnormalVehicles: abnormal.abnormalVehicles,
      });
    } catch (err) {
      console.error('대시보드 요약 정보 불러오기 실패:', err);
    }
  };

  const fetchRecentSleep = async () => {
    try {
      const data = await getRecentSleepData(token);
      setRecentSleepData(data);
    } catch (err) {
      console.error(' 졸음 데이터 불러오기 실패:', err);
    }
  };

  const fetchRecentVehicles = async () => {
    try {
      const data = await getVehicles(3, 0, token);
      setRecentVehicles(data);
    } catch (err) {
      console.error('🚨 차량 조회 실패:', err);
      alert('차량 정보를 불러오는 데 실패했습니다.');
    }
  };
  //
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
            count={summaryData.totalVehicles}
            icon={<Car size={24} />}
          />
          <SummaryCard
            label="오늘 졸음 감지 횟수"
            count={summaryData.sleepDetectedToday}
            icon={<EyeClosed size={24} />}
          />
          <SummaryCard
            label="이상 카메라 수"
            count={summaryData.abnormalVehicles}
            icon={<VideoOff size={24} />}
          />
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
          <BaseTable columns={columns} data={recentSleepData.slice(0, 5)} />
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
          {recentVehicles.map((vehicle) => (
            <VehicleCard
              key={vehicle.deviceUid}
              vehicleNumber={vehicle.vehicleNumber}
              deviceUid={vehicle.deviceUid}
              createdDate={new Date(vehicle.createdDate)}
              onEdit={() => openEditModal(vehicle)}
              onDelete={() => openDeleteModal(vehicle)}
            />
          ))}
        </div>
      </section>
      {showEditModal && selectedVehicle && (
        <VehicleEditModal
          isOpen={true}
          originalVehicle={selectedVehicle}
          onClose={() => setShowEditModal(false)}
          onConfirm={(newNumber) => {
            updateVehicle(selectedVehicle.deviceUid, newNumber, token)
              .then(() => {
                alert('수정 완료');
                fetchRecentVehicles();
                setShowEditModal(false);
              })
              .catch((err) => {
                alert('수정 실패');
                console.error(err);
              });
          }}
        />
      )}

      {showDeleteModal && selectedVehicle && (
        <VehicleDeleteModal
          isOpen={true}
          vehicleNumber={selectedVehicle.vehicleNumber}
          onClose={() => setShowDeleteModal(false)}
          onConfirm={() => {
            deleteVehicle(selectedVehicle.deviceUid, token)
              .then(() => {
                alert('삭제 완료');
                fetchRecentVehicles();
                setShowDeleteModal(false);
              })
              .catch((err) => {
                alert('삭제 실패');
                console.error(err);
              });
          }}
        />
      )}
    </div>
  );
}
