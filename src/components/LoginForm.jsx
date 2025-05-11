import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import InputField from './InputField';
import Button from './Button';
//import PropTypes from 'prop-types';

export default function LoginForm() {
  const [id, setId] = useState('');
  const [pw, setPw] = useState('');
  const [error, setError] = useState(null);

  const handleLogin = () => {
    if (!id || !pw) {
      setError('아이디와 비밀번호를 모두 입력해주세요.');
      return;
    }

    setError(null);
    // 로그인 연결
  };

  return (
    <div className="flex w-full max-w-[340px] flex-col">
      <div className="mb-8 flex flex-col items-center">
        <img
          src="/logo.svg"
          alt="logo"
          className="mx-auto mb-4 h-12 select-none"
          draggable={false}
          onContextMenu={(e) => e.preventDefault()}
        />

        <img
          src="/NOSLEEPDRIVE-blue.svg"
          alt="slogan"
          className="mx-auto select-none"
          draggable={false}
          onContextMenu={(e) => e.preventDefault()}
        />
      </div>

      <div className="mb-6 flex flex-col gap-3">
        <InputField
          placeholder="ID"
          value={id}
          onChange={(e) => setId(e.target.value)}
          error={error && !id ? '아이디를 입력해주세요' : ''}
          size="md"
        />
        <InputField
          placeholder="PASSWORD"
          value={pw}
          type="password"
          onChange={(e) => setPw(e.target.value)}
          error={error && !pw ? '비밀번호를 입력해주세요' : ''}
          size="md"
        />
      </div>

      <Button
        onClick={handleLogin}
        label="로그인"
        size="md"
        className="mb-4 w-full"
      />
      <div className="text-center text-[18px]">
        <Link to="/signup" className="text-cornflower-500 hover:underline">
          회원가입
        </Link>
      </div>
    </div>
  );
}
