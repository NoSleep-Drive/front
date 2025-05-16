import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { Download, ChevronLeft } from 'lucide-react';
import Button from '../components/Button';
import { getDriverIndex } from '../utils/driverUtils';
import PropTypes from 'prop-types';

export default function DrowsinessDetail({ driverIndexMapRef }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [sleepData, setSleepData] = useState(null);
  const [driverIndex, setDriverIndex] = useState(null);
  useEffect(() => {
    const fetchSleepData = async () => {
      try {
        const res = await axios.get(`/api/sleep/${id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('auth_token')}`,
          },
        });
        const data = res.data.data;
        setSleepData(data);

        const index = getDriverIndex(
          data.deviceUid, // 이게 sleepData에 있어야 함
          data.driverHash,
          driverIndexMapRef
        );
        setDriverIndex(index);
      } catch (error) {
        console.error('졸음 데이터 조회 실패:', error);
      }
    };

    fetchSleepData();
  }, [id, driverIndexMapRef]);

  const handleDownload = async () => {
    try {
      const response = await axios.get(`/api/sleep/${id}/video/download`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('auth_token')}`,
        },
        responseType: 'blob',
      });

      const blob = new Blob([response.data], {
        type: 'application/octet-stream',
      });
      const contentDisposition = response.headers['content-disposition'];
      const filenameMatch = contentDisposition?.match(/filename="(.+)"/);
      const filename = filenameMatch ? filenameMatch[1] : 'sleep_video.mp4';

      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(link.href);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const status = error.response?.status;
        if (status === 401) {
          alert('인증 정보가 유효하지 않습니다.');
        } else if (status === 404) {
          alert('해당 영상이 존재하지 않습니다.');
        } else {
          alert('다운로드 중 오류가 발생했습니다.');
        }
      } else {
        alert('알 수 없는 오류가 발생했습니다.');
      }
    }
  };

  if (sleepData === null) return <div>로딩 중...</div>;

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
            <span>차량 번호: {sleepData.carNumber}</span>
            <span>
              운전자:{' '}
              {driverIndex ? `운전자 ${driverIndex}` : sleepData.driverHash}
            </span>
            <span>감지 날짜: {sleepData.date}</span>
            <span>감지 시각: {sleepData.time}</span>
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
