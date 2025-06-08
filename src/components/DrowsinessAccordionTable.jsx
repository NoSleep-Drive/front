import React, { useState } from 'react';
import { Download } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import BaseTable from './BaseTable';
import { downloadSleepVideosZip } from '@/api/sleepApi';

export default function DrowsinessAccordionTable({ data }) {
  const [expandedRow, setExpandedRow] = useState(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const navigate = useNavigate();

  const processedData = data;

  const toggleRow = (vehicleNumber) => {
    setExpandedRow((prev) => (prev === vehicleNumber ? null : vehicleNumber));
  };

  const handleBulkDownload = async (ids) => {
    if (isDownloading) return;
    try {
      setIsDownloading(true);
      await downloadSleepVideosZip(ids);
    } finally {
      setIsDownloading(false);
    }
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
            disabled={isDownloading}
            aria-busy={isDownloading}
          >
            {expandedRow === row.vehicleNumber ? '▾' : '▸'}
          </button>
          <span className="align-middle leading-normal">{value}</span>
        </div>
      ),
    },

    {
      key: 'driverIndex',
      label: '운전자',
      render: (value, row) => {
        const driverIndex = row.drowsinessDetails?.[0]?.driverIndex;
        return (
          <span>
            {driverIndex != null ? `운전자 ${driverIndex + 1}` : '운전자 -'}
          </span>
        );
      },
    },
    {
      key: 'drowsinessCount',
      label: '감지 횟수',
      render: (value, row) => {
        const count = row.drowsinessCount;
        return <span>{count != null ? `${count}회` : '-'}</span>;
      },
    },
    {
      key: 'download',
      label: '일괄 다운로드',
      render: (value, row) => {
        const ids = row.drowsinessDetails?.map((d) => d.idSleep) || [];
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

  return (
    <BaseTable
      columns={columns}
      data={processedData}
      expandableRow={(row) => {
        if (expandedRow !== row.vehicleNumber) return null;

        return (
          <tr className="bg-gray-100">
            <td colSpan={columns.length} className="px-8 py-3">
              {row.drowsinessDetails.length === 0 ? (
                <div className="caption text-center">
                  해당 데이터가 없습니다.
                </div>
              ) : (
                <div className="flex flex-col gap-2">
                  {row.drowsinessDetails.map((detail, idx) => {
                    const formattedTime =
                      typeof detail.detectedTime === 'string'
                        ? detail.detectedTime.replace('T', ' ').slice(0, 19)
                        : 'N/A';

                    return (
                      <div
                        key={idx}
                        className="flex w-fit items-start gap-6 rounded border border-gray-200 bg-white px-4 py-1.5 text-[15px]"
                      >
                        <span className="text-cornflower-950 max-w-[180px] min-w-[160px]">
                          {formattedTime}
                        </span>

                        <button
                          type="button"
                          onClick={() =>
                            navigate(`/drowsiness/${detail.idSleep}`)
                          }
                          className="text-cornflower-500 whitespace-nowrap hover:underline"
                        >
                          자세히 보기
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </td>
          </tr>
        );
      }}
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
      drowsinessCount: PropTypes.number,
      drowsinessDetails: PropTypes.arrayOf(
        PropTypes.shape({
          detectedTime: PropTypes.string.isRequired,
          idSleep: PropTypes.number.isRequired,
          driverHash: PropTypes.string.isRequired,
        })
      ),
    })
  ).isRequired,
};
