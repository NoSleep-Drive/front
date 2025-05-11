import React, { useState } from 'react';

export default function SignUp() {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    confirmPassword: '',
    companyName: '',
    businessNumber: '',
    agreeAll: false,
    agreeTerms: false,
    agreePrivacy: false,
  });

  const handleChange = (e) => {
    const { name, value, checked, type } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('가입하기 버튼 클릭됨:', formData);
  };

  return (
    <section className="flex min-h-screen items-center justify-center bg-blue-50 p-4">
      <div className="w-full max-w-md rounded-xl bg-white p-8 shadow-lg">
        <div className="mb-6 text-center">
          <h2 className="text-2xl font-bold text-blue-600">NoSleep Drive</h2>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* 아이디 입력 */}
          <div className="flex flex-col">
            <label
              htmlFor="username"
              className="text-sm font-semibold text-gray-700"
            >
              아이디
            </label>
            <input
              type="text"
              name="username"
              id="username"
              placeholder="영어, 숫자 조합 4~16자리"
              className="form-input mt-1 rounded-lg border border-[#6EA1ED] bg-white p-2 placeholder-[#6EA1ED]" // 스타일 변경
              onChange={handleChange}
              required
            />
          </div>

          {/* 비밀번호 입력 */}
          <div className="flex flex-col">
            <label
              htmlFor="password"
              className="text-sm font-semibold text-gray-700"
            >
              비밀번호
            </label>
            <input
              type="password"
              name="password"
              id="password"
              placeholder="영어, 숫자, 특수문자 조합 8~16자리"
              className="form-input mt-1 rounded-lg border border-[#6EA1ED] bg-white p-2 placeholder-[#6EA1ED]" // 스타일 변경
              onChange={handleChange}
              required
            />
          </div>

          {/* 비밀번호 확인 입력 */}
          <div className="flex flex-col">
            <label
              htmlFor="confirmPassword"
              className="text-sm font-semibold text-gray-700"
            >
              비밀번호 확인
            </label>
            <input
              type="password"
              name="confirmPassword"
              id="confirmPassword"
              placeholder="영어, 숫자, 특수문자 조합 8~16자리"
              className="form-input mt-1 rounded-lg border border-[#6EA1ED] bg-white p-2 placeholder-[#6EA1ED]" // 스타일 변경
              onChange={handleChange}
              required
            />
          </div>

          {/* 업체명 입력 */}
          <div className="flex flex-col">
            <label
              htmlFor="companyName"
              className="text-sm font-semibold text-gray-700"
            >
              업체명
            </label>
            <input
              type="text"
              name="companyName"
              id="companyName"
              placeholder="업체명을 입력하세요."
              className="form-input mt-1 rounded-lg border border-[#6EA1ED] bg-white p-2 placeholder-[#6EA1ED]" // 스타일 변경
              onChange={handleChange}
              required
            />
          </div>

          {/* 사업자 등록 번호 입력 */}
          <div className="flex items-center space-x-4">
            <div className="flex-1">
              <label
                htmlFor="businessNumber"
                className="mb-2 text-sm font-semibold text-gray-700" // label 아래 간격 추가
              >
                사업자 등록 번호
              </label>
              <input
                type="text"
                name="businessNumber"
                id="businessNumber"
                placeholder="-없이 13자리 숫자"
                className="form-input mb-2 w-full rounded-lg border border-[#6EA1ED] bg-white p-2 placeholder-[#6EA1ED]" // 스타일 변경
                onChange={handleChange}
                required
              />
            </div>

            {/* 중복 확인 버튼 */}
            <button
              type="button"
              className="mt-3 w-1/4 rounded-lg border border-[#6EA1ED] bg-white p-2 text-[#6EA1ED] hover:bg-[#6EA1ED] hover:text-white"
            >
              중복 확인
            </button>
          </div>

          {/* 동의 체크박스 */}
          <div className="mt-4 flex flex-col gap-2">
            <label className="flex items-center">
              <input
                type="checkbox"
                name="agreeAll"
                onChange={handleChange}
                checked={formData.agreeAll}
              />
              <span className="ml-2">모두 동의합니다.</span>
            </label>
            <label className="ml-4 flex items-center">
              <input
                type="checkbox"
                name="agreeTerms"
                onChange={handleChange}
                checked={formData.agreeTerms}
              />
              <span className="ml-2">이용약관에 동의합니다. (필수)</span>
            </label>
            <label className="ml-4 flex items-center">
              <input
                type="checkbox"
                name="agreePrivacy"
                onChange={handleChange}
                checked={formData.agreePrivacy}
              />
              <span className="ml-2">
                개인정보 수집 및 이용에 동의합니다. (필수)
              </span>
            </label>
          </div>

          <button
            type="submit"
            className="w-full rounded-[10px] bg-[#6EA1ED] py-3 text-white transition hover:bg-[#5b8cd7]"
          >
            가입하기
          </button>
        </form>
      </div>
    </section>
  );
}
