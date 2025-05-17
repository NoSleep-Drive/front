import React, { useMemo, useState, useContext, useEffect } from 'react';
import InputField from '../components/InputField';
import Button from '../components/Button';
import { Search } from 'lucide-react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { ko } from 'date-fns/locale';
import DrowsinessAccordionTable from '@/components/DrowsinessAccordionTable';
import Pagination from '@/components/Pagination';
import { getSleepRecords } from '@/api/sleepApi';
import { DriverIndexMapContext } from '@/contexts/DriverIndexMapContext';

export default function DrowsinessSearch() {
  const driverIndexMapRef = useContext(DriverIndexMapContext);
  {
    /*const mockSleepData = [
    {
      uid: 101,
      vehicleNumber: '12가1234',
      deviceUid: 'rasp-0001', // 차량 연결
      detectedTime: '2025-05-16T14:33:00',
      driverHash: 'driver-aaa-111',
      videoPath: '/videos/sleep_101.mp4',
    },
    {
      uid: 102,
      vehicleNumber: '34나5678',
      deviceUid: 'rasp-0002',
      detectedTime: '2025-05-16T15:10:00',
      driverHash: 'driver-bbb-222',
      videoPath: '/videos/sleep_102.mp4',
    },
  ];*/
  }
  const [selectedDriverIndex, setSelectedDriverIndex] = useState(null);
  const [driverIndexMap, setDriverIndexMap] = useState({});
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [vehicleNumber, setVehicleNumber] = useState('');
  const [dateError, setDateError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 5;
  const [filteredData, setFilteredData] = useState([]);
  //const [filteredData, setFilteredData] = useState(mockSleepData);

  const handleVehicleInputChange = (name, value) => {
    if (name === 'vehicleNumber') setVehicleNumber(value);
  };

  const getDriverHashByIndex = (index, indexMap) => {
    if (index == null) return undefined;
    return Object.entries(indexMap).find(([, i]) => i === index)?.[0];
  };

  const handleSearch = async () => {
    if (startDate && endDate && startDate > endDate) {
      setDateError('검색 시작일은 종료일보다 앞선 날짜여야 합니다.');
      return;
    }
    setDateError('');

    try {
      const hash = getDriverHashByIndex(selectedDriverIndex, driverIndexMap);

      const adjusted = new Date(endDate);
      adjusted.setHours(23, 59, 59, 999);

      const data = await getSleepRecords({
        vehicleNumber: vehicleNumber || undefined,
        driverHash: hash || undefined,
        start_date: startDate?.toISOString().split('T')[0],
        end_date: adjusted,
        pageSize: 1000,
        pageIdx: 0,
      });

      data.sort((a, b) => new Date(b.detectedTime) - new Date(a.detectedTime));
      const hashSet = new Set(data.map((item) => item.driverHash));
      const newMap = {};
      Array.from(hashSet).forEach((hash, i) => {
        newMap[hash] = i + 1;
      });
      setDriverIndexMap(newMap);

      setDriverIndexMap(newMap);
      const grouped = {};
      data.forEach((item) => {
        const { id, vehicleNumber, deviceUid, detectedTime, driverHash } = item;

        if (!grouped[vehicleNumber]) {
          grouped[vehicleNumber] = {
            vehicleNumber,
            deviceUid,
            detectDate: detectedTime.split('T')[0],
            drowsinessDetails: [],
          };
        }

        grouped[vehicleNumber].drowsinessDetails.push({
          id,
          timestamp: detectedTime,
          driverHash,
        });
      });

      const groupedList = Object.values(grouped);
      setFilteredData(groupedList);
      setCurrentPage(1);
    } catch (error) {
      console.error('졸음 데이터 조회 실패:', error);
      alert('데이터 조회 중 오류가 발생했습니다.');
    }
  };
  useEffect(() => {
    (async () => {
      await handleSearch();
    })();
  }, []);

  const currentRows = useMemo(() => {
    const indexOfLastRow = currentPage * rowsPerPage;
    const indexOfFirstRow = indexOfLastRow - rowsPerPage;
    return filteredData.slice(indexOfFirstRow, indexOfLastRow);
  }, [filteredData, currentPage, rowsPerPage]);

  return (
    <div className="flex flex-col gap-10 px-4">
      <h1 className="head1">졸음 데이터 조회</h1>

      <div className="mx-auto flex w-full max-w-5xl flex-col gap-4">
        <div className="flex flex-col items-end gap-4 md:flex-row">
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
          <div className="w-[180px]">
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
              className="border-cornflower-400 text-cornflower-950 focus:border-cornflower-500 font-pretendard min-h-[53px] w-full rounded-xl border bg-white px-4 text-[18px] leading-[53px] font-normal transition focus:outline-none"
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

      <DrowsinessAccordionTable
        data={currentRows}
        driverIndexMapRef={driverIndexMapRef}
      />

      <Pagination
        page={currentPage}
        setPage={setCurrentPage}
        totalPages={Math.ceil(filteredData.length / rowsPerPage)}
      />
    </div>
  );
}
