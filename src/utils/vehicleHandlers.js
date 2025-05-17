import axios from 'axios';
export async function handleRentVehicle(row, setData) {
  const token = localStorage.getItem('auth_token');

  try {
    await axios.post(`/api/vehicles/${row.vehicleNumber}/rent`, null, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    setData((prev) =>
      prev.map((item) =>
        item.vehicleNumber === row.vehicleNumber
          ? { ...item, isRented: true }
          : item
      )
    );
    const deviceUid = row.deviceUid;
    if (!deviceUid) {
      console.warn('deviceUid가 없어 운전자 목록 조회를 건너뜀');
      return [];
    }

    const res = await axios.get(`/api/vehicles/${deviceUid}/drivers`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res.data?.data || [];
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
  setDrowsyModalData,
  setDrowsyModalOpen,
  sleepLimit = 1000,
  sleepPage = 0,
  deviceUid,
  vehicleNumber,
  driverIndexMapRef
) {
  const token = localStorage.getItem('auth_token');

  try {
    await axios.post(`/api/vehicles/${vehicleNumber}/return`, null, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    setData((prev) =>
      prev.map((item) =>
        item.vehicleNumber === vehicleNumber
          ? { ...item, isRented: false }
          : item
      )
    );
    const res = await axios.get(`/api/sleep`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: {
        pageSize: sleepLimit,
        pageIdx: sleepPage,
        vehicleNumber: vehicleNumber,
      },
    });

    const sleepData = res.data?.data || [];
    setDrowsyModalData({
      vehicleNumber,
      sleepList: sleepData || [],
      driverIndexMap: driverIndexMapRef.current?.[deviceUid]?.hashToIndex || {},
    });
    setDrowsyModalOpen(true);
  } catch (error) {
    console.error('반납 처리 실패:', error);
    alert('반납 처리 중 문제가 발생했습니다.');
  }
}
