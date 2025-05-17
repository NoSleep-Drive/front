import axios from 'axios';
import { rentVehicle, returnVehicle } from '@/api/vehicleApi';
import { getMostFrequent3hrSlot } from '../utils/statistics';
import { getDriverIndexMap } from './driverUtils';
export async function handleRentVehicle(row, setData, driverIndexMapRef) {
  const token = localStorage.getItem('auth_token');

  try {
    await rentVehicle(row.vehicleNumber, token);

    const res = await axios.get('/api/vehicles', {
      headers: { Authorization: `Bearer ${token}` },
    });
    const updatedVehicles = res.data?.data || [];
    setData(updatedVehicles);

    const updatedVehicle = updatedVehicles.find(
      (v) => v.vehicleNumber === row.vehicleNumber
    );
    const deviceUid = updatedVehicle?.deviceUid;

    if (deviceUid) {
      const driverRes = await axios.get(
        `/api/vehicles/${deviceUid}/drivers?pageSize=100&pageIdx=0`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const drivers = driverRes.data?.data || [];

      const sorted = drivers
        .filter((d) => d.driverHash && d.startTime)
        .sort((a, b) => new Date(a.startTime) - new Date(b.startTime));

      const driverHashList = sorted.map((d) => d.driverHash);

      driverIndexMapRef.current[row.vehicleNumber] =
        getDriverIndexMap(driverHashList);
    } else {
      console.warn('📛 deviceUid 없음 - 운전자 인덱스 저장 생략');
    }
  } catch (error) {
    if (error.response?.status === 409) {
      console.warn('🚫 이미 렌트된 차량입니다.');
    } else {
      console.error('렌트 시작 실패:', error);
    }
  }
}

export async function handleReturnVehicle(
  row,
  data,
  setData,
  setModalData,
  setModalOpen,
  pageSize = 10,
  pageIdx = 0,
  setModalDeviceUid,
  setModalVehicleNumber,
  driverIndexMapRef // ✅ 반드시 전달
) {
  const latest = data.find((v) => v.vehicleNumber === row.vehicleNumber);
  if (!latest) return;

  if (latest.deviceUid) {
    setModalDeviceUid(latest.deviceUid);
    setModalVehicleNumber(latest.vehicleNumber);
  }

  const token = localStorage.getItem('auth_token');
  let driverHash;
  let rentStart;

  try {
    const driverRes = await axios.get(
      `/api/vehicles/${latest.deviceUid}/drivers`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    const drivers = driverRes.data?.data || [];

    const sorted = drivers
      .filter((d) => d.driverHash && d.startTime)
      .sort((a, b) => new Date(a.startTime) - new Date(b.startTime));

    if (sorted.length === 0) {
      console.warn('⛔ 운전자 데이터 없음 — 졸음 통계 생략');
      await returnVehicle(latest.vehicleNumber, token);
      const vehicleRes = await axios.get('/api/vehicles', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setData(vehicleRes.data?.data || []);

      setModalData({
        name: '운전자 정보 없음',
        vehicleNumber: latest.vehicleNumber,
        dateRange: '-',
        totalCount: 0,
        peakTime: '-',
      });
      setModalOpen(true);
      return;
    }

    const currentDriver = sorted[sorted.length - 1];
    driverHash = currentDriver?.driverHash;
    rentStart = currentDriver?.startTime;

    if (!driverHash || !rentStart) {
      console.error('❌ 반납 시 driverHash 또는 rentStart가 없습니다.');
      return;
    }

    // ✅ driverIndexMap에서 index 조회
    const driverIndex =
      driverIndexMapRef.current?.[latest.vehicleNumber]?.[driverHash] ?? null;

    await returnVehicle(latest.vehicleNumber, token);

    const vehicleRes = await axios.get('/api/vehicles', {
      headers: { Authorization: `Bearer ${token}` },
    });
    setData(vehicleRes.data?.data || []);

    const formatToYMD = (date) => {
      if (!(date instanceof Date) || isNaN(date.getTime())) return null;
      const yyyy = date.getFullYear();
      const mm = String(date.getMonth() + 1).padStart(2, '0');
      const dd = String(date.getDate()).padStart(2, '0');
      return `${yyyy}-${mm}-${dd}`;
    };

    const startDate = formatToYMD(new Date(rentStart));
    const endDate = formatToYMD(new Date());

    const res = await axios.get('/api/sleep', {
      params: {
        vehicleNumber: latest.vehicleNumber,
        driverHash,
        start_date: startDate,
        end_date: endDate,
        pageSize,
        pageIdx,
      },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const records = res.data?.data || [];
    const totalCount = records.length;
    const peakTime =
      totalCount > 0 ? getMostFrequent3hrSlot(records).label : '-';

    setModalData({
      name: driverIndex ? `운전자 ${driverIndex}` : '운전자',
      vehicleNumber: latest.vehicleNumber,
      dateRange: `${startDate} ~ ${endDate}`,
      totalCount,
      peakTime,
    });

    setModalOpen(true);
  } catch (err) {
    console.error('📊 졸음 통계 요청 실패:', {
      status: err?.response?.status,
      message: err?.response?.data?.message,
      data: err?.response?.data,
    });
  }
}
