import React from "react";
import "../assets/style/Pagination.css";

const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
  align = "center", // 👈 default
}) => {
  if (totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className={`pagination pagination-${align}`}>
      {/* Previous */}
      <button
        className="page-btn arrow"
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
      >
        &#8249;
      </button>

      {/* Page numbers */}
      {pages.map((page) => (
        <button
          key={page}
          className={`page-btn ${currentPage === page ? "active" : ""}`}
          onClick={() => onPageChange(page)}
        >
          {page}
        </button>
      ))}

      {/* Next */}
      <button
        className="page-btn arrow"
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(currentPage + 1)}
      >
        &#8250;
      </button>
    </div>
  );
};

export default Pagination;
