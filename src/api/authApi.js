import apiClient from './apiClient';

export const signUpApi = async (formData) => {
  try {
    const response = await apiClient.post('/company/signup', {
      id: formData.username,
      password: formData.password,
      companyName: formData.companyName,
      businessNumber: formData.businessNumber,
    });
    return response.data.message;
  } catch (error) {
    throw error.response ? error.response.data.message : error.message;
  }
};

export const loginApi = async (formData) => {
  try {
    const response = await apiClient.post('/company/login', {
      id: formData.id,
      password: formData.password,
    });
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data.message : error.message;
  }
};
