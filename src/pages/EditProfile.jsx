import React, { useReducer } from 'react';
import InputField from '../components/InputField';
import Button from '../components/Button';

const initialState = {
  username: '',
  password: '',
  confirmPassword: '',
  companyName: '',
  businessNumber: '',
  agreeAll: false,
  agreeTerms: false,
  agreePrivacy: false,
  errors: {},
};

function reducer(state, action) {
  switch (action.type) {
    case 'SET_FIELD':
      return { ...state, [action.field]: action.value };
    case 'SET_ERROR':
      return {
        ...state,
        errors: { ...state.errors, [action.field]: action.error },
      };
    case 'RESET':
      return initialState;
    default:
      return state;
  }
}

export default function EditProfile() {
  const [state, dispatch] = useReducer(reducer, initialState);

  const handleChange = (field, value) => {
    dispatch({ type: 'SET_FIELD', field, value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted');
  };

  return (
    <section className="flex min-h-screen items-center justify-center bg-white p-4">
      <div className="w-full max-w-lg p-8">
        <h2 className="text-center text-2xl font-semibold">회원 정보 수정</h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <InputField
            label="아이디"
            name="username"
            type="text"
            placeholder="아이디"
            value={state.username}
            onChange={(name, value) => handleChange(name, value)}
          />

          <InputField
            label="비밀번호"
            name="password"
            type="password"
            placeholder="비밀번호"
            value={state.password}
            onChange={(name, value) => handleChange(name, value)}
          />

          <InputField
            label="비밀번호 확인"
            name="confirmPassword"
            type="password"
            placeholder="비밀번호 확인"
            value={state.confirmPassword}
            onChange={(name, value) => handleChange(name, value)}
          />

          <InputField
            label="업체명"
            name="companyName"
            type="text"
            placeholder="업체명을 입력하세요."
            value={state.companyName}
            onChange={(name, value) => handleChange(name, value)}
          />

          <InputField
            label="사업자 등록 번호"
            name="businessNumber"
            type="text"
            placeholder="-없이 13자리 숫자"
            value={state.businessNumber}
            onChange={(name, value) => handleChange(name, value)}
            withButton
            buttonLabel="중복 확인"
          />

          <Button
            label="수정하기"
            size="md"
            className="w-full bg-blue-600 text-white"
          />
          <Button
            label="탈퇴하기"
            size="md"
            variant="white"
            className="w-full border border-blue-600"
          />
        </form>
      </div>
    </section>
  );
}
