import apiClient from './apiClient';
import { handleApiError } from './handleApiError';

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
    });

    return response.data.data;
  } catch (error) {
    console.error('fetchDriversByDeviceUid 호출 실패:', {
      deviceUid,
      pageSize,
      pageIdx,
      error,
    });
    handleApiError(error);
  }
};
