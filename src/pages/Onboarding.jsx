import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Carousel } from '@/components/ui/carousel';
import { loginApi } from '@/api/authApi';
import CustomAuthInput from '@/components/CustomAuthInput';
import Button from '@/components/Button';

export default function AuthOnboarding() {
  const [id, setId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
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
        navigate('/');
      }
    } catch (err) {
      console.error('로그인 오류:', err);
      setError('로그인에 실패했습니다. 다시 시도해주세요.');
    }
  };

  const handleSignup = () => {
    navigate('/signup');
  };

  return (
    <div className="flex h-screen">
      <div className="hidden flex-1 items-center justify-center bg-gradient-to-r from-blue-50 to-blue-100 md:flex">
        <Carousel />
      </div>

      <div className="flex flex-1 items-center justify-center rounded-lg bg-white p-8 shadow-lg">
        <div className="w-full max-w-md space-y-6">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-blue-600">NoSleep Drive</h2>
          </div>

          {/* 로그인 폼 */}
          <form className="space-y-4" onSubmit={handleLogin}>
            <CustomAuthInput
              label=""
              name="id"
              placeholder="ID"
              value={id}
              onChange={(e) => setId(e.target.value)}
            />
            <CustomAuthInput
              label=""
              name="password"
              type="password"
              placeholder="PASSWORD"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            {error && <p className="text-red-500">{error}</p>}

            <div className="flex flex-col gap-2">
              <Button
                label="로그인"
                variant="main"
                className="bg-[#6EA1ED] py-2 text-white hover:bg-[#5a8cce]"
                type="submit"
                onClick={handleLogin}
              />
              <Button
                label="회원 가입"
                variant="white"
                className="border-[#6EA1ED] bg-white py-2 text-[#6EA1ED] hover:border-[#5a8cce] hover:text-[#5a8cce]"
                type="button"
                onClick={handleSignup}
              />
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
