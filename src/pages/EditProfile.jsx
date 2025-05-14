import React, { useReducer, useEffect } from 'react';
import InputField from '../components/InputField';
import Button from '../components/Button';
import { getCompanyInformation } from '../api/companyApi';

const initialState = {
  id: null,
  username: '',
  password: '',
  confirmPassword: '',
  companyName: null,
  businessNumber: null,
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
    case 'SET_COMPANY_INFO':
      return {
        ...state,
        id: action.payload.id,
        companyName: action.payload.companyName,
        businessNumber: action.payload.businessNumber,
      };
    case 'RESET':
      return initialState;
    default:
      return state;
  }
}

export default function EditProfile() {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    const fetchCompanyInfo = async () => {
      try {
        const token = localStorage.getItem('auth_token');
        if (token) {
          const response = await getCompanyInformation(token);
          const { id, companyName, businessNumber } = response.data;
          dispatch({
            type: 'SET_COMPANY_INFO',
            payload: {
              id,
              companyName,
              businessNumber,
            },
          });
        } else {
          console.error('토큰을 불러오지 못함');
        }
      } catch (error) {
        console.error('회사 정보 로드 실패:', error);
      }
    };

    fetchCompanyInfo();
  }, []);

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
            value={state.id ?? '불러오는 중...'}
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
            value={state.companyName ?? '불러오는 중...'}
            onChange={(name, value) => handleChange(name, value)}
          />

          <InputField
            label="사업자 등록 번호"
            name="businessNumber"
            type="text"
            placeholder="-없이 13자리 숫자"
            value={state.businessNumber ?? '불러오는 중...'}
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
