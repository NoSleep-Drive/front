import apiClient from './apiClient';
import { handleApiError } from './handleApiError';

export const getVehicles = async (pageSize, pageIdx) => {
  try {
    const response = await apiClient.get('/vehicles', {
      params: { pageSize, pageIdx },
    });
    return response.data.data;
  } catch (error) {
    handleApiError(error);
  }
};

export const registerVehicle = async (vehicleNumber, deviceUid) => {
  try {
    const response = await apiClient.post('/vehicles', {
      vehicleNumber,
      deviceUid,
    });
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

export const deleteVehicle = async (deviceUid) => {
  try {
    const response = await apiClient.delete(`/vehicles/${deviceUid}`, {});
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

export const updateVehicle = async (deviceUid, newNumber) => {
  try {
    const response = await apiClient.patch(`/vehicles/${deviceUid}`, {
      vehicleNumber: newNumber,
    });
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

export const rentVehicle = async (vehicleNumber) => {
  try {
    const response = await apiClient.post(
      `/vehicles/${vehicleNumber}/rent`,
      null
    );
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

export const returnVehicle = async (vehicleNumber) => {
  try {
    const response = await apiClient.post(
      `/vehicles/${vehicleNumber}/return`,
      null
    );
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};
