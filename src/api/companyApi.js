import apiClient from './apiClient';

const createAuthHeader = (token) => ({
  headers: {
    Authorization: `Bearer ${token}`,
  },
});

const handleApiError = (error) => {
  const errorMessage = error.response
    ? error.response.data.message
    : error.message;
  const customError = new Error(errorMessage);
  customError.status = error.response ? error.response.status : 500;
  throw customError;
};

export const getCompanyInformation = async (token) => {
  try {
    const response = await apiClient.get(
      '/company/me',
      createAuthHeader(token)
    );
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

export const updateCompany = async (token, formData) => {
  try {
    const response = await apiClient.patch(
      '/company/me',
      formData,
      createAuthHeader(token)
    );
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

export const deleteCompany = async (token) => {
  try {
    const response = await apiClient.delete(
      '/company/me',
      createAuthHeader(token)
    );
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};
