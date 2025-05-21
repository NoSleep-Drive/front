import apiClient from './apiClient';
const handleApiError = (error) => {
  const errorMessage = error.response
    ? error.response.data.message
    : error.message;
  const customError = new Error(errorMessage);
  customError.status = error.response ? error.response.status : 500;
  throw customError;
};

export const getVehicles = async (pageSize, pageIdx, token) => {
  try {
    const res = await apiClient.get('/vehicles', {
      params: { pageSize, pageIdx },
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data.data;
  } catch (error) {
    handleApiError(error);
  }
};

export const registerVehicle = async (vehicleNumber, deviceUid, token) => {
  try {
    const res = await apiClient.post(
      '/vehicles',
      { vehicleNumber, deviceUid },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return res.data;
  } catch (error) {
    handleApiError(error);
  }
};

export const deleteVehicle = async (deviceUid, token) => {
  try {
    const res = await apiClient.delete(`/vehicles/${deviceUid}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
  } catch (error) {
    handleApiError(error);
  }
};

export const updateVehicle = async (deviceUid, newNumber, token) => {
  try {
    const res = await apiClient.patch(
      `/vehicles/${deviceUid}`,
      { vehicleNumber: newNumber },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return res.data;
  } catch (error) {
    handleApiError(error);
  }
};

export const rentVehicle = async (vehicleNumber, token) => {
  try {
    const res = await apiClient.post(`/vehicles/${vehicleNumber}/rent`, null, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
  } catch (error) {
    handleApiError(error);
  }
};

export const returnVehicle = async (vehicleNumber, token) => {
  try {
    const res = await apiClient.post(
      `/vehicles/${vehicleNumber}/return`,
      null,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return res.data;
  } catch (error) {
    handleApiError(error);
  }
};
