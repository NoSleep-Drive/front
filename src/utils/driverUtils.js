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
