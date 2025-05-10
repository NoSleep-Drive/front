// src/components/ui/switch.jsx
import PropTypes from 'prop-types';
import * as React from 'react';

export const Switch = ({ checked, onCheckedChange, className }) => {
  return (
    <button
      role="switch"
      aria-checked={checked}
      onClick={() => onCheckedChange(!checked)}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition ${checked ? 'bg-blue-500' : 'bg-gray-300'} ${className}`}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
          checked ? 'translate-x-6' : 'translate-x-1'
        }`}
      />
    </button>
  );
};

Switch.propTypes = {
  checked: PropTypes.bool.isRequired,
  onCheckedChange: PropTypes.func.isRequired,
  className: PropTypes.string,
};
