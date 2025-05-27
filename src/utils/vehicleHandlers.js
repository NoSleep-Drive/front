import apiClient from '@/api/apiClient';
import { setDriverIndex } from './driverUtils';
import { saveDriverMapsToStorage } from './storageUtils';
export async function handleRentVehicle(
  row,
  setData,
  driverIndexMapRef,
  deviceUidMapRef
) {
  try {
    await apiClient.post(`/vehicles/${row.vehicleNumber}/rent`, null, {});
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

    const res = await apiClient.get(`/vehicles/${deviceUid}/drivers`);
    const driverList = res.data?.data || [];
    if (driverList.length) {
      setDriverIndex(
        deviceUid,
        row.vehicleNumber,
        driverList,
        driverIndexMapRef
      );
      saveDriverMapsToStorage(driverIndexMapRef, deviceUidMapRef);
    }
    return driverList;
  } catch (error) {
    if (error.response?.status === 409) {
      console.warn('🚫 이미 렌트된 차량입니다.');
    } else {
      console.error('렌트 시작 실패:', error);
    }
    throw error;
  }
}

export async function handleReturnVehicle(
  row,
  setData,
  setDrowsyModalData,
  setDrowsyModalOpen,
  sleepLimit = 100,
  sleepPage = 0,
  driverIndexMapRef
) {
  try {
    await apiClient.post(`/vehicles/${row.vehicleNumber}/return`);

    setData((prev) =>
      prev.map((item) =>
        item.vehicleNumber === row.vehicleNumber
          ? { ...item, isRented: false }
          : item
      )
    );
    const res = await apiClient.get(`/sleep`, {
      params: {
        pageSize: sleepLimit,
        pageIdx: sleepPage,
        vehicleNumber: row.vehicleNumber,
      },
    });

    const sleepData = res.data?.data || [];
    setDrowsyModalData({
      vehicleNumber: row.vehicleNumber,
      sleepList: sleepData || [],
      driverIndexMap:
        driverIndexMapRef.current?.[row.deviceUid]?.hashToIndex || {},
    });
    setDrowsyModalOpen(true);
  } catch (error) {
    console.error('반납 처리 실패:', error);
    alert('반납 처리 중 문제가 발생했습니다.');
    throw error;
  }
}
