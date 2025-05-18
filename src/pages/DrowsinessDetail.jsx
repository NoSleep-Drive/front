import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Download, ChevronLeft } from 'lucide-react';
import Button from '../components/Button';
import { getDriverIndex } from '../utils/driverUtils';
import PropTypes from 'prop-types';
import { getSleepDetail, downloadSleepVideo } from '../api/sleepApi';
export default function DrowsinessDetail({ driverIndexMapRef }) {
  const { id } = useParams();
  const token = localStorage.getItem('auth_token');
  console.log('sleep id:', id);
  const navigate = useNavigate();
  const [sleepData, setSleepData] = useState(null);
  const [driverIndex, setDriverIndex] = useState(null);

  useEffect(() => {
    const fetchSleepData = async () => {
      if (!token) {
        alert('로그인이 필요합니다.');
        navigate('/');
        return;
      }
      try {
        const data = await getSleepDetail(id, token);
        setSleepData(data);

        const index = getDriverIndex(
          data.deviceUid,
          data.driverHash,
          driverIndexMapRef
        );
        setDriverIndex(index);
      } catch (error) {
        console.error('졸음 데이터 조회 실패:', error);
      }
    };

    fetchSleepData();
  }, [id, driverIndexMapRef, token]);

  const handleDownload = async () => {
    try {
      await downloadSleepVideo(token, id);
    } catch (error) {
      console.error('비디오 다운로드 실패:', error);
      alert(error);
    }
  };

  if (sleepData === null) {
    return <div>로딩 중...</div>;
  }
  const [date, time] = sleepData.detectedTime?.split('T') || [];

  return (
    <div>
      <div className="mb-4">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="text-cornflower-950 hover:bg-cornflower-100 hover:text-cornflower-600 mb-4 flex items-center gap-1 rounded-md px-3 py-2 font-bold transition-colors duration-150"
        >
          <ChevronLeft size={16} className="mr-2" />
          <span className="body-text">목록으로</span>
        </button>
      </div>

      <div className="mx-auto flex max-w-6xl flex-col items-center px-4">
        <h1 className="head1 mb-2">졸음 데이터 상세 조회</h1>
        <div className="mb-4 flex w-full max-w-4xl justify-between">
          <div className="flex flex-wrap items-center gap-4">
            <span>차량 번호: {sleepData.vehicleNumber}</span>
            <span>
              운전자:{' '}
              {driverIndex != null
                ? `운전자 ${driverIndex + 1}`
                : sleepData.driverHash}
            </span>
            <span>감지 날짜: {date}</span>
            <span>감지 시각: {time?.slice(0, 8)}</span>
          </div>
          <Button
            label="다운로드"
            size="sm"
            icon={<Download size={16} />}
            iconPosition="left"
            onClick={handleDownload}
          />
        </div>
        <div className="w-full max-w-4xl justify-center overflow-hidden rounded bg-black">
          <video controls className="w-full object-contain">
            <source
              src={`/api/sleep/${sleepData.id}/video/stream`}
              type="video/mp4"
            />
            지원되지 않는 브라우저입니다.
          </video>
        </div>
      </div>
    </div>
  );
}

DrowsinessDetail.propTypes = {
  driverIndexMapRef: PropTypes.shape({
    current: PropTypes.object.isRequired,
  }).isRequired,
};
