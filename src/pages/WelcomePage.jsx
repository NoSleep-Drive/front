import React from 'react';
//import PropTypes from 'prop-types';
import LoginForm from '../components/LoginForm';
import OnboardingCard from '@/components/OnboardingCard';

export default function WelcomePage() {
  return (
    <div className="flex h-screen">
      <div className="flex w-1/2 items-center justify-center bg-gradient-to-b from-blue-50 to-blue-100">
        <OnboardingCard/>
      </div>
      <div className="bg-cornflower-50 flex w-1/2 items-center justify-center">
        <LoginForm />
      </div>{' '}
    </div>
  );
}
