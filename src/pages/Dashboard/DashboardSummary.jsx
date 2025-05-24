import React from 'react';
import { Car, EyeClosed, VideoOff } from 'lucide-react';
import PropTypes from 'prop-types';
import SummaryCard from '@/components/SummaryCard';
export default function DashboardSummary({ data }) {
  return (
    <section>
      <h2 className="head1 mb-4">대시보드 요약</h2>
      <div className="mx-auto grid w-full max-w-6xl grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
        <SummaryCard
          label="총 등록 차량 수"
          count={data.totalVehicles}
          icon={<Car size={24} />}
        />
        <SummaryCard
          label="오늘 졸음 감지 횟수"
          count={data.sleepDetectedToday}
          icon={<EyeClosed size={24} />}
        />
        <SummaryCard
          label="이상 기기 수"
          count={data.abnormalVehicles}
          icon={<VideoOff size={24} />}
        />
      </div>
    </section>
  );
}
DashboardSummary.propTypes = {
  data: PropTypes.shape({
    totalVehicles: PropTypes.number.isRequired,
    sleepDetectedToday: PropTypes.number.isRequired,
    abnormalVehicles: PropTypes.number.isRequired,
  }).isRequired,
};
