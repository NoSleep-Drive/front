import React, { useState } from 'react';
import InputField from '../components/InputField';
import CheckboxField from '../components/CheckboxField';
import { validate } from '../utils/formValidation';
import { signUpApi } from '../api/authApi';
import { useNavigate } from 'react-router-dom';
import Button from '@/components/Button';
export default function SignUp() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    id: '',
    password: '',
    confirmPassword: '',
    companyName: '',
    businessNumber: '',
    agreeAll: false,
    agreeTerms: false,
    agreePrivacy: false,
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (name, value) => {
    setFormData((prevData) => {
      const updatedData = {
        ...prevData,
        [name]: value,
      };

      if (name === 'agreeAll') {
        updatedData.agreeTerms = value;
        updatedData.agreePrivacy = value;
      }
      if (name === 'agreeTerms' || name === 'agreePrivacy') {
        updatedData.agreeAll =
          (name === 'agreeTerms' ? value : updatedData.agreeTerms) &&
          (name === 'agreePrivacy' ? value : updatedData.agreePrivacy);
      }

      return updatedData;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      const responseMessage = await signUpApi(formData);
      console.log('회원가입 통신 성공:', responseMessage);
      alert('회원가입이 성공적으로 완료되었습니다!');
      navigate('/');
    } catch (error) {
      console.error('회원가입 실패:', error);
      alert(error);
    } finally {
      setLoading(false);
    }
  };

  const validateForm = () => {
    const validationErrors = validate(formData);
    setErrors(validationErrors);
    return Object.keys(validationErrors).length === 0;
  };

  return (
    <section className="flex min-h-screen items-center justify-center bg-blue-50 p-4">
      <div className="w-full max-w-lg rounded-xl bg-white p-8 shadow-lg">
        <div className="mb-6 text-center">
          <img
            src="/NOSLEEPDRIVE-blue.svg"
            alt="slogan"
            className="mx-auto select-none"
            draggable={false}
            onContextMenu={(e) => e.preventDefault()}
          />{' '}
        </div>
        <form onSubmit={handleSubmit} className="space-y-6">
          <InputField
            label="아이디"
            name="id"
            type="text"
            placeholder="영어, 숫자 조합 8~16자리"
            value={formData.id}
            onChange={handleChange}
            required
            error={errors.id}
            withButton
            buttonLabel="중복 확인"
            onClickButton={() => alert('아이디 중복 확인 기능 연결 예정')}
          />

          <InputField
            label="비밀번호"
            name="password"
            type="password"
            placeholder="영어, 숫자, 특수문자 조합 8~16자리"
            value={formData.password}
            onChange={handleChange}
            required
            error={errors.password}
          />

          <InputField
            label="비밀번호 확인"
            name="confirmPassword"
            type="password"
            placeholder="비밀번호와 동일"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
            error={errors.confirmPassword}
          />

          <InputField
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
              <InputField
                label="사업자 등록 번호"
                name="businessNumber"
                type="text"
                placeholder="-없이 13자리 숫자"
                value={formData.businessNumber}
                onChange={handleChange}
                required
                error={errors.businessNumber}
                withButton
                buttonLabel="중복 확인"
                onClickButton={() =>
                  alert('사업자 번호 중복 확인 기능 연결 예정')
                }
              />
            </div>
          </div>

          <div className="mt-4 flex flex-col gap-2">
            <CheckboxField
              label={<span className="caption-bold">모두 동의합니다.</span>}
              name="agreeAll"
              checked={formData.agreeAll}
              onChange={(e) => handleChange(e.target.name, e.target.checked)}
            />
            <div className="caption ml-4 space-y-2">
              <CheckboxField
                label="이용약관에 동의합니다. (필수)"
                name="agreeTerms"
                checked={formData.agreeTerms}
                onChange={(e) => handleChange(e.target.name, e.target.checked)}
              />
              <CheckboxField
                label="개인정보 수집 및 이용에 동의합니다. (필수)"
                name="agreePrivacy"
                checked={formData.agreePrivacy}
                onChange={(e) => handleChange(e.target.name, e.target.checked)}
              />
            </div>
          </div>

          <Button
            type="submit"
            label={loading ? '가입 중...' : '가입하기'}
            size="md"
            variant="main"
            className="w-full rounded-[10px]"
            disabled={!formData.agreeAll || loading}
          />
        </form>
      </div>
    </section>
  );
}
