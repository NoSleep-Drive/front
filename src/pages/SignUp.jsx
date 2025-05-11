import React, { useState } from 'react';
import CustomAuthInput from '../components/CustomAuthInput';
import CheckboxField from '../components/CheckboxField';
import { validate } from '../utils/formValidation';

export default function SignUp() {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    confirmPassword: '',
    companyName: '',
    businessNumber: '',
    agreeAll: false,
    agreeTerms: false,
    agreePrivacy: false,
  });

  const [errors, setErrors] = useState({
    username: '',
    password: '',
    confirmPassword: '',
    businessNumber: '',
  });

  const handleChange = (e) => {
    const { name, value, checked, type } = e.target;

    setFormData((prevData) => ({
      ...prevData,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate(formData, setErrors)) {
      console.log('가입하기 버튼 클릭됨:', formData);
    } else {
      console.log('유효성 검사 실패', errors);
    }
  };

  return (
    <section className="flex min-h-screen items-center justify-center bg-blue-50 p-4">
      <div className="w-full max-w-md rounded-xl bg-white p-8 shadow-lg">
        <div className="mb-6 text-center">
          <h2 className="text-2xl font-bold text-blue-600">NoSleep Drive</h2>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6">
          <CustomAuthInput
            label="아이디"
            name="username"
            type="text"
            placeholder="영어, 숫자 조합 4~16자리"
            value={formData.username}
            onChange={handleChange}
            required
            error={errors.username}
          />

          <CustomAuthInput
            label="비밀번호"
            name="password"
            type="password"
            placeholder="영어, 숫자, 특수문자 조합 8~16자리"
            value={formData.password}
            onChange={handleChange}
            required
            error={errors.password}
          />

          <CustomAuthInput
            label="비밀번호 확인"
            name="confirmPassword"
            type="password"
            placeholder="비밀번호와 동일"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
            error={errors.confirmPassword}
          />

          <CustomAuthInput
            label="업체명"
            name="companyName"
            type="text"
            placeholder="업체명을 입력하세요."
            value={formData.companyName}
            onChange={handleChange}
            required
          />

          <div className="flex items-center space-x-4">
            <div className="flex-1">
              <CustomAuthInput
                label="사업자 등록 번호"
                name="businessNumber"
                type="text"
                placeholder="-없이 13자리 숫자"
                value={formData.businessNumber}
                onChange={handleChange}
                required
                error={errors.businessNumber}
              />
            </div>
            <button
              type="button"
              className="mt-5 w-1/4 rounded-lg border border-[#6EA1ED] bg-white p-2 text-[#6EA1ED] hover:bg-[#6EA1ED] hover:text-white"
            >
              중복 확인
            </button>
          </div>

          <div className="mt-4 flex flex-col gap-2">
            <CheckboxField
              label="모두 동의합니다."
              name="agreeAll"
              checked={formData.agreeAll}
              onChange={handleChange}
            />
            <div className="ml-4 space-y-2">
              <CheckboxField
                label="이용약관에 동의합니다. (필수)"
                name="agreeTerms"
                checked={formData.agreeTerms}
                onChange={handleChange}
              />
              <CheckboxField
                label="개인정보 수집 및 이용에 동의합니다. (필수)"
                name="agreePrivacy"
                checked={formData.agreePrivacy}
                onChange={handleChange}
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full rounded-[10px] bg-[#6EA1ED] py-3 text-white transition hover:bg-[#5b8cd7]"
          >
            가입하기
          </button>
        </form>
      </div>
    </section>
  );
}
