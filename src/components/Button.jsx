import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
//import { Download, Search } from "lucide-react";

const Button = ({
  label,
  onClick,
  variant = 'main', 
  size = 'md',
  icon,
  iconPosition = 'left', // "left" or "right"
  onlyIcon = false, 
  className = '',
}) => {
  const base =
    'inline-flex items-center justify-center font-pretendard rounded-xl transition whitespace-nowrap';

  const variants = {
    main: 'bg-cornflower-400 text-white hover:bg-cornflower-500',
    white:
      'bg-white text-cornflower-400 border border-cornflower-400 hover:text-cornflower-500 hover:border-cornflower-500 hover:font-medium',
  };

  const sizes = {
    sm: 'text-base px-3 py-2 gap-1',
    md: 'text-xl px-6 py-3 gap-2',
    lg: 'text-2xl px-8 py-4 gap-2',
  };

  return (
    <button
      onClick={onClick}
      className={clsx(base, variants[variant], sizes[size], className)}
    >
      {onlyIcon && icon}
      {!onlyIcon && icon && iconPosition === 'left' && (
        <span className="mr-2">{icon}</span>
      )}
      {!onlyIcon && <span>{label}</span>}
      {!onlyIcon && icon && iconPosition === 'right' && (
        <span className="ml-2">{icon}</span>
      )}
    </button>
  );
};

Button.propTypes = {
  label: PropTypes.string,
  onClick: PropTypes.func,
  variant: PropTypes.oneOf(['main', 'white']),
  size: PropTypes.oneOf(['sm', 'md', 'lg']),
  icon: PropTypes.node,
  iconPosition: PropTypes.oneOf(['left', 'right']),
  onlyIcon: PropTypes.bool,
  className: PropTypes.string,
};

export default Button;
