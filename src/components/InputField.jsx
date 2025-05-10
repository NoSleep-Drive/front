import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { XIcon, CheckCircle } from 'lucide-react';
import Button from './Button';

const InputField = ({
  label,
  placeholder,
  value,
  onChange,
  onClickButton,
  buttonLabel,
  error,
  disabled = false,
  withButton = false,
  isSuccess = false,
  size = 'md', // default
}) => {
  const typed = value?.length > 0;
  const filled = typed && !error && !isSuccess;

  const sizeClass = {
    sm: 'h-10 text-sm px-3',
    md: 'py-3 px-4 text-[18px]', // 기존 스타일을 md로 이동
    lg: 'py-4 px-5 text-[20px]',
  }[size];

  const inputClass = clsx(
    'w-full pr-10 rounded-xl border font-normal font-pretendard transition bg-white',
    sizeClass,
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
      {label && (
        <label className="text-cornflower-950 text-[22px] font-normal">
          {label}
        </label>
      )}
      <div
        className={clsx('relative', withButton && 'flex items-center gap-2')}
      >
        <input
          type="text"
          className={inputClass}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          disabled={disabled}
        />

        {filled && (
          <button
            type="button"
            onClick={() => onChange({ target: { value: '' } })}
            className="text-cornflower-400 hover:text-cornflower-600 absolute top-1/2 right-3 -translate-y-1/2"
          >
            <XIcon size={18} />
          </button>
        )}

        {isSuccess && (
          <span className="text-cornflower-500 absolute top-1/2 right-3 -translate-y-1/2">
            <CheckCircle size={20} />
          </span>
        )}

        {withButton && (
          <Button
            label={buttonLabel}
            size="sm"
            variant="main"
            onClick={onClickButton}
          />
        )}
      </div>

      {error && (
        <p className="pt-1 text-sm font-normal text-red-500">{error}</p>
      )}
    </div>
  );
};

InputField.propTypes = {
  label: PropTypes.string,
  placeholder: PropTypes.string,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  onClickButton: PropTypes.func,
  buttonLabel: PropTypes.string,
  error: PropTypes.string,
  disabled: PropTypes.bool,
  withButton: PropTypes.bool,
  isSuccess: PropTypes.bool,
  size: PropTypes.oneOf(['sm', 'md', 'lg']), // ✅ 추가
};

export default InputField;
