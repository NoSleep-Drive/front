import React from 'react';
import PropTypes from 'prop-types';

export default function CustomAuthInput({
  label,
  name,
  type = 'text',
  placeholder,
  value,
  onChange,
  required = false,
  error,
}) {
  return (
    <div className="flex flex-col">
      <label className="text-sm font-semibold text-gray-700">{label}</label>
      <input
        type={type}
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        required={required}
        className="mt-1 rounded-lg border border-[#6EA1ED] bg-white p-2 placeholder-[#6EA1ED]"
      />
      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
    </div>
  );
}

CustomAuthInput.propTypes = {
  label: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  type: PropTypes.string,
  placeholder: PropTypes.string,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  onChange: PropTypes.func.isRequired,
  required: PropTypes.bool,
  error: PropTypes.string,
};
