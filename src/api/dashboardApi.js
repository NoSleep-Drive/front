import apiClient from './apiClient';

export const getVehicleCount = async (token) => {
  const res = await apiClient.get('/vehicles/count', {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data.data;
};

export const getAbnormalVehicleCount = async (token) => {
  const res = await apiClient.get('/vehicles/abnormal/count', {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data.data;
};

export const getSleepTodayCount = async (token) => {
  const res = await apiClient.get('/sleep/today/count', {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data.data;
};

export const getRecentSleepData = async (token) => {
  const res = await apiClient.get('/sleep/recent?pageSize=5', {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data.data;
};
