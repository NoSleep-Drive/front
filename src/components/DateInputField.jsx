import React from 'react';
import PropTypes from 'prop-types';
import DatePicker from 'react-datepicker';
import clsx from 'clsx';
import { ko } from 'date-fns/locale';

import 'react-datepicker/dist/react-datepicker.css';

const DateInputField = ({
  label,
  placeholder,
  selected,
  onChange,
  error,
  disabled = false,
  isSuccess = false,
}) => {
  const typed = !!selected;
  const filled = typed && !error && !isSuccess;

  const inputClass = clsx(
    'w-full h-[53px] px-4 text-[18px] rounded-xl border font-normal font-pretendard transition bg-white',
    {
      'text-cornflower-950 placeholder-cornflower-400 border-cornflower-400':
        !error && !disabled && !isSuccess,
      'focus:outline-none focus:border-cornflower-500 focus:placeholder-cornflower-950':
        !error && !disabled,

      'border-cornflower-500': filled && !error,
      'border-green-500': isSuccess,

      'bg-gray-100 text-gray-400 cursor-not-allowed border-gray-300': disabled,
      'border-red-400 placeholder-red-400': error,
    }
  );

  return (
    <div className="w-full space-y-1">
      {label && <label className="caption-bold">{label}</label>}
      <DatePicker
        selected={selected}
        onChange={onChange}
        placeholderText={placeholder}
        dateFormat="yyyy년 MM월 dd일"
        locale={ko}
        disabled={disabled}
        className={inputClass}
        isClearable
      />
      {error && (
        <p className="pt-1 text-sm font-normal text-red-500">{error}</p>
      )}
    </div>
  );
};

DateInputField.propTypes = {
  label: PropTypes.string,
  placeholder: PropTypes.string,
  selected: PropTypes.instanceOf(Date),
  onChange: PropTypes.func.isRequired,
  error: PropTypes.string,
  disabled: PropTypes.bool,
  isSuccess: PropTypes.bool,
};

export default DateInputField;
