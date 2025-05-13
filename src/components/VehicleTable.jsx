import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Switch } from '@/components/ui/switch';
import Button from './Button.jsx';
import { Search } from 'lucide-react';
import InputField from './InputField.jsx';
import BaseTable from './BaseTable.jsx';
import Pagination from './Pagination.jsx';
import DrowsyStatsModal from './DrowsyStatsModal.jsx';
import VehicleEditModal from './VehicleEditModal.jsx';
import VehicleDeleteModal from './VehicleDeleteModal.jsx';
import DriverListModal from './DriverListModal.jsx';
import { rentVehicle, updateVehicle, deleteVehicle } from '@/api/vehicleApi';

export default function VehicleTable({ data, setData }) {
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 5;

  const [search, setSearch] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredVehicles, setFilteredVehicles] = useState([]);

  const [drowsyModalOpen, setDrowsyModalOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);

  const [editRow, setEditRow] = useState(null);
  const [deleteRow, setDeleteRow] = useState(null);

  const [driverListModalOpen, setDriverListModalOpen] = useState(false);

  useEffect(() => {
    const result = data.filter((v) =>
      v.vehicleNumber.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredVehicles(result);
  }, [data, searchQuery]);

  const handleToggle = async (val, row) => {
    console.log('토글 클릭됨:', val, row);
    setSelectedRow(row);
    if (!val) {
      setDrowsyModalOpen(true);
    } else {
      try {
        await rentVehicle(row.vehicleNumber, localStorage.getItem('token'));
        setData((prev) =>
          prev.map((item) =>
            item.vehicleNumber === row.vehicleNumber
              ? { ...item, isRented: true }
              : item
          )
        );
      } catch (error) {
        console.error('렌트 시작 실패:', error);
      }
      setSelectedRow(null);
    }
  };

  const handleToggleOffConfirm = () => {
    setData((prev) =>
      prev.map((item) =>
        item.vehicleNumber === selectedRow.vehicleNumber
          ? { ...item, isRented: false }
          : item
      )
    );
    setDrowsyModalOpen(false);
    setSelectedRow(null);
  };

  const handleEditConfirm = async (newNumber) => {
    try {
      await updateVehicle(
        editRow.deviceUid,
        newNumber,
        localStorage.getItem('token')
      );
      setData((prev) =>
        prev.map((item) =>
          item.vehicleNumber === editRow.vehicleNumber
            ? { ...item, vehicleNumber: newNumber }
            : item
        )
      );
    } catch (err) {
      console.error('차량 수정 실패:', err);
    }
    setEditRow(null);
  };

  const handleDeleteConfirm = async () => {
    try {
      await deleteVehicle(deleteRow.deviceUid, localStorage.getItem('token'));
      setData((prev) =>
        prev.filter((item) => item.vehicleNumber !== deleteRow.vehicleNumber)
      );
    } catch (err) {
      console.error('차량 삭제 실패:', err);
    }
    setDeleteRow(null);
  };

  const paginated = filteredVehicles.slice(
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
          onCheckedChange={(val) => handleToggle(val, row)}
        />
      ),
    },
    {
      key: 'drivers',
      label: '운전자',
      render: (_, row) => (
        <Button
          label="조회"
          size="sm"
          variant="white"
          className="w-16"
          onClick={() => {
            setSelectedRow(row);
            setDriverListModalOpen(true);
          }}
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
        onClick={() => setEditRow(row)}
      />
      <Button
        label="삭제"
        size="sm"
        variant="main"
        className="w-16"
        onClick={() => setDeleteRow(row)}
      />
    </div>
  );

  const handleChange = (name, value) => {
    if (name === 'search') setSearch(value);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-2 sm:gap-4">
        <h2 className="head2">등록된 차량 목록</h2>
        <div className="flex w-[300px] items-center gap-2">
          <InputField
            placeholder="차량 번호 검색"
            value={search}
            name="search"
            onChange={handleChange}
            size="sm"
          />
          <Button
            label="검색"
            size="sm"
            variant="white"
            icon={<Search size={16} />}
            iconPosition="left"
            className="h-10"
            onClick={() => setSearchQuery(search)}
          />
        </div>
      </div>

      <BaseTable columns={columns} data={paginated} rowActions={rowActions} />

      <Pagination
        page={currentPage}
        setPage={setCurrentPage}
        totalPages={Math.ceil(filteredVehicles.length / rowsPerPage)}
      />

      {drowsyModalOpen && (
        <DrowsyStatsModal
          isOpen={true}
          onClose={() => {
            setDrowsyModalOpen(false);
            setSelectedRow(null);
          }}
          onConfirm={handleToggleOffConfirm}
          data={{
            name: 'ㅁㅁㅁ',
            vehicleNumber: selectedRow?.vehicleNumber || '',
            dateRange: '2020-01-01 ~ 2020-02-02',
            totalCount: 5,
            peakTime: '14:00 ~ 16:00',
          }}
        />
      )}

      {editRow && (
        <VehicleEditModal
          isOpen={true}
          originalVehicle={editRow}
          onClose={() => setEditRow(null)}
          onConfirm={handleEditConfirm}
        />
      )}

      {deleteRow && (
        <VehicleDeleteModal
          isOpen={true}
          vehicleNumber={deleteRow.vehicleNumber}
          onClose={() => setDeleteRow(null)}
          onConfirm={handleDeleteConfirm}
        />
      )}

      {driverListModalOpen && selectedRow && (
        <DriverListModal
          isOpen={true}
          onClose={() => {
            setDriverListModalOpen(false);
            setSelectedRow(null);
          }}
          deviceUid={selectedRow.deviceUid}
        />
      )}
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
  setData: PropTypes.func.isRequired,
};
