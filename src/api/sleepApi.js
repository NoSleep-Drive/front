import apiClient from './apiClient';
const handleApiError = (error) => {
  const errorMessage = error.response
    ? error.response.data.message
    : error.message;
  const customError = new Error(errorMessage);
  customError.status = error.response ? error.response.status : 500;
  throw customError;
};
const createAuthHeader = (token = localStorage.getItem('auth_token')) => {
  if (!token) return {};
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

export const getSleepRecords = async ({
  token,
  vehicleNumber,
  driverHash,
  startDate,
  endDate,
  pageSize,
  pageIdx,
}) => {
  try {
    const response = await apiClient.get('/sleep', {
      params: {
        vehicleNumber,
        driverHash,
        startDate,
        endDate,
        pageSize,
        pageIdx,
      },
      ...createAuthHeader(token),
    });
    return response.data.data || [];
  } catch (error) {
    throw handleApiError(error);
  }
};

export const getSleepDetail = async (id, token) => {
  try {
    const response = await apiClient.get(
      `/sleep/${id}`,
      createAuthHeader(token)
    );
    return response.data.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

export const getSleepVideoStreamUrl = async (id, token) => {
  try {
    const response = await apiClient.get(`/sleep/${id}/video/stream`, {
      responseType: 'blob',
      ...createAuthHeader(token),
    });

    if (response.data.size === 0) {
      throw new Error('스트리밍 가능한 영상이 없습니다.');
    }

    const blob = response.data;
    const blobUrl = URL.createObjectURL(blob);
    return blobUrl;
  } catch (error) {
    if (error.response?.status === 404) {
      alert('해당 영상이 존재하지 않습니다.');
    }
    throw handleApiError(error);
  }
};

export const downloadSleepVideo = async (id, token) => {
  try {
    const response = await apiClient.get(`/sleep/${id}/video/download`, {
      responseType: 'blob',
      ...createAuthHeader(token),
    });
    if (response.data.size === 0) {
      alert('다운로드 가능한 영상이 없습니다.');
      return;
    }
    const disposition = response.headers['content-disposition'];
    let filename = `sleep_${id}.mp4`;
    if (disposition && disposition.includes('filename=')) {
      filename = disposition.split('filename=')[1].replace(/"/g, '');
    }
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  } catch (error) {
    if (error.response?.status === 404) {
      alert('해당 영상이 존재하지 않습니다.');
    }
    throw handleApiError(error);
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
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};
