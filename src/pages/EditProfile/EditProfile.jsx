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
    <section className="flex min-h-screen items-center justify-center">
      <div className="w-full max-w-lg rounded-xl bg-white p-8">
        <h2 className="head2 text-center">회원 정보 수정</h2>
        {isLoading ? (
          <div className="mt-4 flex justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-blue-600" />
          </div>
        ) : (
          <EditProfileForm
            state={state}
            isLoading={isLoading}
            isDeleting={isDeleting}
            handleChange={handleChange}
            handleSubmit={handleSubmit}
            handleDelete={handleDelete}
          />
        )}
      </div>
    </section>
  );
}
