// VehicleTable.jsx
import React, { useState, useEffect, useRef } from 'react';
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
import {
  handleRentVehicle,
  handleReturnVehicle,
} from '@/utils/vehicleHandlers';

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
  const [modalDeviceUid, setModalDeviceUid] = useState(null);
  const [modalVehicleNumber, setModalVehicleNumber] = useState(null);

  const [deviceUidMap, setDeviceUidMap] = useState({});
  const driverIndexMapRef = useRef({});

  useEffect(() => {
    setDeviceUidMap((prev) => {
      const updated = { ...prev };
      data.forEach((item) => {
        if (item.deviceUid) {
          updated[item.vehicleNumber] = item.deviceUid;
        }
      });
      return updated;
    });

    const result = data.filter((v) =>
      v.vehicleNumber.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredVehicles(result);
  }, [data, searchQuery]);

  const handleToggle = async (val, row) => {
    setSelectedRow(row);

    if (val) {
      await handleRentVehicle(row, setData, driverIndexMapRef);
    } else {
      await handleReturnVehicle(
        row,
        data,
        setData,
        setDrowsyModalData,
        setDrowsyModalOpen,
        1000,
        0,
        setModalDeviceUid,
        setModalVehicleNumber,
        driverIndexMapRef
      );
    }

    setSelectedRow(null);
  };

  const handleEditConfirm = async (newNumber) => {
    try {
      await updateVehicle(editRow.deviceUid, newNumber, token);
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
    { key: 'deviceUid', label: '카메라 ID' },
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
          onClick={() => {
            const uid = row.deviceUid || deviceUidMap[row.vehicleNumber];
            if (!uid) {
              alert('장치 정보가 없어 운전자 조회가 불가능합니다.');
              return;
            }
            setModalDeviceUid(uid);
            setModalVehicleNumber(row.vehicleNumber);
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
        onClick={() => setEditRow(row)}
      />
      <Button
        label="삭제"
        size="sm"
        variant="main"
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
      <div className="flex flex-wrap items-center justify-between gap-2 sm:gap-4">
        <h2 className="head2">등록된 차량 목록</h2>
        <div className="flex w-[300px] items-center gap-2">
          <InputField
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

      {driverListModalOpen && modalDeviceUid && modalVehicleNumber && (
        <DriverListModal
          isOpen={true}
          onClose={() => {
            setDriverListModalOpen(false);
            setSelectedRow(null);
          }}
          deviceUid={modalDeviceUid}
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
