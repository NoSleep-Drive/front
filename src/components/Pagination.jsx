import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import PropTypes from 'prop-types';

export default function Pagination({ page, setPage, totalPages }) {
  if (totalPages === 0) return null;

  const handlePrev = () => setPage(Math.max(1, page - 1));
  const handleNext = () => setPage(Math.min(totalPages, page + 1));

  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible + 2) {
      // 전체 페이지가 작으면 생략점 없이 전부 표시
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      const half = Math.floor(maxVisible / 2);
      let start = Math.max(2, page - half);
      let end = Math.min(totalPages - 1, page + half);

      if (page <= 3) {
        start = 2;
        end = 2 + maxVisible - 1;
      } else if (page >= totalPages - 2) {
        start = totalPages - maxVisible + 1;
        end = totalPages - 1;
      }

      pages.push(1);
      if (start > 2) pages.push('prev-ellipsis');
      for (let i = start; i <= end; i++) {
        pages.push(i);
      }
      if (end < totalPages - 1) pages.push('next-ellipsis');
      pages.push(totalPages);
    }

    return pages;
  };

  return (
    <div className="mt-4 flex items-center justify-center gap-2">
      <button
        type="button"
        onClick={handlePrev}
        disabled={page === 1}
        className={`text-cornflower-950 hover:bg-cornflower-100 hover:text-cornflower-600 inline-flex items-center justify-center rounded-xl p-2 transition-colors ${page === 1 ? 'cursor-not-allowed opacity-50' : ''}`}
      >
        <ChevronLeft size={18} />
      </button>

      {getPageNumbers().map((p, index) => {
        if (p === 'prev-ellipsis' || p === 'next-ellipsis') {
          return (
            <span key={index} className="px-2 text-sm text-gray-400">
              ...
            </span>
          );
        }

        return (
          <button
            type="button"
            key={p}
            onClick={() => setPage(p)}
            className={`h-8 w-8 rounded-full text-sm ${
              p === page
                ? 'bg-cornflower-200 text-cornflower-950 font-semibold'
                : 'hover:bg-gray-100'
            }`}
          >
            {p}
          </button>
        );
      })}

      <button
        type="button"
        onClick={handleNext}
        disabled={page === totalPages}
        className={`text-cornflower-950 hover:bg-cornflower-100 hover:text-cornflower-600 inline-flex items-center justify-center rounded-xl p-2 transition-colors ${page === totalPages ? 'cursor-not-allowed opacity-50' : ''}`}
      >
        <ChevronRight size={18} />
      </button>
    </div>
  );
}

Pagination.propTypes = {
  page: PropTypes.number.isRequired,
  setPage: PropTypes.func.isRequired,
  totalPages: PropTypes.number.isRequired,
};
