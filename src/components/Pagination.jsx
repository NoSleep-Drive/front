import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import PropTypes from 'prop-types';

export default function Pagination({ page, setPage, totalPages }) {
  if (totalPages === 0) return null;

  const handlePrev = () => setPage(Math.max(1, page - 1));
  const handleNext = () => setPage(Math.min(totalPages, page + 1));

  const getPageNumbers = () => {
    if (totalPages <= 5) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    const range = 2;
    const start = Math.max(1, page - range);
    const end = Math.min(totalPages, page + range);

    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
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
