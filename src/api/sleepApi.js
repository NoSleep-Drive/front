import apiClient from './apiClient';

export const getSleepRecords = async ({
  vehicleNumber,
  driverHash,
  start_date,
  end_date,
  pageSize,
  pageIdx,
}) => {
  try {
    const res = await apiClient.get('/sleep', {
      params: {
        vehicleNumber,
        driverHash,
        start_date,
        end_date,
        pageSize,
        pageIdx,
      },
    });
    return res.data.data || [];
  } catch (error) {
    throw error.response ? error.response.data.message : error.message;
  }
};

export const getSleepDetail = async (id) => {
  const res = await apiClient.get(`/sleep/${id}`);
  return res.data.data;
};

export const getSleepVideoStreamUrl = (id) => {
  return `/api/sleep/${id}/video/stream`;
};

export const downloadSleepVideo = (id) => {
  window.location.href = `/api/sleep/${id}/video/download`;
};

export const downloadSleepVideosZip = async (ids = []) => {
  const res = await apiClient.post(
    '/sleep/videos/download',
    { ids },
    {
      responseType: 'blob',
    }
  );
  return res;
};
