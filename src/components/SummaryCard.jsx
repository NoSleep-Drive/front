import React from 'react';
import PropTypes from 'prop-types';

const SummaryCard = ({ label, count, icon }) => {
  return (
    <div className="bg-cornflower-100 relative w-full flex flex-col gap-1 rounded-xl p-6 shadow-sm ">
      <div className="text-cornflower-950 absolute top-4 right-6">{icon}</div>

      <div className="body font-semibold">{label}</div>
      <div className="head2">{count}</div>
    </div>
  );
};

SummaryCard.propTypes = {
  label: PropTypes.string.isRequired,
  count: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  icon: PropTypes.element,
};

export default SummaryCard;
