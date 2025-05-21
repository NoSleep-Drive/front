import React from 'react';
import PropTypes from 'prop-types';
export default function SleepdataInfo({
  vehicleNumber,
  driverIndex,
  driverHash,
  date,
  time,
}) {
  return (
    <div className="flex flex-wrap items-center gap-4">
      <span>차량 번호: {vehicleNumber}</span>
      <span>
        운전자:{' '}
        {driverIndex !== null && driverIndex !== undefined
          ? `운전자 ${driverIndex + 1}`
          : driverHash}
      </span>
      <span>감지 날짜: {date}</span>
      <span>감지 시각: {typeof time === 'string' ? time.slice(0, 8) : ''}</span>
    </div>
  );
}
SleepdataInfo.propTypes = {
  vehicleNumber: PropTypes.string.isRequired,
  driverIndex: PropTypes.number,
  driverHash: PropTypes.string,
  date: PropTypes.string,
  time: PropTypes.string,
};
