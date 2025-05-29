import { fetchDriversByDeviceUid } from '@/api/driverApi';
import apiClient from '@/api/apiClient';

export async function recoverMappingsIfEmpty(
  driverIndexMapRef,
  deviceUidMapRef
) {
  const isDriverIndexMapEmpty =
    !driverIndexMapRef.current ||
    Object.keys(driverIndexMapRef.current).length === 0;
  const isDeviceUidMapEmpty =
    !deviceUidMapRef.current ||
    Object.keys(deviceUidMapRef.current).length === 0;

  if (!isDriverIndexMapEmpty || !isDeviceUidMapEmpty) {
    console.log('매핑 정보가 이미 존재합니다. 복구 불필요');
    return;
  }

  try {
    console.log('매핑 정보 비어있음. 백엔드에서 정보 가져오는 중...');

    // deviceUidMap 복구
    const vehiclesResponse = await apiClient.get('/vehicles', {
      params: { pageSize: 1000, pageIdx: 0 },
    });
    const vehicles = vehiclesResponse.data.data;
    vehicles.forEach((v) => {
      deviceUidMapRef.current[v.vehicleNumber] = v.deviceUid;
    });

    // driverIndexMap 복구
    for (const [vehicleNumber, deviceUid] of Object.entries(
      deviceUidMapRef.current
    )) {
      const driverList = await fetchDriversByDeviceUid(deviceUid, 100, 0);
      if (driverList && driverList.length > 0) {
        driverList.sort(
          (a, b) => new Date(a.startTime) - new Date(b.startTime)
        );
        const hashToIndex = {};
        driverList.forEach((driver, idx) => {
          hashToIndex[driver.driverHash] = idx;
        });
        driverIndexMapRef.current[deviceUid] = {
          vehicleNumber,
          hashToIndex,
        };
      }
    }

    console.log('매핑 정보 복구 완료:', {
      deviceUidMap: deviceUidMapRef.current,
      driverIndexMap: driverIndexMapRef.current,
    });
  } catch (error) {
    console.error('매핑 정보 복구 실패:', error);
  }
}
