import React, { createContext, useContext, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { getCompanyInformation } from '@/api/companyApi';

export const CompanyContext = createContext();

export const CompanyProvider = ({ children }) => {
  const [companyName, setCompanyName] = useState('');
  const [isCompanyLoaded, setIsCompanyLoaded] = useState(false);

  const fetchCompanyName = async () => {
    const token = localStorage.getItem('auth_token');
    if (!token) {
      setCompanyName('');
      setIsCompanyLoaded(true);
      return;
    }

    try {
      const res = await getCompanyInformation();
      const name = res?.companyName ?? '';
      setCompanyName(name);
      localStorage.setItem('companyName', name);
    } catch (err) {
      console.error('회사 정보 조회 실패:', err);
      setCompanyName('');
    } finally {
      setIsCompanyLoaded(true);
    }
  };

  useEffect(() => {
    fetchCompanyName();
  }, []);

  return (
    <CompanyContext.Provider
      value={{ companyName, setCompanyName, isCompanyLoaded, fetchCompanyName }}
    >
      {children}
    </CompanyContext.Provider>
  );
};

CompanyProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export const useCompany = () => useContext(CompanyContext);
