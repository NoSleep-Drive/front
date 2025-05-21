import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Download, ChevronRight } from 'lucide-react';

import VehicleCard from '../../components/VehicleCard';
import BaseTable from '../../components/BaseTable';
import VehicleEditModal from '../../components/VehicleEditModal';
import VehicleDeleteModal from '../../components/VehicleDeleteModal.jsx';
import {
  getVehicles,
  deleteVehicle,
  updateVehicle,
} from '../../api/vehicleApi';
import { getRecentSleepData } from '../../api/dashboardApi';
import { downloadSleepVideo } from '@/api/sleepApi';
import useDriverIndexMap from '@/hooks/useDriverIndexMap';
import { getDriverIndex } from '@/utils/driverUtils';
import {
  getVehicleCount,
  getSleepTodayCount,
  getAbnormalVehicleCount,
} from '../../api/dashboardApi';
import { saveDriverMapsToStorage } from '@/utils/storageUtils';
import DashboardSummary from './DashboardSummary';
export default function Dashboard() {
  const token = localStorage.getItem('auth_token');
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [recentVehicles, setRecentVehicles] = useState([]);
  const [recentSleepData, setRecentSleepData] = useState([]);
  const [summaryData, setSummaryData] = useState({
    totalVehicles: 0,
    sleepDetectedToday: 0,
    abnormalVehicles: 0,
  });
  const { driverIndexMapRef, deviceUidMapRef } = useDriverIndexMap();
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
      console.error('졸음 데이터 불러오기 실패:', err);
    }
  };

  const fetchRecentVehicles = async () => {
    try {
      const countData = await getVehicleCount(token);
      const total = countData.totalVehicles;
      const allVehicles = await getVehicles(total, 0, token);
      const sorted = allVehicles
        .sort((a, b) => new Date(b.createdDate) - new Date(a.createdDate))
        .slice(0, 3);
      setRecentVehicles(sorted);
    } catch (err) {
      console.error('차량 조회 실패:', err);
      alert('차량 정보를 불러오는 데 실패했습니다.');
    }
  };
  const openEditModal = (vehicle) => {
    setSelectedVehicle(vehicle);
    setShowEditModal(true);
  };

  const openDeleteModal = (vehicle) => {
    setSelectedVehicle(vehicle);
    setShowDeleteModal(true);
  };

  const handleDownload = async (idSleep) => {
    try {
      await downloadSleepVideo(idSleep, token);
    } catch (error) {
      console.error('다운로드 실패:', error);

      alert(error.message || '다운로드 중 오류가 발생했습니다.');
    }
  };

  const columns = [
    { key: 'vehicleNumber', label: '차량 번호' },
    {
      key: 'driverHash',
      label: '운전자',
      render: (value, row) => {
        const deviceUid = deviceUidMapRef.current?.[row.vehicleNumber];
        const index = getDriverIndex(
          deviceUid,
          row.driverHash,
          driverIndexMapRef
        );
        return index !== undefined ? `운전자 ${index + 1}` : '운전자 -';
      },
    },
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
          onClick={() => handleDownload(row.idSleep)} //
          className="text-cornflower-950 hover:bg-cornflower-100 hover:text-cornflower-600 inline-flex items-center justify-center rounded-xl p-2 transition-colors"
        >
          <Download size={18} />
        </button>
      ),
    },
  ];
  return (
    <div className="flex flex-col gap-10 px-4">
      <DashboardSummary data={summaryData} />

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
          token={token}
          originalVehicle={selectedVehicle}
          onClose={() => setShowEditModal(false)}
          onConfirm={(newNumber) => {
            const oldNumber = selectedVehicle.vehicleNumber;
            const uid = selectedVehicle.deviceUid;
            updateVehicle(uid, newNumber, token)
              .then(() => {
                if (uid && newNumber) {
                  deviceUidMapRef.current[newNumber] = uid;
                  if (oldNumber !== newNumber) {
                    delete deviceUidMapRef.current[oldNumber];
                    driverIndexMapRef.current[uid].vehicleNumber = newNumber;
                  }
                  saveDriverMapsToStorage(driverIndexMapRef, deviceUidMapRef);
                }
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
          token={token}
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
