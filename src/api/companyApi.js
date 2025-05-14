import apiClient from './apiClient';

export const getCompanyInformation = async (token) => {
  try {
    const response = await apiClient.get('/company/me', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data.message : error.message;
  }
};
