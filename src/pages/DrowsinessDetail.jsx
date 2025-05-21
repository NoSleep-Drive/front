import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Download, ChevronLeft } from 'lucide-react';
import Button from '../components/Button';
import { getDriverIndexByVehicle } from '../utils/driverUtils';
import {
  getSleepDetail,
  downloadSleepVideo,
  getSleepVideoStreamUrl,
} from '../api/sleepApi';
import useDriverIndexMap from '@/hooks/useDriverIndexMap';
import SleepdataInfo from '@/components/SleepdataInfo';
export default function DrowsinessDetail() {
  const { deviceUidMapRef, driverIndexMapRef } = useDriverIndexMap();

  const { id } = useParams();
  const navigate = useNavigate();
  const [sleepData, setSleepData] = useState(null);
  const [driverIndex, setDriverIndex] = useState(null);
  const [videoUrl, setVideoUrl] = useState(null);

  useEffect(() => {
    const fetchSleepData = async () => {
      const token = localStorage.getItem('auth_token');
      if (!token) {
        alert('로그인이 필요합니다.');
        navigate('/');
        return;
      }
      try {
        const data = await getSleepDetail(id, token);
        setSleepData(data);
        const index = getDriverIndexByVehicle(
          data.vehicleNumber,
          data.driverHash,
          deviceUidMapRef,
          driverIndexMapRef
        );
        console.log('[DEBUG] driverIndex 상태값:', driverIndex);
        console.log('[DEBUG] driverIndex 상태값:', data.vehicleNumber);

        setDriverIndex(index);
        const url = await getSleepVideoStreamUrl(id, token);
        if (url) setVideoUrl(url);
      } catch (error) {
        console.error('졸음 데이터 조회 실패:', error);
      }
    };

    fetchSleepData();

    return () => {
      if (videoUrl) URL.revokeObjectURL(videoUrl);
    };
  }, [id, driverIndexMapRef, navigate]);

  const handleDownload = async () => {
    const token = localStorage.getItem('auth_token');

    try {
      await downloadSleepVideo(id, token);
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
            <SleepdataInfo
              vehicleNumber={sleepData.vehicleNumber}
              driverIndex={driverIndex}
              driverHash={sleepData.driverHash}
              date={date}
              time={time}
            />
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
            {videoUrl ? (
              <source src={videoUrl} type="video/mp4" />
            ) : (
              <>영상을 불러오는 중...</>
            )}
          </video>
        </div>
      </div>
    </div>
  );
}
