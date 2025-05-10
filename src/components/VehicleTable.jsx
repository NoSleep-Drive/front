import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Switch } from '@/components/ui/switch';
import Button from './Button.jsx';
import { Search } from 'lucide-react';
import InputField from './InputField.jsx';
import BaseTable from './BaseTable.jsx';
import Pagination from './Pagination.jsx';
export default function VehicleTable({ data }) {
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 5;
  const [search, setSearch] = useState('');

  // 차량번호 기준 필터링
  const filtered = data.filter((v) =>
    v.vehicleNumber.toLowerCase().includes(search.toLowerCase())
  );

  const paginated = filtered.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );
  const columns = [
    { key: 'vehicleNumber', label: '차량 번호' },
    { key: 'deviceUid', label: '카메라 ID' },
    {
      key: 'createdDate',
      label: '등록일',
      render: (value) => new Date(value).toLocaleDateString(),
    },
    {
      key: 'rented',
      label: '대여 여부',
      render: (_, row) => (
        <Switch
          checked={row.isRented}
          onCheckedChange={(val) => console.log(val)}
          className="data-[state=checked]:bg-cornflower-500 bg-gray-300"
        />
      ),
    },
  ];
  const rowActions = (row) => (
    <div className="flex justify-center gap-2">
      <Button
        label="수정"
        size="sm"
        variant="white"
        className="w-16"
        onClick={() => console.log('수정', row)}
      />
      <Button
        label="삭제"
        size="sm"
        variant="main"
        className="w-16"
        onClick={() => console.log('삭제', row)}
      />
    </div>
  );

  return (
    <div className="space-y-6">
      {/* 상단 검색 */}
      <div className="flex flex-wrap items-center justify-between gap-2 sm:gap-4">
        <h2 className="head2">등록된 차량 목록</h2>

        <div className="ml-auto flex w-[300px] items-center gap-2">
          <div className="flex-1">
            <InputField
              placeholder="차량 번호 검색"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              size="sm"
            />
          </div>
          <Button
            label="검색"
            size="sm"
            variant="white"
            icon={<Search size={16} />}
            iconPosition="left"
            className="h-10"
            onClick={() => console.log('검색', search)}
          />
        </div>
      </div>

      <BaseTable columns={columns} data={paginated} rowActions={rowActions} />

      <Pagination
        currentPage={currentPage}
        totalPages={Math.ceil(filtered.length / rowsPerPage)}
        onPageChange={setCurrentPage}
      />


    </div>
  );
}
VehicleTable.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      vehicleNumber: PropTypes.string.isRequired,
      deviceUid: PropTypes.string.isRequired,
      createdDate: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.instanceOf(Date),
      ]).isRequired,
      isRented: PropTypes.bool.isRequired,
    })
  ).isRequired,
};
