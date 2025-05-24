export const handleApiError = (error) => {
  const errorMessage =
    error.response?.data?.message ||
    error.message ||
    '알 수 없는 오류가 발생했습니다.';
  const customError = new Error(errorMessage);
  customError.status = error.response ? error.response.status : 500;
  throw customError;
};
