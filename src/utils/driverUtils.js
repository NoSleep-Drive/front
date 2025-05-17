export const getDriverHashesByVehicle = (sleepRecords, vehicleNumber) => {
  const set = new Set();
  sleepRecords.forEach((item) => {
    if (item.vehicleNumber === vehicleNumber && item.driverHash) {
      set.add(item.driverHash);
    }
  });
  return Array.from(set);
};

export const getDriverIndex = (hashList, targetHash) => {
  const index = hashList.indexOf(targetHash);
  return index !== -1 ? index + 1 : null;
};

export const getDriverIndexMap = (hashList) => {
  return hashList.reduce((acc, hash, i) => {
    acc[hash] = i + 1;
    return acc;
  }, {});
};
export const getDriverIndexMapFromDriverList = (drivers = []) => {
  const sorted = drivers
    .filter((d) => d.driverHash && d.startTime)
    .sort((a, b) => new Date(a.startTime) - new Date(b.startTime)); // 렌트 시간 순 정렬

  return sorted.reduce((acc, driver, i) => {
    acc[driver.driverHash] = i + 1;
    return acc;
  }, {});
};

export const getDriverHashByIndex = (indexMap, targetIndex) => {
  return (
    Object.entries(indexMap).find(([, index]) => index === targetIndex)?.[0] ??
    null
  );
};
