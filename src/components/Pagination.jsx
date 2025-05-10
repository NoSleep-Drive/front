
import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Button from './Button';
import PropTypes from 'prop-types';
export default function Pagination({ page, setPage, totalPages }) {
  const handlePrev = () => setPage(Math.max(1, page - 1));
  const handleNext = () => setPage(Math.min(totalPages, page + 1));

  return (
    <div className="mt-4 flex items-center justify-center gap-4">
      <Button
        onlyIcon
        icon={<ChevronLeft size={18} />}
        onClick={handlePrev}
        variant="white"
        size="sm"
        className={page === 1 ? 'cursor-not-allowed opacity-50' : ''}
      />
      <span className="text-sm font-medium">
        Page {page} of {totalPages}
      </span>
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
