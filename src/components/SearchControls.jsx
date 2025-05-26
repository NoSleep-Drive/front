import { Search as SearchIcon } from 'lucide-react';
import DatePicker from 'react-datepicker';
import { ko } from 'date-fns/locale';
import PropTypes from 'prop-types';
import React from 'react';
import InputField from '@/components/InputField';
import Button from '@/components/Button';
export default function SearchControls({
  vehicleNumber,
  setVehicleNumber,
  selectedDriverIndex,
  setSelectedDriverIndex,
  startDate,
  setStartDate,
  endDate,
  setEndDate,
  onSearch,
  dateError,
  driverList,
}) {
  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-4">
      <div className="flex flex-col items-end gap-4 md:flex-row">
        <div className="flex-[2]">
          <InputField
            label="차량 번호"
            placeholder="차량 번호를 입력하세요."
            value={vehicleNumber}
            name="vehicleNumber"
            onChange={(name, value) => {
              if (name === 'vehicleNumber') setVehicleNumber(value);
            }}
          />
        </div>

        <div className="w-[180px]">
          <label htmlFor="driverIndex" className="caption-bold">
            운전자
          </label>
          <select
            id="driverIndex"
            name="driverIndex"
            value={selectedDriverIndex ?? ''}
            onChange={(e) =>
              setSelectedDriverIndex(Number(e.target.value) || null)
            }
            className="border-cornflower-400 text-cornflower-950 focus:border-cornflower-500 font-pretendard min-h-[53px] w-full rounded-xl border bg-white pr-10 pl-4 text-[18px] leading-[53px] font-normal transition focus:outline-none"
          >
            <option value="">전체</option>
            {driverList.map(({ driverHash, index, label }) => (
              <option key={driverHash} value={index}>
                {label}
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
            onChange={setStartDate}
            placeholderText="시작일 선택"
            className="font-pretendard text-cornflower-950 placeholder-cornflower-400 border-cornflower-400 focus:border-cornflower-500 h-[53px] w-[180px] rounded-xl border bg-white px-4 text-[16px] font-normal"
            isClearable
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
            onChange={setEndDate}
            placeholderText="종료일 선택"
            className="font-pretendard text-cornflower-950 placeholder-cornflower-400 border-cornflower-400 focus:border-cornflower-500 h-[53px] w-[180px] rounded-xl border bg-white px-4 text-[16px] font-normal"
            isClearable
          />
        </div>

        <div className="pt-6">
          <Button
            label="검색"
            size="md"
            variant="main"
            icon={<SearchIcon size={20} />}
            iconPosition="left"
            className="h-[53px] w-24"
            onClick={onSearch}
          />
        </div>
      </div>

      {dateError && (
        <p className="w-full pt-2 text-center text-sm text-red-500">
          {dateError}
        </p>
      )}
    </div>
  );
}
SearchControls.propTypes = {
  vehicleNumber: PropTypes.string.isRequired,
  setVehicleNumber: PropTypes.func.isRequired,
  selectedDriverIndex: PropTypes.number,
  setSelectedDriverIndex: PropTypes.func.isRequired,
  startDate: PropTypes.instanceOf(Date),
  setStartDate: PropTypes.func.isRequired,
  endDate: PropTypes.instanceOf(Date),
  setEndDate: PropTypes.func.isRequired,
  onSearch: PropTypes.func.isRequired,
  dateError: PropTypes.string,
  driverList: PropTypes.arrayOf(
    PropTypes.shape({
      driverHash: PropTypes.string.isRequired,
      index: PropTypes.number.isRequired,
      label: PropTypes.string.isRequired,
    })
  ).isRequired,
};
