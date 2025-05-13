import PropTypes from 'prop-types';
import * as React from 'react';
import clsx from 'clsx';

export const Switch = ({ checked, onCheckedChange, className }) => {
  return (
    <button
      role="switch"
      type="button"
      aria-checked={checked}
      onClick={() => {
        console.log('스위치 클릭됨');
        onCheckedChange(!checked);
      }}
      className={clsx(
        'relative inline-flex h-6 w-11 items-center rounded-full transition',
        checked ? 'bg-cornflower-400' : 'bg-gray-300',
        className
      )}
    >
      <span
        className={clsx(
          'inline-block h-4 w-4 transform rounded-full bg-white transition',
          checked ? 'translate-x-6' : 'translate-x-1'
        )}
      />
    </button>
  );
};

Switch.propTypes = {
  checked: PropTypes.bool.isRequired,
  onCheckedChange: PropTypes.func.isRequired,
  className: PropTypes.string,
};
