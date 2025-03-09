import React from "react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  loading: boolean;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  loading,
}) => {
  const totalPagesWithFallback = totalPages > 0 ? totalPages : 1; 

  return (
    <div className="flex justify-between items-center py-4">
      <button
        className="px-4 py-2 border rounded disabled:opacity-50"
        disabled={loading || currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
      >
        Previous
      </button>
      <span>
        Page {currentPage} of {totalPagesWithFallback}
      </span>
      <button
        className="px-4 py-2 border rounded disabled:opacity-50"
        disabled={loading || currentPage === totalPagesWithFallback}
        onClick={() => onPageChange(currentPage + 1)}
      >
        Next
      </button>
    </div>
  );
};

export default Pagination;
