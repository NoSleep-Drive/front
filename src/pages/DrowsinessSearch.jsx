import React, { useState, useEffect } from 'react';
import 'react-datepicker/dist/react-datepicker.css';
import DrowsinessAccordionTable from '@/components/DrowsinessAccordionTable';
import Pagination from '@/components/Pagination';
import { getSleepRecords } from '@/api/sleepApi';
import useDriverIndexMap from '@/hooks/useDriverIndexMap';
import {
  getDeviceUidByVehicle,
  groupAndIndexSleepData,
  getDriverListByVehicleNumber,
  getDriverHashByIndex,
} from '@/utils/driverUtils';
import SearchControls from '@/components/SearchControls';

export default function DrowsinessSearch() {
  useEffect(() => {
    handleSearch();
  }, []);

  const token = localStorage.getItem('auth_token');
  const { driverIndexMapRef, deviceUidMapRef } = useDriverIndexMap();

  const [selectedDriverIndex, setSelectedDriverIndex] = useState(null);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [dateError, setDateError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 5;
  const [filteredData, setFilteredData] = useState([]);
  const [driverList, setDriverList] = useState([]);

  const [vehicleNumber, setVehicleNumber] = useState('');

  const handleSearch = async () => {
    console.log(
      '🔎 Search 진입 시점 deviceUidMapRef:',
      deviceUidMapRef.current
    );
    console.log(
      '🔎 Search 진입 시점 driverIndexMapRef:',
      driverIndexMapRef.current
    );
    if (startDate && endDate && startDate > endDate) {
      setDateError('검색 시작일은 종료일보다 앞선 날짜여야 합니다.');
      return;
    }
    setDateError('');

    try {
      const deviceUid = getDeviceUidByVehicle(
        vehicleNumber,
        deviceUidMapRef.current
      );
      let hash = null;
      if (
        selectedDriverIndex !== null &&
        deviceUid &&
        driverIndexMapRef.current?.[deviceUid]
      ) {
        hash = getDriverHashByIndex(
          deviceUid,
          selectedDriverIndex,
          driverIndexMapRef
        );
      }
      const adjusted =
        endDate != null
          ? new Date(new Date(endDate).setDate(new Date(endDate).getDate() + 1))
              .toISOString()
              .split('T')[0]
          : undefined;

      const data = await getSleepRecords({
        token,
        vehicleNumber: vehicleNumber || undefined,
        driverHash: hash || undefined,
        startDate: startDate?.toISOString().split('T')[0],
        endDate: adjusted,
        pageSize: 20,
        pageIdx: 0,
      });
      if (data.length > 0) {
        const list = getDriverListByVehicleNumber(
          vehicleNumber,
          deviceUidMapRef,
          driverIndexMapRef
        );
        setDriverList(list);
      }

      const groupedList = groupAndIndexSleepData(
        data,
        deviceUidMapRef,
        driverIndexMapRef
      );
      setFilteredData(groupedList);
      setCurrentPage(1);
    } catch (error) {
      console.error('졸음 데이터 조회 실패:', error);
      alert('데이터 조회 중 오류가 발생했습니다.');
    }
  };

  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentRows = filteredData.slice(indexOfFirstRow, indexOfLastRow);

  return (
    <div className="flex flex-col gap-10 px-4">
      <h1 className="head1">졸음 데이터 조회</h1>

      <div className="mx-auto flex w-full max-w-5xl flex-col gap-4">
        <div className="flex flex-col items-end gap-4 md:flex-row">
          <SearchControls
            vehicleNumber={vehicleNumber}
            setVehicleNumber={setVehicleNumber}
            selectedDriverIndex={selectedDriverIndex}
            setSelectedDriverIndex={setSelectedDriverIndex}
            startDate={startDate}
            setStartDate={setStartDate}
            endDate={endDate}
            setEndDate={setEndDate}
            onSearch={handleSearch}
            dateError={dateError}
            driverList={driverList}
          />
        </div>

        {dateError && (
          <p className="w-full pt-2 text-center text-sm text-red-500">
            {dateError}
          </p>
        )}
      </div>

      <DrowsinessAccordionTable data={currentRows} />

      <Pagination
        page={currentPage}
        setPage={setCurrentPage}
        totalPages={Math.ceil(filteredData.length / rowsPerPage)}
      />
    </div>
  );
}
