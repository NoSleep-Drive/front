import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import PropTypes from 'prop-types';
import Button from './Button';

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
      <Button
        onlyIcon
        icon={<ChevronLeft size={18} />}
        onClick={handlePrev}
        variant="white"
        size="sm"
        className={page === 1 ? 'cursor-not-allowed opacity-50' : ''}
      />
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
              p === page ? 'bg-cornflower-200 text-cornflower-950 font-semibold' : 'hover:bg-gray-100'
            }`}
          >
            {p}
          </button>
        );
      })}
      <Button
        onlyIcon
        icon={<ChevronRight size={18} />}
        onClick={handleNext}
        variant="white"
        size="sm"
        className={page === totalPages ? 'cursor-not-allowed opacity-50' : ''}
      />
    </div>
  );
}

Pagination.propTypes = {
  page: PropTypes.number.isRequired,
  setPage: PropTypes.func.isRequired,
  totalPages: PropTypes.number.isRequired,
};
