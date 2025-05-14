import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { loginApi } from '@/api/authApi';
import InputField from './InputField';
import Button from './Button';

export default function LoginForm() {
  const [id, setId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const handleChange = (name, value) => {
    if (name === 'id') setId(value);
    if (name === 'pw') setPassword(value);
  };
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);

    console.log('로그인 시도', { id, password });

    try {
      const response = await loginApi({ id: id, password });

      console.log('로그인 API 응답:', response);

      if (response.message === '로그인 성공.') {
        const { token } = response;
        localStorage.setItem('auth_token', token);
        localStorage.setItem('id', id);
        navigate('/dashboard');
      }
    } catch (err) {
      console.error('로그인 오류:', err);
      setError('로그인에 실패했습니다. 다시 시도해주세요.');
    }
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
          name="id"
          required
          value={id}
          onChange={handleChange}
          size="md"
        />
        <InputField
          placeholder="PASSWORD"
          value={password}
          name="pw"
          required
          type="password"
          onChange={handleChange}
          size="md"
        />
      </div>

      {error && <p className="text-red-500">{error}</p>}

      <Button
        onClick={handleLogin}
        label="로그인"
        size="md"
        className="mb-4 w-full"
        disabled={!id || !password}
      />
      <div className="text-center text-[18px]">
        <Link to="/signup" className="text-cornflower-500 hover:underline">
          회원가입
        </Link>
      </div>
    </div>
  );
}
