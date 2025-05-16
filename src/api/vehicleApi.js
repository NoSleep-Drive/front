import apiClient from './apiClient';
export const getVehicles = async (pageSize, pageIdx, token) => {
  const res = await apiClient.get('/vehicles', {
    params: { pageSize, pageIdx },
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data.data;
};

export const registerVehicle = async (vehicleNumber, deviceUid, token) => {
  const res = await apiClient.post(
    '/vehicles',
    { vehicleNumber, deviceUid },
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  return res.data;
};

export const deleteVehicle = async (deviceUid, token) => {
  const res = await apiClient.delete(`/vehicles/${deviceUid}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

export const updateVehicle = async (deviceUid, newNumber, token) => {
  const res = await apiClient.patch(
    `/vehicles/${deviceUid}`,
    { vehicleNumber: newNumber },
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  return res.data;
};

export const rentVehicle = async (vehicleNumber, token) => {
  const res = await apiClient.post(`/vehicles/${vehicleNumber}/rent`, null, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};
export const returnVehicle = async (vehicleNumber, token) => {
  const res = await apiClient.post(`/vehicles/${vehicleNumber}/return`, null, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};
