import apiClient from './apiClient';
import { handleApiError } from './handleApiError';

export const getVehicleCount = async () => {
  try {
    const response = await apiClient.get('/vehicles/count');
    return response.data.data;
  } catch (error) {
    handleApiError(error);
  }
};

export const getAbnormalVehicleCount = async () => {
  try {
    const response = await apiClient.get('/vehicles/abnormal/count');
    return response.data.data;
  } catch (error) {
    handleApiError(error);
  }
};

export const getSleepTodayCount = async () => {
  try {
    const response = await apiClient.get('/sleep/today/count');
    return response.data.data;
  } catch (error) {
    handleApiError(error);
  }
};

export const getRecentSleepData = async () => {
  try {
    const response = await apiClient.get('/sleep/recent?pageSize=5');
    return response.data.data;
  } catch (error) {
    handleApiError(error);
  }
};
