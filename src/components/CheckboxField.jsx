import React from 'react';
import PropTypes from 'prop-types';

export default function CheckboxField({ label, name, checked, onChange }) {
  return (
    <label className="flex items-center">
      <input
        type="checkbox"
        name={name}
        checked={checked}
        onChange={onChange}
      />
      <span className="ml-2">{label}</span>
    </label>
  );
}

CheckboxField.propTypes = {
  label: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  checked: PropTypes.bool.isRequired,
  onChange: PropTypes.func.isRequired,
};
