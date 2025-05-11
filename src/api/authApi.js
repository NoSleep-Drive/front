import apiClient from './apiClient';

export const signUpApi = async (formData) => {
  try {
    const response = await apiClient.post('/company/signup', {
      id: formData.username, // 프론트 username -> 백엔드 id
      password: formData.password,
      companyName: formData.companyName,
      businessNumber: formData.businessNumber,
    });
    return response.data.message;
  } catch (error) {
    throw error.response ? error.response.data.message : error.message;
  }
};
