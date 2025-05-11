import React, { useState } from 'react';
import InputField from '../components/InputField';
import Button from '../components/Button';
import { Search } from 'lucide-react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { ko } from 'date-fns/locale';
import DrowsinessAccordionTable from '@/components/DrowsinessAccordionTable';
import Pagination from '@/components/Pagination';
import DrowsinessDetail from '@/pages/DrowsinessDetail';
<Route path="/drowsiness/:id" element={<DrowsinessDetail />} />;
import { Route } from 'react-router-dom';

export default function DrowsinessSearch() {
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [vehicleNumber, setVehicleNumber] = useState('');
  const handleChange = (name, value) => {
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

      return matchesDate && matchesVehicle;
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

      <div className="mx-auto flex w-full max-w-5xl flex-col items-start gap-4 md:flex-row">
        <div className="w-full max-w-xs">
          <InputField
            label="차량 번호"
            placeholder="차량 번호를 입력하세요."
            value={vehicleNumber}
            name="vehicleNumber"
            onChange={handleChange}
            className="w-full"
          />
        </div>

        <div className="flex w-full flex-col justify-end md:basis-1/2">
          <div className="flex w-full justify-end gap-2 md:flex-nowrap">
            <div className="flex w-full flex-col">
              <label className="caption-bold">검색 시작일</label>
              <DatePicker
                selected={startDate}
                locale={ko}
                dateFormat="yyyy년 MM월 dd일"
                onChange={(date) => setStartDate(date)}
                placeholderText="시작일 선택"
                className="font-pretendard text-cornflower-950 placeholder-cornflower-400 border-cornflower-400 focus:border-cornflower-500 focus:placeholder-cornflower-950 h-[53px] w-full rounded-xl border bg-white px-4 text-[16px] font-normal transition focus:outline-none"
              />
            </div>

            <span className="mt-[29px] flex h-[53px] items-center justify-center text-xl">
              ~
            </span>

            <div className="flex w-full flex-col">
              <label className="caption-bold">검색 종료일</label>
              <DatePicker
                selected={endDate}
                locale={ko}
                dateFormat="yyyy년 MM월 dd일"
                onChange={(date) => setEndDate(date)}
                placeholderText="종료일 선택"
                className="font-pretendard text-cornflower-950 placeholder-cornflower-400 border-cornflower-400 focus:border-cornflower-500 focus:placeholder-cornflower-950 h-[53px] w-full rounded-xl border bg-white px-4 text-[16px] font-normal transition focus:outline-none"
              />
            </div>
          </div>
          {dateError && (
            <p className="w-full pt-2 text-center text-sm text-red-500">
              {dateError}
            </p>
          )}
        </div>

        <div className="pt-0 md:pt-7">
          <Button
            label="검색"
            size="md"
            variant="main"
            icon={<Search size={20} />}
            iconPosition="left"
            className="h-[53px]"
            onClick={handleSearch}
          />
        </div>
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
