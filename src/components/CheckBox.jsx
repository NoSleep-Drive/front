import React from 'react';
import { Check } from 'lucide-react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
export default function Checkbox({ checked, onChange }) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className={clsx(
        'flex h-6 w-6 items-center justify-center rounded-md border transition-colors',
        checked
          ? 'bg-cornflower-500 border-cornflower-500 text-white'
          : 'border-black bg-white text-transparent'
      )}
    >
      <Check size={16} />
    </button>
  );
}
Checkbox.propTypes = {
  checked: PropTypes.bool.isRequired,
  onChange: PropTypes.func.isRequired,
  size: PropTypes.oneOf(['sm', 'md', 'lg']),
  disabled: PropTypes.bool,
  className: PropTypes.string,
};