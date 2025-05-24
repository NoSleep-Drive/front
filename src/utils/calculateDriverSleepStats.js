export function calculateDriverSleepStats(sleepList, driverHash) {
  if (!sleepList || !driverHash) {
    return { totalCount: 0, peakTime: '없음' };
  }
  const totalCount = sleepList.filter(
    (item) => item.driverHash === driverHash
  ).length;

  const hourCount = {};
  sleepList.forEach((item) => {
    if (item.driverHash !== driverHash) return;
    const hour = new Date(item.detectedTime).getUTCHours();
    hourCount[hour] = (hourCount[hour] || 0) + 1;
  });

  const peakHour =
    Object.keys(hourCount).length > 0
      ? Object.entries(hourCount).reduce((a, b) => (b[1] > a[1] ? b : a))[0]
      : null;

  return {
    totalCount,
    peakTime: peakHour !== null ? `${peakHour}시` : '없음',
  };
}
