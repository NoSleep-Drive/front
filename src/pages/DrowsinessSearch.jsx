import React, { useState, useEffect } from 'react';
import InputField from '../components/InputField';
import Button from '../components/Button';
import { Search } from 'lucide-react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { ko } from 'date-fns/locale';
import DrowsinessAccordionTable from '@/components/DrowsinessAccordionTable';
import Pagination from '@/components/Pagination';

export default function DrowsinessSearch() {
  const [selectedDriverIndex, setSelectedDriverIndex] = useState(null);
  const [driverIndexMap, setDriverIndexMap] = useState({});
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [vehicleNumber, setVehicleNumber] = useState('');
  const handleVehicleInputChange = (name, value) => {
    if (name === 'vehicleNumber') setVehicleNumber(value);
  };

  const [dateError, setDateError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 5;

  const mockData = [
    {
      vehicleNumber: '111가 1111',
      driver: 'abc123',
      detectDate: '2025-04-28',
      drowsinessDetails: [
        { timestamp: '2025-04-28 08:30:00', id: 1 },
        { timestamp: '2025-04-28 09:45:00', id: 2 },
      ],
    },
    {
      vehicleNumber: '222나 2222',
      driver: 'xyz456',
      detectDate: '2025-04-29',
      drowsinessDetails: [],
    },
    {
      vehicleNumber: '333다 3333',
      driver: 'qwe789',
      detectDate: '2025-04-30',
      drowsinessDetails: [{ timestamp: '2025-04-30 14:00:00', id: 3 }],
    },
  ];

  const [allData] = useState(mockData);
  const [filteredData, setFilteredData] = useState(mockData); // 초기값으로 mockData 전체

  useEffect(() => {
    const driverHashes = [...new Set(mockData.map((d) => d.driver))];
    const indexMap = {};
    driverHashes.forEach((hash, i) => {
      indexMap[hash] = i + 1;
    });
    setDriverIndexMap(indexMap);
  }, []);
  const handleSearch = () => {
    if (startDate && endDate && startDate > endDate) {
      setDateError('검색 시작일은 종료일보다 이전이어야 합니다.');
      return;
    }
    setDateError('');

    const result = allData.filter((item) => {
      const date = new Date(item.detectDate);
      const matchesDate =
        (!startDate || date >= startDate) && (!endDate || date <= endDate);
      const matchesVehicle =
        !vehicleNumber || item.vehicleNumber.includes(vehicleNumber);
      const driverIndex = driverIndexMap[item.driver];
      const matchesDriver =
        !selectedDriverIndex || driverIndex === selectedDriverIndex;

      return matchesDate && matchesVehicle && matchesDriver;
    });

    setFilteredData(result);
    setCurrentPage(1);
  };

  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentRows = filteredData.slice(indexOfFirstRow, indexOfLastRow);

  return (
    <div className="flex flex-col gap-10 px-4">
      <h1 className="head1">졸음 데이터 조회</h1>

      <div className="mx-auto flex w-full max-w-5xl flex-col gap-4">
        <div className="flex flex-col gap-4 md:flex-row">
          <div className="flex-[2]">
            <InputField
              label="차량 번호"
              placeholder="차량 번호를 입력하세요."
              value={vehicleNumber}
              name="vehicleNumber"
              onChange={handleVehicleInputChange}
              className="w-full"
            />
          </div>
          <div className="flex-[1]">
            <label htmlFor="driverIndex" className="caption-bold">
              운전자
            </label>
            <select
              id="driverIndex"
              name="driverIndex"
              value={selectedDriverIndex || ''}
              onChange={(e) =>
                setSelectedDriverIndex(Number(e.target.value) || null)
              }
              className="border-cornflower-400 text-cornflower-950 placeholder-cornflower-400 focus:border-cornflower-500 font-pretendard h-[53px] w-full rounded-xl border bg-white px-4 pr-10 text-[18px] font-normal transition focus:outline-none"
            >
              <option value="">전체</option>
              {Object.entries(driverIndexMap).map(([hash, index]) => (
                <option key={hash} value={index}>
                  운전자 {index}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col">
            <label htmlFor="startDate" className="caption-bold">
              검색 시작일
            </label>
            <DatePicker
              id="startDate"
              selected={startDate}
              locale={ko}
              dateFormat="yyyy년 MM월 dd일"
              onChange={(date) => setStartDate(date)}
              placeholderText="시작일 선택"
              className="font-pretendard text-cornflower-950 placeholder-cornflower-400 border-cornflower-400 focus:border-cornflower-500 focus:placeholder-cornflower-950 h-[53px] w-[180px] rounded-xl border bg-white px-4 text-[16px] font-normal transition focus:outline-none"
            />
          </div>
          <span className="mt-[29px] flex h-[53px] items-center justify-center text-xl">
            ~
          </span>
          <div className="flex flex-col">
            <label htmlFor="endDate" className="caption-bold">
              검색 종료일
            </label>
            <DatePicker
              id="endDate"
              selected={endDate}
              locale={ko}
              dateFormat="yyyy년 MM월 dd일"
              onChange={(date) => setEndDate(date)}
              placeholderText="종료일 선택"
              className="font-pretendard text-cornflower-950 placeholder-cornflower-400 border-cornflower-400 focus:border-cornflower-500 focus:placeholder-cornflower-950 h-[53px] w-[180px] rounded-xl border bg-white px-4 text-[16px] font-normal transition focus:outline-none"
            />
          </div>
          <div className="pt-6">
            <Button
              label="검색"
              size="md"
              variant="main"
              icon={<Search size={20} />}
              iconPosition="left"
              className="h-[53px] w-24"
              onClick={handleSearch}
            />
          </div>
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
