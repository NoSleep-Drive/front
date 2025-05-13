import apiClient from './apiClient';

export const fetchDriversByDeviceUid = async (deviceUid, pageSize, pageIdx) => {
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
};
