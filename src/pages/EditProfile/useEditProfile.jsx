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

    const formData = {
      password: state.password,
      companyName: state.companyName,
      businessNumber: state.businessNumber,
    };
    await updateCompany(token, formData);
    navigate('/edit');
  };

  const handleDelete = async () => {
    if (!window.confirm('정말 탈퇴하시겠습니까?')) return;

    try {
      setIsDeleting(true);
      const token = localStorage.getItem('auth_token');
      if (token) {
        await deleteCompany(token);
        localStorage.removeItem('auth_token');
        navigate('/');
      }
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
