import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import InputField from './InputField';
import Button from './Button';

export default function LoginForm() {
  const [id, setId] = useState('');
  const [pw, setPw] = useState('');
  const handleChange = (name, value) => {
    if (name === 'id') setId(value);
    if (name === 'pw') setPw(value);
  };
  const navigate = useNavigate();

  const handleLogin = () => {
    // TODO:로그인 연결 - 현재는 임시 처리
    navigate('/dashboard');
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
          value={pw}
          name="pw"
          required
          type="password"
          onChange={handleChange}
          size="md"
        />
      </div>

      <Button
        onClick={handleLogin}
        label="로그인"
        size="md"
        className="mb-4 w-full"
        disabled={!id || !pw}
      />
      <div className="text-center text-[18px]">
        <Link to="/signup" className="text-cornflower-500 hover:underline">
          회원가입
        </Link>
      </div>
    </div>
  );
}
