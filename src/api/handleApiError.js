export const handleApiError = (error) => {
  const errorMessage = error.response
    ? error.response.data.message
    : error.message;
  const customError = new Error(errorMessage);
  customError.status = error.response ? error.response.status : 500;
  throw customError;
};
