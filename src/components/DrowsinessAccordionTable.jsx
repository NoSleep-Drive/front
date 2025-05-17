import React, { useState } from 'react';
import BaseTable from './BaseTable';
import { Download } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import axios from 'axios';
import { getDriverIndexMap } from '../utils/driverUtils.js';

const preprocessDataWithDriverIndex = (originalData, driverIndexMapRef) => {
  return originalData.map((row) => {
    const deviceUid = row.deviceUid;
    const indexMap = getDriverIndexMap(deviceUid, driverIndexMapRef);

    return {
      ...row,
      drowsinessDetails: row.drowsinessDetails.map((detail) => ({
        ...detail,
        driverIndex: indexMap[detail.driverHash] || null,
      })),
    };
  });
};
export default function DrowsinessAccordionTable({ data, driverIndexMapRef }) {
  const [expandedRow, setExpandedRow] = useState(null);
  const navigate = useNavigate();
  const [isDownloading, setIsDownloading] = useState(false);
  const toggleRow = (vehicleNumber) => {
    setExpandedRow((prev) => (prev === vehicleNumber ? null : vehicleNumber));
  };

  const columns = [
    {
      key: 'vehicleNumber',
      label: '차량 번호',
      render: (value, row) => (
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => toggleRow(row.vehicleNumber)}
            className="hover:bg-cornflower-100 text-cornflower-950 rounded-md p-2 text-2xl transition-colors hover:text-blue-600"
          >
            {expandedRow === row.vehicleNumber ? '▾' : '▸'}
          </button>
          <span className="align-middle leading-normal">{value}</span>
        </div>
      ),
    },
    { key: 'detectDate', label: '감지 날짜' },
    {
      key: 'download',
      label: '일괄 다운로드',
      render: (value, row) => {
        const ids = row.drowsinessDetails?.map((d) => d.id) || [];
        return (
          <button
            type="button"
            onClick={() => handleBulkDownload(ids)}
            className={`text-cornflower-950 hover:bg-cornflower-100 hover:text-cornflower-600 inline-flex items-center justify-center rounded-xl p-2 transition-colors ${
              isDownloading ? 'cursor-not-allowed opacity-50' : ''
            }`}
          >
            <Download size={18} />
          </button>
        );
      },
    },
  ];

  const handleBulkDownload = async (ids) => {
    if (!ids || ids.length === 0) {
      alert('다운로드할 영상이 없습니다.');
      return;
    }

    try {
      setIsDownloading(true);
      const response = await axios.post(
        '/api/sleep/videos/download',
        { ids },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('auth_token')}`,
          },
          responseType: 'blob',
        }
      );

      const blob = response.data;
      const contentDisposition = response.headers['content-disposition'];
      const filenameMatch = contentDisposition?.match(/filename="(.+)"/);
      const filename = filenameMatch ? filenameMatch[1] : 'videos.zip';

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
          alert('일부 영상이 존재하지 않아 다운로드할 수 없습니다.');
        } else {
          alert('일괄 다운로드 중 오류가 발생했습니다.');
        }
      } else {
        alert('알 수 없는 오류가 발생했습니다.');
      }
    } finally {
      setIsDownloading(false);
    }
  };
  const processedData = preprocessDataWithDriverIndex(data, driverIndexMapRef);
  return (
    <BaseTable
      columns={columns}
      data={processedData}
      expandableRow={(row) =>
        expandedRow === row.vehicleNumber ? (
          <tr className="bg-gray-100">
            <td colSpan={columns.length} className="px-8 py-3">
              {row.drowsinessDetails.length === 0 ? (
                <div className="caption text-center">
                  해당 데이터가 없습니다.
                </div>
              ) : (
                <div className="flex flex-col gap-2">
                  {row.drowsinessDetails.map((detail, idx) => (
                    <div
                      key={idx}
                      className="flex w-fit items-start gap-6 rounded border border-gray-200 bg-white px-4 py-1.5 text-[15px]"
                    >
                      <span className="text-cornflower-950 max-w-[180px] min-w-[160px]">
                        {detail.timestamp}
                      </span>
                      <span>운전자 {detail.driverIndex}</span>

                      <button
                        type="button"
                        onClick={() => navigate(`/drowsiness/${detail.id}`)}
                        className="text-cornflower-500 whitespace-nowrap hover:underline"
                      >
                        자세히 보기
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </td>
          </tr>
        ) : null
      }
    />
  );
}

DrowsinessAccordionTable.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      vehicleNumber: PropTypes.string.isRequired,
      driver: PropTypes.string,
      detectDate: PropTypes.string.isRequired,
      deviceUid: PropTypes.string.isRequired,
      drowsinessDetails: PropTypes.arrayOf(
        PropTypes.shape({
          timestamp: PropTypes.string.isRequired,
          id: PropTypes.number.isRequired,
          driverHash: PropTypes.string.isRequired,
        })
      ),
    })
  ).isRequired,
  driverIndexMapRef: PropTypes.shape({
    current: PropTypes.object.isRequired,
  }).isRequired,
};
