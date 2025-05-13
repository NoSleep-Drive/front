import apiClient from './apiClient';

export const fetchDriversByDeviceUid = async (deviceUid, pageSize, pageIdx) => {
  try {
    const response = await apiClient.get(`/vehicles/${deviceUid}/drivers`, {
      params: {
        pageSize,
        pageIdx,
      },
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });
    return response.data.data;
  } catch (error) {
    console.error('운전자 목록 불러오기에 오류 발생', error);
    throw error;
  }
};
