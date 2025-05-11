export const validate = (formData) => {
  const errors = {};

  const usernameRegex = /^[A-Za-z0-9]{8,16}$/;
  if (!formData.username || !usernameRegex.test(formData.username)) {
    errors.username = '아이디는 8~16자리 영어, 숫자 조합이어야 합니다.';
  }

  const passwordRegex =
    /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,16}$/;
  if (!formData.password || !passwordRegex.test(formData.password)) {
    errors.password =
      '비밀번호는 8~16자리 영어, 숫자, 특수문자 조합이어야 합니다.';
  }

  if (formData.password !== formData.confirmPassword) {
    errors.confirmPassword = '비밀번호가 일치하지 않습니다.';
  }

  const businessNumberRegex = /^[0-9]{13}$/;
  if (
    !formData.businessNumber ||
    !businessNumberRegex.test(formData.businessNumber)
  ) {
    errors.businessNumber = '사업자 등록 번호는 13자리 숫자여야 합니다.';
  }

  return errors;
};
