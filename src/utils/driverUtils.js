export const createDriverIndexMeta = (drivers = [], vehicleNumber = '') => {
  const sorted = drivers
    .filter((d) => d.driverHash && d.startTime)
    .sort((a, b) => new Date(a.startTime) - new Date(b.startTime));

  const hashToIndex = sorted.reduce((acc, driver, i) => {
    acc[driver.driverHash] = i;
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
    hashToIndex[driver.driverHash] = idx;
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

export const getDeviceUidByVehicle = (vehicleNumber, map) => {
  if (!vehicleNumber || !map) return undefined;
  return map[vehicleNumber];
};

export function getDriverHashesByVehicle(dataList, vehicleNumber) {
  return [
    ...new Set(
      dataList
        .filter(
          (item) => item.vehicleNumber === vehicleNumber && item.driverHash
        )
        .map((item) => item.driverHash)
    ),
  ];
}

export function getDriverIndexMap(deviceUid, driverIndexMapRef) {
  if (!deviceUid || !driverIndexMapRef) {
    return {};
  }
  return driverIndexMapRef.current?.[deviceUid]?.hashToIndex || {};
}
export function getDriverHashByIndex(deviceUid, index, driverIndexMapRef) {
  const map = driverIndexMapRef.current?.[deviceUid]?.hashToIndex;
  if (!map) return null;
  return Object.entries(map).find(([, i]) => i === index)?.[0] ?? null;
}
export const getDriverIndexByVehicle = (
  vehicleNumber,
  driverHash,
  deviceUidMapRef,
  driverIndexMapRef
) => {
  const deviceUid = deviceUidMapRef.current[vehicleNumber];
  return (
    driverIndexMapRef.current?.[deviceUid]?.hashToIndex?.[driverHash] ?? '-'
  );
};

export const groupAndIndexSleepData = (
  data,
  deviceUidMapRef,
  driverIndexMapRef
) => {
  const grouped = {};

  data.forEach((item) => {
    const { idSleep, vehicleNumber, detectedTime, driverHash } = item;

    const deviceUid = deviceUidMapRef.current[vehicleNumber];
    const driverIndex =
      driverIndexMapRef.current?.[deviceUid]?.hashToIndex?.[driverHash] ?? null;
    const key = `${vehicleNumber}::${driverHash}`;
    if (!grouped[key]) {
      grouped[key] = {
        vehicleNumber,
        deviceUid,
        driverHash,
        driverIndex,
        drowsinessDetails: [],
      };
    }
    grouped[key].drowsinessDetails.push({
      idSleep,
      detectedTime,
      driverHash,
      driverIndex,
    });
  });
  Object.values(grouped).forEach((group) => {
    group.drowsinessDetails.sort(
      (a, b) => new Date(b.detectedTime) - new Date(a.detectedTime)
    );
  });
  return Object.values(grouped);
};

export const getDriverListByVehicleNumber = (
  vehicleNumber,
  deviceUidMapRef,
  driverIndexMapRef
) => {
  const deviceUid = deviceUidMapRef.current[vehicleNumber];
  const map = driverIndexMapRef.current?.[deviceUid]?.hashToIndex || {};

  return Object.entries(map).map(([hash, index]) => ({
    driverHash: hash,
    index,
    label: `운전자 ${index + 1}`,
  }));
};
