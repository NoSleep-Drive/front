import React from 'react';
import { Link } from 'react-router-dom';
import { Download, ChevronRight, Car, EyeClosed, VideoOff } from 'lucide-react';

import SummaryCard from '../components/SummaryCard';
import VehicleCard from '../components/VehicleCard';
import BaseTable from '../components/BaseTable';

//임시 졸음 데이터
const sleepData = [
  {
    uid: 1,
    vehicleNumber: '111가 1111',
    detectedTime: '2025-05-07T12:34:56',
    driverHash: 'abc123',
  },
  {
    uid: 2,
    vehicleNumber: '222가 1111',
    detectedTime: '2025-05-07T17:34:56',
    driverHash: 'abc333',
  },
  {
    uid: 3,
    vehicleNumber: '333가 1111',
    detectedTime: '2025-05-07T02:34:56',
    driverHash: 'abc777',
  },
  {
    uid: 1,
    vehicleNumber: '111가 1111',
    detectedTime: '2025-05-07T12:34:56',
    driverHash: 'abc123',
  },
  {
    uid: 2,
    vehicleNumber: '222가 1111',
    detectedTime: '2025-05-07T17:34:56',
    driverHash: 'abc333',
  },
  {
    uid: 3,
    vehicleNumber: '333가 1111',
    detectedTime: '2025-05-07T02:34:56',
    driverHash: 'abc777',
  },
  {
    uid: 1,
    vehicleNumber: '111가 1111',
    detectedTime: '2025-05-07T12:34:56',
    driverHash: 'abc123',
  },
  {
    uid: 2,
    vehicleNumber: '222가 1111',
    detectedTime: '2025-05-07T17:34:56',
    driverHash: 'abc333',
  },
  {
    uid: 3,
    vehicleNumber: '333가 1111',
    detectedTime: '2025-05-07T02:34:56',
    driverHash: 'abc777',
  },
];

const columns = [
  { key: 'vehicleNumber', label: '차량 번호' },
  { key: 'driverHash', label: '운전자' },
  {
    key: 'detectedTime',
    label: '감지 날짜',
    render: (value) => new Date(value).toLocaleDateString(),
  },
  {
    key: 'download',
    label: '다운로드',
    render: () => (
      <button
        type="button"
        className="text-cornflower-950 hover:bg-cornflower-100 hover:text-cornflower-600 inline-flex items-center justify-center rounded-xl p-2 transition-colors"
      >
        <Download size={18} />
      </button>
    ),
  },
];

export default function Dashboard() {
  return (
    <div className="flex flex-col gap-10 px-4">
      <section>
        {/* 대시보드 요약 */}
        <h2 className="head1 mb-4">대시보드 요약</h2>
        <div className="mx-auto grid w-full max-w-6xl grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
          <SummaryCard
            label="총 등록 차량 수"
            count={125}
            icon={<Car size={24} />}
          />{' '}
          {/*TODO: 총 차량수 api 연동*/}
          <SummaryCard
            label="오늘 졸음 감지 횟수"
            count={125}
            icon={<EyeClosed size={24} />}
          />{' '}
          {/*TODO: api 연동 - 졸음 감지 횟수*/}
          <SummaryCard
            label="이상 카메라 수"
            count={125}
            icon={<VideoOff size={24} />}
          />{' '}
          {/*TODO: api 연동 - 이상 카메라 수 */}
        </div>
      </section>

      <section>
        <div className="mb-6 flex items-center gap-2">
          <h2 className="head1">최근 졸음 데이터</h2>
          <Link
            to="/search"
            className="text-cornflower-950 hover:text-cornflower-500 transition"
            aria-label="최근 졸음 데이터 더보기"
          >
            <ChevronRight size={20} />
          </Link>
        </div>
        <div className="mx-auto w-full max-w-6xl overflow-x-auto rounded-xl">
          <BaseTable columns={columns} data={sleepData.slice(0, 7)} />
        </div>{' '}
        {/*  최근 졸음 데이터 테이블*/}
      </section>

      {/* 최근 등록된 차량 */}
      <section>
        <div className="mb-6 flex items-center gap-2">
          <h2 className="head1">최근 등록된 차량</h2>
          <Link
            to="/vehicles"
            className="text-cornflower-950 hover:text-cornflower-500 transition"
            aria-label="최근 등록된 차량 더보기"
          >
            <ChevronRight size={20} />
          </Link>
        </div>
        <div className="mx-auto grid w-full max-w-6xl grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
          {/* TODO: API 연동 - 최근 등록 차량 3대*/}
          <VehicleCard
            vehicleNumber={'99카 9999'}
            deviceUid={'XYZ789'}
            createdDate={new Date()}
          />
          <VehicleCard
            vehicleNumber={'99카 9999'}
            deviceUid={'XYZ789'}
            createdDate={new Date()}
          />
          <VehicleCard
            vehicleNumber={'99카 9999'}
            deviceUid={'XYZ789'}
            createdDate={new Date()}
          />
        </div>
      </section>
    </div>
  );
}
