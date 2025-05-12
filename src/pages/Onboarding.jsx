import React from 'react';
import { Carousel } from '@/components/ui/carousel';
import CustomAuthInput from '@/components/CustomAuthInput';
import Button from '@/components/Button';

export default function AuthOnboarding() {
  return (
    <div className="flex h-screen">
      {/* Onboarding Carousel */}
      <div className="hidden flex-1 items-center justify-center bg-gradient-to-r from-blue-50 to-blue-100 md:flex">
        <Carousel />
      </div>

      {/* Auth Form Section */}
      <div className="flex flex-1 items-center justify-center rounded-lg bg-white p-8 shadow-lg">
        <div className="w-full max-w-md space-y-6">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-blue-600">NoSleep Drive</h2>
          </div>

          <form className="space-y-4">
            <CustomAuthInput
              label=""
              name="username"
              placeholder="ID"
              value=""
              onChange={() => {}}
            />
            <CustomAuthInput
              label=""
              name="password"
              type="password"
              placeholder="PASSWORD"
              value=""
              onChange={() => {}}
            />

            <div className="flex flex-col gap-2">
              <Button
                label="로그인"
                variant="main"
                className="bg-[#6EA1ED] py-2 text-white hover:bg-[#5a8cce]"
              />
              <Button
                label="회원 가입"
                variant="white"
                className="border-[#6EA1ED] bg-white py-2 text-[#6EA1ED] hover:border-[#5a8cce] hover:text-[#5a8cce]"
              />
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
