import React from 'react';
import PropTypes from 'prop-types';
import InputField from '../../components/InputField';
import Button from '../../components/Button';

function EditProfileForm({
  state,
  isLoading,
  isDeleting,
  handleChange,
  handleSubmit,
  handleDelete,
}) {
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {state.errors.fetch && (
        <div className="mb-4 text-sm text-red-500">{state.errors.fetch}</div>
      )}

      <InputField
        label="아이디"
        name="id"
        type="text"
        placeholder="아이디"
        value={isLoading ? '불러오는 중...' : state.id || ''}
        readOnly
      />

      <InputField
        label="비밀번호"
        name="password"
        type="password"
        placeholder="8자 이상, 대소문자, 숫자, 특수문자 포함"
        value={state.password}
        onChange={(name, value) => handleChange(name, value)}
      />

      <InputField
        label="비밀번호 확인"
        name="confirmPassword"
        type="password"
        placeholder="비밀번호와 동일"
        value={state.confirmPassword}
        onChange={(name, value) => handleChange(name, value)}
        error={
          state.password !== state.confirmPassword &&
          state.confirmPassword !== ''
            ? '비밀번호가 일치하지 않습니다.'
            : ''
        }
      />

      <InputField
        label="업체명"
        name="companyName"
        type="text"
        placeholder="업체명을 입력하세요."
        value={isLoading ? '불러오는 중...' : state.companyName || ''}
        onChange={(name, value) => handleChange(name, value)}
      />

      <InputField
        label="사업자 등록 번호"
        name="businessNumber"
        type="text"
        placeholder="-없이 13자리 숫자"
        value={isLoading ? '불러오는 중...' : state.businessNumber || ''}
        onChange={(name, value) => handleChange(name, value)}
        onClickButton={() => alert('아이디 중복 확인 기능 연결 예정')}
      />

      <Button
        label="수정하기"
        size="md"
        className="w-full bg-blue-600 text-white"
        disabled={isLoading || isDeleting}
        type="submit"
      />
      <Button
        label="탈퇴하기"
        size="md"
        variant="white"
        className="w-full border border-blue-600"
        onClick={handleDelete}
        disabled={isDeleting}
        type="submit"
      />
    </form>
  );
}

EditProfileForm.propTypes = {
  state: PropTypes.shape({
    id: PropTypes.string,
    password: PropTypes.string,
    confirmPassword: PropTypes.string,
    companyName: PropTypes.string,
    businessNumber: PropTypes.string,
    errors: PropTypes.object,
  }).isRequired,
  isLoading: PropTypes.bool.isRequired,
  isDeleting: PropTypes.bool.isRequired,
  handleChange: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  handleDelete: PropTypes.func.isRequired,
};

export default EditProfileForm;
