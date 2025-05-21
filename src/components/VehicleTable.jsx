// VehicleTable.jsx
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
import { updateVehicle, deleteVehicle } from '@/api/vehicleApi';
import { fetchDriversByDeviceUid } from '@/api/driverApi';
import useDriverIndexMap from '@/hooks/useDriverIndexMap.js';
import {
  handleRentVehicle,
  handleReturnVehicle,
} from '@/utils/vehicleHandlers';

import { setDriverIndex } from '@/utils/driverUtils';
import { saveDriverMapsToStorage } from '@/utils/storageUtils.js';
export default function VehicleTable({ data, setData }) {
  const token = localStorage.getItem('auth_token');

  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 5;

  const [search, setSearch] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredVehicles, setFilteredVehicles] = useState([]);

  const [drowsyModalOpen, setDrowsyModalOpen] = useState(false);
  const [drowsyModalData, setDrowsyModalData] = useState(null);

  const [selectedRow, setSelectedRow] = useState(null);
  const [editRow, setEditRow] = useState(null);
  const [deleteRow, setDeleteRow] = useState(null);
  const [driverListModalOpen, setDriverListModalOpen] = useState(false);
  const { driverIndexMapRef, deviceUidMapRef } = useDriverIndexMap();

  useEffect(() => {
    const result = data.filter((v) =>
      v.vehicleNumber.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredVehicles(result);
  }, [data, searchQuery]);

  const handleOpenDriverList = async (row) => {
    const { deviceUid, vehicleNumber } = row;

    try {
      const driverList = await fetchDriversByDeviceUid(deviceUid, 20, 0);

      if (driverList?.length) {
        setDriverIndex(deviceUid, vehicleNumber, driverList, driverIndexMapRef);
      }

      setSelectedRow(row);
      setDriverListModalOpen(true);
    } catch (error) {
      alert('운전자 목록을 불러올 수 없습니다.');
      console.error(error);
    }
  };

  const handleToggle = async (val, row) => {
    setSelectedRow(row);
    const { deviceUid, vehicleNumber } = row;

    if (val) {
      const driverList = await handleRentVehicle(row, setData);
      if (driverList?.length) {
        setDriverIndex(deviceUid, vehicleNumber, driverList, driverIndexMapRef);
        saveDriverMapsToStorage(driverIndexMapRef, deviceUidMapRef);
        console.log(driverList);
      }
      setData((prev) =>
        prev.map((item) =>
          item.vehicleNumber === vehicleNumber
            ? { ...item, isRented: true }
            : item
        )
      );
    } else {
      await handleReturnVehicle(
        row,
        setData,
        setDrowsyModalData,
        setDrowsyModalOpen,
        20,
        0,
        driverIndexMapRef
      );
      setData((prev) =>
        prev.map((item) =>
          item.vehicleNumber === vehicleNumber
            ? {
                ...item,
                deviceUid: item.deviceUid || deviceUid,
              }
            : item
        )
      );
    }

    setSelectedRow(null);
  };

  const handleEditConfirm = async (newNumber) => {
    try {
      const oldNumber = editRow.vehicleNumber;
      const uid = deviceUidMapRef.current[oldNumber];
      await updateVehicle(editRow.deviceUid, newNumber, token);
      if (uid && newNumber) {
        deviceUidMapRef.current[newNumber] = uid;
        if (oldNumber !== newNumber) {
          delete deviceUidMapRef.current[oldNumber];
          driverIndexMapRef.current[uid].vehicleNumber = newNumber;
        }
        saveDriverMapsToStorage(driverIndexMapRef, deviceUidMapRef);
      }

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
      await deleteVehicle(deleteRow.deviceUid, token);
      setData((prev) =>
        prev.filter((item) => item.vehicleNumber !== deleteRow.vehicleNumber)
      );
    } catch (err) {
      console.error('차량 삭제 실패:', err);
    }
    setDeleteRow(null);
  };

  const columns = [
    { key: 'vehicleNumber', label: '차량 번호' },
    { key: 'deviceUid', label: '기기 ID' },
    {
      key: 'createdDate',
      label: '등록일',
      render: (val) => new Date(val).toLocaleDateString(),
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
          onClick={() => handleOpenDriverList(row)}
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
        disabled={row.isRented}
        onClick={() => setEditRow(row)}
      />
      <Button
        label="삭제"
        size="sm"
        variant="main"
        disabled={row.isRented}
        onClick={() => setDeleteRow(row)}
      />
    </div>
  );

  const paginated = filteredVehicles.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  return (
    <div className="space-y-6">
      <h2 className="head2 items-center">등록된 차량 목록</h2>
      <div className="mx-auto flex max-w-6xl justify-end gap-2">
        <div className="flex w-[300px] items-center gap-2">
          <InputField
            className="!w-48"
            placeholder="차량 번호 검색"
            value={search}
            name="search"
            onChange={(name, value) => setSearch(value)}
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
          data={drowsyModalData}
          onClose={() => {
            setDrowsyModalOpen(false);
            setSelectedRow(null);
          }}
          onConfirm={() => {}}
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
          vehicle={selectedRow}
        />
      )}
    </div>
  );
}

VehicleTable.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      vehicleNumber: PropTypes.string.isRequired,
      deviceUid: PropTypes.string,
      createdDate: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.instanceOf(Date),
      ]).isRequired,
      isRented: PropTypes.bool.isRequired,
    })
  ).isRequired,
  setData: PropTypes.func.isRequired,
};
