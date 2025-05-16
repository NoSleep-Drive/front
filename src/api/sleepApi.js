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
  try {
    const res = await apiClient.get(`/sleep/${id}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('auth_token')}`,
      },
    });
    return res.data.data;
  } catch (error) {
    console.error('비디오 다운로드 실패:', error);
    throw error.response ? error.response.data.message : error.message;
  }
};

export const getSleepVideoStreamUrl = (id) => {
  return `/sleep/${id}/video/stream`;
};

export const downloadSleepVideo = async (id) => {
  try {
    const response = await apiClient.get(`/sleep/${id}/video/download`, {
      responseType: 'blob',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('auth_token')}`,
      },
    });

    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `sleep_video_${id}.mp4`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } catch (error) {
    console.error('비디오 다운로드 실패:', error);
    throw error.response ? error.response.data.message : error.message;
  }
};

export const downloadSleepVideosZip = async (ids = []) => {
  try {
    const res = await apiClient.post(
      '/sleep/videos/download',
      { ids },
      {
        responseType: 'blob',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('auth_token')}`,
        },
      }
    );
    return res;
  } catch (error) {
    console.error('비디오 zip 다운로드 실패:', error);
    throw error.response ? error.response.data.message : error.message;
  }
};
