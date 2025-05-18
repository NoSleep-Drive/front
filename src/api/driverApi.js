import apiClient from './apiClient';

export const fetchDriversByDeviceUid = async (deviceUid, pageSize, pageIdx) => {
  if (!deviceUid) {
    console.warn('deviceUid가 undefined 또는 null입니다');
    return [];
  }
  try {
    const response = await apiClient.get(`/vehicles/${deviceUid}/drivers`, {
      params: {
        pageSize,
        pageIdx,
      },
      headers: {
        Authorization: `Bearer ${localStorage.getItem('auth_token')}`,
      },
    });

    return response.data.data;
  } catch (error) {
    console.error(
      '운전자 목록 불러오기에 오류 발생',
      error.response?.data?.message || error.message || '알 수 없는 오류'
    );
    throw error;
  }
};
