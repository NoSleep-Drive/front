export function calculateDriverSleepStats(sleepList, driverHash) {
  if (!sleepList || !driverHash) {
    return { totalCount: 0, peakTime: '없음' };
  }
  const hourCount = {};
  sleepList.forEach((item) => {
    if (item.driverHash !== driverHash) return;
    const isoString = item.detectedTime;
    const hour = parseInt(isoString.split('T')[1].split(':')[0], 10);
    hourCount[hour] = (hourCount[hour] || 0) + 1;
  });

  const peakHour =
    Object.keys(hourCount).length > 0
      ? Object.entries(hourCount).reduce((a, b) => (b[1] > a[1] ? b : a))[0]
      : null;

  return peakHour !== null ? `${peakHour}시` : '없음';
}
