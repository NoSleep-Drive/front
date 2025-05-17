import apiClient from './apiClient';

export const getVehicleCount = async () => {
  try {
    const res = await apiClient.get('/vehicles/count', {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('auth_token')}`,
      },
    });
    return res.data.data;
  } catch (error) {
    console.error('차량 수 조회 오류', error);
    throw error;
  }
};

export const getAbnormalVehicleCount = async () => {
  try {
    const res = await apiClient.get('/vehicles/abnormal/count', {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('auth_token')}`,
      },
    });
    return res.data.data;
  } catch (error) {
    console.error('센서 이상 장치 수 조회 오류', error);
    throw error;
  }
};

export const getSleepTodayCount = async () => {
  try {
    const res = await apiClient.get('/sleep/today/count', {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('auth_token')}`,
      },
    });
    return res.data.data;
  } catch (error) {
    console.error('당일 졸음 감지 횟수 조회 오류', error);
    throw error;
  }
};

export const getRecentSleepData = async () => {
  try {
    const res = await apiClient.get('/sleep/recent?pageSize=5', {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('auth_token')}`,
      },
    });
    return res.data.data;
  } catch (error) {
    console.error('최근 졸음 데이터 조회 오류', error);
    throw error;
  }
};
