import React from 'react';
import PropTypes from 'prop-types';

const BaseTable = ({ columns, data, rowActions, expandableRow }) => {
  return (
    <div className="mx-auto w-full max-w-6xl overflow-x-auto rounded-xl border border-gray-300 bg-white text-center">
      <table className="text-caption min-w-full">
        <thead className="text-cornflower-950 bg-cornflower-100 font-caption-bold text-xl">
          <tr>
            {columns.map((col) => (
              <th key={col.key} className="px-4 py-3">
                {col.label}
              </th>
            ))}
            {rowActions && <th className="px-4 py-3">차량 관리</th>}
          </tr>
        </thead>
        <tbody>
          {data.length === 0 ? (
            <tr>
              <td
                colSpan={columns.length + (rowActions ? 1 : 0)}
                className="px-4 py-4 text-center text-gray-400"
              >
                해당하는 데이터가 없습니다.
              </td>
            </tr>
          ) : (
            data.map((row, idx) => (
              <React.Fragment key={idx}>
                <tr className="border-t">
                  {columns.map((col) => (
                    <td key={col.key} className="px-4 py-3 text-center">
                      {col.render
                        ? (() => {
                            try {
                              return col.render(row[col.key], row);
                            } catch (e) {
                              console.error(
                                '🚨 render 실패:',
                                e,
                                '컬럼:',
                                col.key,
                                'row:',
                                row
                              );
                              return '오류';
                            }
                          })()
                        : row[col.key]}
                    </td>
                  ))}
                  {rowActions && (
                    <td className="px-4 py-3">{rowActions(row)}</td>
                  )}
                </tr>
                {expandableRow && expandableRow(row)}
              </React.Fragment>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

BaseTable.propTypes = {
  columns: PropTypes.arrayOf(
    PropTypes.shape({
      key: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
      render: PropTypes.func,
    })
  ).isRequired,
  data: PropTypes.array.isRequired,
  rowActions: PropTypes.func, // 수정/삭제 버튼
  expandableRow: PropTypes.func, // 아코디언 확장용
};

export default BaseTable;
