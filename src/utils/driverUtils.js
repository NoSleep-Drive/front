export const createDriverIndexMeta = (drivers = [], vehicleNumber = '') => {
  const sorted = drivers
    .filter((d) => d.driverHash && d.startTime)
    .sort((a, b) => new Date(a.startTime) - new Date(b.startTime));

  const hashToIndex = sorted.reduce((acc, driver, i) => {
    acc[driver.driverHash] = i + 1;
    return acc;
  }, {});

  return {
    vehicleNumber,
    hashToIndex,
  };
};
export function setDriverIndex(
  deviceUid,
  vehicleNumber,
  driverList,
  driverIndexMapRef
) {
  const hashToIndex = {};
  driverList.forEach((driver, idx) => {
    hashToIndex[driver.driverHash] = idx + 1;
  });

  driverIndexMapRef.current[deviceUid] = {
    vehicleNumber,
    hashToIndex,
  };
}

export function getDriverIndex(deviceUid, driverHash, driverIndexMapRef) {
  return (
    driverIndexMapRef.current?.[deviceUid]?.hashToIndex?.[driverHash] ?? null
  );
}

export function getDeviceUidByVehicle(vehicleNumber, deviceUidMap) {
  return deviceUidMap[vehicleNumber] || null;
}
export function getDriverHashesByVehicle(dataList, vehicleNumber) {
  const hashList = [];
  const seen = new Set();

  dataList.forEach((item) => {
    if (item.vehicleNumber === vehicleNumber && !seen.has(item.driverHash)) {
      hashList.push(item.driverHash);
      seen.add(item.driverHash);
    }
  });

  return hashList;
}
export function getDriverIndexMap(deviceUid, driverIndexMapRef) {
  return driverIndexMapRef.current?.[deviceUid]?.hashToIndex || {};
}
