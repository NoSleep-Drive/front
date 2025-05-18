import { useState, useReducer, useEffect } from 'react';
import {
  getCompanyInformation,
  updateCompany,
  deleteCompany,
} from '../../api/companyApi';
import { useNavigate } from 'react-router-dom';

const initialState = {
  id: '',
  password: '',
  confirmPassword: '',
  companyName: '',
  businessNumber: '',
  errors: {},
};

function reducer(state, action) {
  switch (action.type) {
    case 'SET_FIELD':
      return { ...state, [action.field]: action.value };
    case 'SET_COMPANY_INFO':
      return {
        ...state,
        id: action.payload.id,
        companyName: action.payload.companyName,
        businessNumber: action.payload.businessNumber,
      };
    default:
      return state;
  }
}

export function useEditProfile() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCompanyInfo = async () => {
      try {
        const token = localStorage.getItem('auth_token');
        if (token) {
          const response = await getCompanyInformation(token);
          const { id, companyName, businessNumber } = response.data;
          dispatch({
            type: 'SET_COMPANY_INFO',
            payload: { id, companyName, businessNumber },
          });
        }
      } catch (error) {
        dispatch({
          type: 'SET_FIELD',
          field: 'errors',
          value: {
            fetch:
              error.message || '회사 정보를 불러오는 중 오류가 발생했습니다.',
          },
        });
      } finally {
        setIsLoading(false);
      }
    };
    fetchCompanyInfo();
  }, []);

  const handleChange = (field, value) => {
    dispatch({ type: 'SET_FIELD', field, value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('auth_token');
    if (!token) return;
    try {
      setIsLoading(true);
      const formData = {
        password: state.password,
        companyName: state.companyName,
        businessNumber: state.businessNumber,
      };
      const response = await updateCompany(token, formData);

      const { message } = response;
      if (message === '회원 정보가 수정되었습니다.') {
        alert('회원 정보가 성공적으로 수정되었습니다.');
        dispatch({ type: 'SET_FIELD', field: 'password', value: '' });
        dispatch({ type: 'SET_FIELD', field: 'confirmPassword', value: '' });
      }
    } catch (error) {
      alert(`회원 정보 수정 실패: ${error.message}`);
      dispatch({
        type: 'SET_FIELD',
        field: 'errors',
        value: {
          submit: error.message || '회원 정보 업데이트 중 오류가 발생했습니다.',
        },
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('정말 탈퇴하시겠습니까?')) return;
    try {
      setIsDeleting(true);
      const token = localStorage.getItem('auth_token');
      if (token) {
        const response = await deleteCompany(token);
        const { message } = response;
        if (message === '회원 탈퇴가 완료되었습니다.') {
          alert('성공적으로 탈퇴되었습니다.');
          localStorage.removeItem('auth_token');
          localStorage.removeItem('id');
          navigate('/');
        }
      }
    } catch (error) {
      alert(`회원 탈퇴 실패: ${error.message}`);
      dispatch({
        type: 'SET_FIELD',
        field: 'errors',
        value: {
          delete: error.message || '회원 탈퇴 중 오류가 발생했습니다.',
        },
      });
    } finally {
      setIsDeleting(false);
    }
  };

  return {
    state,
    isDeleting,
    isLoading,
    handleChange,
    handleSubmit,
    handleDelete,
  };
}
