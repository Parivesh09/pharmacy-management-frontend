const Pagination = ({ page, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null;
  return (
    <div className="flex gap-2 items-center justify-center my-4">
      <button
        disabled={page === 1}
        onClick={() => onPageChange(page - 1)}
        className="px-4 py-2 bg-(--primary-color) text-white rounded-lg hover:bg-(--primary-dark) disabled:bg-gray-300 disabled:cursor-not-allowed transition"
      >
        Prev
      </button>
      <span className="text-sm font-medium text-gray-700">
        Page {page} of {totalPages}
      </span>
      <button
        disabled={page === totalPages}
        onClick={() => onPageChange(page + 1)}
        className="px-4 py-2 bg-(--primary-color) text-white rounded-lg hover:bg-(--primary-dark) disabled:bg-gray-300 disabled:cursor-not-allowed transition"
      >
        Next
      </button>
    </div>
  );
};

export default Pagination; 