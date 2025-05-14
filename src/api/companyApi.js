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

export const updateCompany = async (token, formData) => {
  try {
    const response = await apiClient.patch(
      '/company/me',
      {
        password: formData.password,
        companyName: formData.companyName,
        businessNumber: formData.businessNumber,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data.message : error.message;
  }
};

export const deleteCompany = async (token) => {
  try {
    const response = await apiClient.delete('/company/me', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data.message : error.message;
  }
};
