import apiClient from './apiClient';

export const getVehicleCount = async (token) => {
  try {
    const res = await apiClient.get('/vehicles/count', {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data.data;
  } catch (error) {
    console.error('총 차량 수 조회 오류', error);
    throw error;
  }
};

export const getAbnormalVehicleCount = async (token) => {
  try {
    const res = await apiClient.get('/vehicles/abnormal/count', {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data.data;
  } catch (error) {
    console.error('이상 차량 수 조회 오류', error);
    throw error;
  }
};

export const getSleepTodayCount = async (token) => {
  try {
    const res = await apiClient.get('/sleep/today/count', {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data.data;
  } catch (error) {
    console.error('당일 졸음 감지 횟수 조회 오류', error);
    throw error;
  }
};

export const getRecentSleepData = async (token) => {
  try {
    const res = await apiClient.get('/sleep/recent?pageSize=5', {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data.data;
  } catch (error) {
    console.error('최근 졸음 데이터 조회 오류', error);
    throw error;
  }
};
