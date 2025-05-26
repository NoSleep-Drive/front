import apiClient from './apiClient';
import { handleApiError } from './handleApiError';

export const getCompanyInformation = async () => {
  try {
    const response = await apiClient.get('/company/me');
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

export const updateCompany = async (formData) => {
  try {
    const response = await apiClient.patch('/company/me', formData);
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

export const deleteCompany = async () => {
  try {
    const response = await apiClient.delete('/company/me');
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};
