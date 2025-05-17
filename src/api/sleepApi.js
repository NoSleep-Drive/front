import apiClient from './apiClient';
const handleApiError = (error) => {
  const errorMessage = error.response
    ? error.response.data.message
    : error.message;
  const customError = new Error(errorMessage);
  customError.status = error.response ? error.response.status : 500;
  throw customError;
};

const createAuthHeader = (token) => ({
  headers: {
    Authorization: `Bearer ${token}`,
  },
});

export const getSleepRecords = async ({
  token,
  vehicleNumber,
  driverHash,
  start_date,
  end_date,
  pageSize,
  pageIdx,
}) => {
  try {
    const response = await apiClient.get('/sleep', {
      params: {
        vehicleNumber,
        driverHash,
        start_date,
        end_date,
        pageSize,
        pageIdx,
      },
      ...createAuthHeader(token),
    });
    return response.data.data || [];
  } catch (error) {
    handleApiError(error);
  }
};

export const getSleepDetail = async (token, id) => {
  try {
    const response = await apiClient.get(
      `/sleep/${id}`,
      createAuthHeader(token)
    );
    return response.data.data;
  } catch (error) {
    handleApiError(error);
  }
};

export const getSleepVideoStreamUrl = (id) => {
  return `/sleep/${id}/video/stream`;
};

export const downloadSleepVideo = async (token, id) => {
  try {
    const response = await apiClient.get(`/sleep/${id}/video/download`, {
      responseType: 'blob',
      ...createAuthHeader(token),
    });
    if (response.data.size === 0) {
      alert('다운로드 가능한 영상이 없습니다.');
      return;
    }
    const blob = new Blob([response.data], {
      type: 'application/octet-stream',
    });

    const contentDisposition = response.headers['content-disposition'];
    const filenameMatch = contentDisposition?.match(/filename="(.+)"/);
    const filename = filenameMatch ? filenameMatch[1] : `sleep_video_${id}.mp4`;

    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(link.href);
  } catch (error) {
    if (error.status === 404) {
      alert('해당 영상이 존재하지 않습니다.');
    }
    handleApiError(error);
  }
};

export const downloadSleepVideosZip = async (token, ids = []) => {
  try {
    if (!ids || ids.length === 0) {
      alert('다운로드할 영상이 없습니다.');
      return;
    }

    const response = await apiClient.post(
      '/sleep/videos/download',
      { ids },
      {
        responseType: 'blob',
        ...createAuthHeader(token),
      }
    );
    return response;
  } catch (error) {
    handleApiError(error);
  }
};
