import React from 'react';
import EditProfileForm from './EditProfileForm';
import { useEditProfile } from './useEditProfile';

export default function EditProfile() {
  const {
    state,
    isDeleting,
    isLoading,
    handleChange,
    handleSubmit,
    handleDelete,
  } = useEditProfile();

  return (
    <section className="flex min-h-screen items-center justify-center bg-white p-4">
      <div className="w-full max-w-lg p-8">
        <h2 className="text-center text-2xl font-semibold">회원 정보 수정</h2>
        <EditProfileForm
          state={state}
          isLoading={isLoading}
          isDeleting={isDeleting}
          handleChange={handleChange}
          handleSubmit={handleSubmit}
          handleDelete={handleDelete}
        />
      </div>
    </section>
  );
}
