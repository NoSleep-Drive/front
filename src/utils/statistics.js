export const getMostFrequent3hrSlot = (records) => {
  const timeBuckets = Array.from({ length: 8 }, (_, i) => ({
    label: `${i * 3}~${i * 3 + 2}시`,
    count: 0,
  }));

  records.forEach(({ detectedTime }) => {
    const hour = new Date(detectedTime).getHours();
    const index = Math.floor(hour / 3);
    timeBuckets[index].count += 1;
  });

  return timeBuckets.reduce((a, b) => (b.count > a.count ? b : a));
};
