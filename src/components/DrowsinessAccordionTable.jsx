import React, { useState } from 'react';
import BaseTable from './BaseTable';
import { Download } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
export default function DrowsinessAccordionTable({ data }) {
  const [expandedRow, setExpandedRow] = useState(null);
  const navigate = useNavigate();

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
            onClick={() => toggleRow(row.vehicleNumber)}
            className=" text-2xl hover:bg-cornflower-100 text-cornflower-950 rounded-md p-2 transition-colors hover:text-blue-600"
          >
            {expandedRow === row.vehicleNumber ? '▾' : '▸'}
          </button>
          <span className="align-middle leading-normal">{value}</span>
        </div>
      ),
    },
    { key: 'driver', label: '운전자' },
    { key: 'detectDate', label: '감지 날짜' },
    {
      key: 'download',
      label: '일괄 다운로드',
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

  return (
    <BaseTable
      columns={columns}
      data={data}
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
                      <button
                        onClick={() =>
                          navigate(`/drowsiness/detail/${detail.id}`)
                        }
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
      driver: PropTypes.string.isRequired,
      detectDate: PropTypes.string.isRequired,
      drowsinessDetails: PropTypes.arrayOf(
        PropTypes.shape({
          timestamp: PropTypes.string.isRequired,
          id: PropTypes.number.isRequired,
        })
      ),
    })
  ).isRequired,
};
