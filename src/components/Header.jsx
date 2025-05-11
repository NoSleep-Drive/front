// [API 연동 예정] companyName 받아오기

import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';

const NavItem = ({ label, to, isActive = false }) => (
  <Link
    to={to}
    className={`rounded-md px-3 py-2 transition ${
      isActive ? 'bg-cornflower-500' : 'hover:bg-cornflower-400'
    }`}
  >
    {label}
  </Link>
);
NavItem.propTypes = {
  label: PropTypes.string.isRequired,
  to: PropTypes.string.isRequired,
  isActive: PropTypes.bool,
};

const Header = ({
  companyName = 'ㅇㅇㅇ 업체', // TODO: 로그인 후 회사명 받아오기
  onLogout = () => {},
}) => {
  const navigate = useNavigate();
  const location = useLocation();

  const currentPath = location.pathname;
  const getActivePage = () => {
    if (currentPath.startsWith('/dashboard')) return 'dashboard';
    if (currentPath.startsWith('/vehicles')) return 'vehicles';
    if (currentPath.startsWith('/search')) return 'drowsiness';
    return '';
  };
  const activePage = getActivePage();

  const handleLogout = () => {
    //log out 시 동작
    onLogout();
    navigate('/welcomepage');
  };

  return (
    <header className="bg-cornflower-400 text-normal font-pretendard flex h-20 items-center justify-between px-10 text-xl text-white sm:text-2xl">
      {' '}
      {/* 로고, 네비 */}
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-6 px-4 py-2">
          <img src="/logo.svg" alt="로고" className="h-10 w-auto" />
        </div>

        <nav className="flex gap-6">
          <NavItem
            label="대시보드"
            to="/dashboard"
            isActive={activePage === 'dashboard'}
          />
          <NavItem
            label="차량 등록 관리"
            to="/vehicles"
            isActive={activePage === 'vehicles'}
          />
          <NavItem
            label="졸음 데이터 조회"
            to="/drowsiness/search"
            isActive={activePage === 'drowsiness'}
          />
        </nav>
      </div>
      {/* 회사명, 로그아웃 */}
      <div className="flex items-center gap-6">
        <Link to="/settings" className="hover:underline">
          {companyName}
        </Link>
        <button onClick={handleLogout} className="hover:underline">
          로그아웃
        </button>
      </div>
    </header>
  );
};
Header.propTypes = {
  activePage: PropTypes.string,
  companyName: PropTypes.string,
  onLogout: PropTypes.func,
};
export default Header;
