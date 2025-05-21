import React from 'react';
import PropTypes from 'prop-types';
import Button from './Button';

const VehicleCard = ({
  vehicleNumber,
  deviceUid,
  createdDate,
  onEdit,
  onDelete,
}) => {
  return (
    <div className="font-pretendard bg-cornflower-100 flex w-full max-w-lg flex-col gap-1 rounded-xl p-6 text-center shadow-sm">
      <h3 className="text-cornflower-950 text-[24px] font-semibold">
        {vehicleNumber}
      </h3>
      <p className="body">기기 ID: {deviceUid}</p>
      <p className="body">등록일: {createdDate.toLocaleDateString()}</p>

      <div className="mt-2 flex justify-center gap-2">
        {onEdit && (
          <Button
            label="수정"
            size="sm"
            variant="white"
            className="w-1/3"
            onClick={onEdit}
          />
        )}
        {onDelete && (
          <Button
            label="삭제"
            size="sm"
            variant="main"
            className="w-1/3"
            onClick={onDelete}
          />
        )}
      </div>
    </div>
  );
};

VehicleCard.propTypes = {
  vehicleNumber: PropTypes.string.isRequired,
  deviceUid: PropTypes.string.isRequired,
  createdDate: PropTypes.instanceOf(Date).isRequired,
  onEdit: PropTypes.func,
  onDelete: PropTypes.func,
};

export default VehicleCard;
