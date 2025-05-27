import apiClient from './apiClient';
import { handleApiError } from './handleApiError';

export const getSleepRecords = async ({
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
    });
    return response.data.data || [];
  } catch (error) {
    handleApiError(error);
  }
};

export const getSleepDetail = async (id) => {
  try {
    const response = await apiClient.get(`/sleep/${id}`);
    return response.data.data;
  } catch (error) {
    handleApiError(error);
  }
};

export const getSleepVideoStreamUrl = async (id) => {
  try {
    const response = await apiClient.get(`/sleep/${id}/video/stream`, {
      responseType: 'blob',
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
    handleApiError(error);
  }
};

export const downloadSleepVideo = async (id) => {
  try {
    const response = await apiClient.get(`/sleep/${id}/video/download`, {
      responseType: 'blob',
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
    handleApiError(error);
  }
};

export const downloadSleepVideosZip = async (ids = []) => {
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
      }
    );
    const blob = response.data;
    const contentDisposition = response.headers['content-disposition'];
    const filenameMatch = contentDisposition?.match(/filename="(.+)"/);
    const filename = filenameMatch ? filenameMatch[1] : 'sleepVideos.zip';

    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(link.href);

    return response.data;
  } catch (error) {
    if (error) {
      const status = error.response?.status;
      if (status === 401) {
        alert('인증 정보가 유효하지 않습니다.');
      } else if (status === 404) {
        alert('일부 영상이 존재하지 않아 다운로드할 수 없습니다.');
      } else {
        alert('일괄 다운로드 중 오류가 발생했습니다.');
      }
    } else {
      alert('알 수 없는 오류가 발생했습니다.');
    }
  }
};
