export function saveDriverMapsToStorage(driverIndexMapRef, deviceUidMapRef) {
  localStorage.setItem(
    'driverIndexMap',
    JSON.stringify(driverIndexMapRef.current)
  );
  localStorage.setItem('deviceUidMap', JSON.stringify(deviceUidMapRef.current));
}
export function loadDriverMapsFromStorage(driverIndexMapRef, deviceUidMapRef) {
  try {
    const storedDriverMap = localStorage.getItem('driverIndexMap');
    const storedDeviceMap = localStorage.getItem('deviceUidMap');

    if (storedDriverMap) {
      driverIndexMapRef.current = JSON.parse(storedDriverMap);
    }
    if (storedDeviceMap) {
      deviceUidMapRef.current = JSON.parse(storedDeviceMap);
    }

    console.log('📦 driverIndexMap 복원됨:', driverIndexMapRef.current);
    console.log('📦 deviceUidMap 복원됨:', deviceUidMapRef.current);
  } catch (err) {
    console.error('❌ driver/device map 복원 실패:', err);
  }
}
