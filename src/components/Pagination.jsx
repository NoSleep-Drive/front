import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import PropTypes from 'prop-types';

export default function Pagination({ page, setPage, totalPages }) {
  const handlePrev = () => setPage(Math.max(1, page - 1));
  const handleNext = () => setPage(Math.min(totalPages, page + 1));

  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;
    let startPage = Math.max(1, page - 2);
    let endPage = Math.min(totalPages, startPage + maxVisible - 1);

    if (endPage - startPage < maxVisible - 1) {
      startPage = Math.max(1, endPage - maxVisible + 1);
    }

    if (startPage > 1) pages.push('prev-ellipsis');
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    if (endPage < totalPages) pages.push('next-ellipsis');

    return pages;
  };

  return (
    <div className="mt-4 flex items-center justify-center gap-2">
      <button
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
