import { useRef, useEffect, useState, useMemo } from "react";
import { Edit, Trash2, Eye, Plus, Package, ChevronLeft, ChevronRight, ChevronFirst, ChevronLast, List } from "lucide-react";
import Button from "./Button";
import IconButton from "./IconButton";
import Loader from "./Loader";
import Tooltip from "./Tooltip";

// Helper function to access nested properties
const getNestedValue = (obj, path) => {
  return path.split('.').reduce((current, prop) => current?.[prop], obj) ?? "-";
};

const DEFAULT_PAGE_SIZES = [10, 25, 50, 100];

const DataTable = ({
  title,
  columns = [],
  data = [],
  onEdit,
  onDelete,
  onView,
  handleAddItem,
  selectedRow,
  onRowSelect,
  fullHeight = false,
  onLoadMore,
  hasMore = false,
  loading = false,
  enableInfiniteScroll = true,
  // Pagination props
  page = 1,
  pageSize = 10,
  totalItems = 0,
  onPageChange,
  onPageSizeChange,
  enablePagination = true,
  enablePageSizeSelector = true,
  // Sorting props
  enableSorting = true,
  // Row numbers
  enableRowNumbers = true,
  // Responsive props
  responsive = true,
  cardViewBreakpoint = 768,
}) => {
  const rowRefs = useRef([]);
  const tableContainerRef = useRef(null);
  const loadMoreRef = useRef(null);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const prevDataLengthRef = useRef(0);
  const [isCardView, setIsCardView] = useState(false);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });

  // Sort handler
  const handleSort = (key) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === "asc" ? "desc" : "asc",
    }));
  };

  // Get sorted data
  const sortedData = useMemo(() => {
    if (!sortConfig.key) return data;
    return [...data].sort((a, b) => {
      const aVal = getNestedValue(a, sortConfig.key);
      const bVal = getNestedValue(b, sortConfig.key);
      if (aVal === bVal) return 0;
      const direction = sortConfig.direction === "asc" ? 1 : -1;
      if (typeof aVal === "number" && typeof bVal === "number") {
        return (aVal - bVal) * direction;
      }
      return String(aVal).localeCompare(String(bVal)) * direction;
    });
  }, [data, sortConfig]);

  // Paginated data
  const paginatedData = useMemo(() => {
    if (!enablePagination) return sortedData;
    const start = (page - 1) * pageSize;
    return sortedData.slice(start, start + pageSize);
  }, [sortedData, page, pageSize, enablePagination]);

  // Total pages
  const totalPages = Math.ceil(totalItems / pageSize) || 1;

  // Card view detection
  useEffect(() => {
    const checkCardView = () => {
      setIsCardView(window.innerWidth < cardViewBreakpoint && responsive);
    };
    checkCardView();
    window.addEventListener("resize", checkCardView);
    return () => window.removeEventListener("resize", checkCardView);
  }, [responsive, cardViewBreakpoint]);

  useEffect(() => {
    if (selectedRow && rowRefs.current) {
      const idx = data.findIndex((row) => row.id === selectedRow.id);
      if (idx !== -1 && rowRefs.current[idx]) {
        rowRefs.current[idx].scrollIntoView({
          block: "nearest",
          behavior: "smooth",
        });
      }
    }
  }, [selectedRow, data]);

  useEffect(() => {
    if (!enableInfiniteScroll || !onLoadMore || !hasMore || !loadMoreRef.current) return;

    const container = tableContainerRef.current;
    if (!container) return;

    let timeoutId;
    const observer = new IntersectionObserver(
      (entries) => {
        const target = entries[0];
        if (target.isIntersecting && !isLoadingMore && data.length > 0) {
          clearTimeout(timeoutId);
          timeoutId = setTimeout(() => {
            setIsLoadingMore(true);
            onLoadMore();
          }, 100);
        }
      },
      {
        root: container,
        rootMargin: "200px",
        threshold: 0,
      }
    );

    observer.observe(loadMoreRef.current);

    return () => {
      observer.disconnect();
      clearTimeout(timeoutId);
    };
  }, [enableInfiniteScroll, onLoadMore, hasMore, isLoadingMore, data.length]);

  useEffect(() => {
    if (data.length > prevDataLengthRef.current) {
      setIsLoadingMore(false);
    }
    prevDataLengthRef.current = data.length;
  }, [data.length]);

  if (!Array.isArray(data) || data.length === 0) {
    return (
      <div className="text-center py-20 bg-(--card-bg) rounded-3xl shadow-2xl border border-gray-100 dark:border-white/5 flex flex-col items-center animate-fade-in">
        <div className="w-20 h-20 bg-(--sidebar-active-bg)/30 rounded-full flex items-center justify-center mb-6">
          <Package className="w-10 h-10 text-gray-300" />
        </div>
        <div className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-6 px-1 italic">No operational records identified.</div>
        {handleAddItem && (
          <Button
            key="add"
            onClick={handleAddItem}
            className="rounded-[1rem] px-8 py-3 shadow-xl shadow-(--primary-color)/20 font-black uppercase tracking-widest text-[10px]"
            startIcon={<Plus className="w-4 h-4" />}
          >
            Initialize First Record
          </Button>
        )}
      </div>
    );
  }

  // Card view for mobile
  if (isCardView) {
    return (
      <div className="bg-(--card-bg) border border-gray-100 dark:border-white/5 shadow-2xl rounded-[2rem] overflow-hidden transition-all duration-500 flex flex-col h-full min-h-0">
        <div className="p-4 border-b border-gray-100 dark:border-white/5 flex items-center justify-between">
          <h3 className="text-lg font-bold text-(--text-main)">{title || "Records"}</h3>
          <div className="flex items-center gap-2">
            {handleAddItem && (
              <Button onClick={handleAddItem} className="px-4 py-2" startIcon={<Plus className="w-4 h-4" />}>
                Add
              </Button>
            )}
          </div>
        </div>
        <div className="p-4 space-y-3 max-h-[calc(100vh-200px)] overflow-y-auto">
          {paginatedData.map((row, index) => (
            <div
              key={row.id || index}
              className={`bg-(--sidebar-active-bg)/20 rounded-xl p-4 border border-gray-100 dark:border-white/10 transition-all hover:shadow-lg ${
                selectedRow?.id === row.id ? "ring-2 ring-(--primary-color)" : ""
              }`}
              onClick={() => onRowSelect && onRowSelect(row)}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-bold text-sm text-(--text-main)">
                  {enableRowNumbers ? `${(page - 1) * pageSize + index + 1}. ` : ""}
                  {getNestedValue(row, columns[0]?.key || "id")}
                </span>
                {(onView || onEdit || onDelete) && (
                  <div className="flex items-center gap-1">
                    {onView && (
                      <Tooltip content="View details">
                        <button
                          onClick={(e) => { e.stopPropagation(); onView(paginatedData[index]); }}
                          className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500 hover:text-white transition-colors"
                          aria-label="View"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      </Tooltip>
                    )}
                    {onEdit && (
                      <Tooltip content="Edit">
                        <button
                          onClick={(e) => { e.stopPropagation(); onEdit(paginatedData[index]); }}
                          disabled={paginatedData[index]?.isDefault}
                          className="w-8 h-8 rounded-lg bg-indigo-500/10 text-indigo-500 hover:bg-indigo-500 hover:text-white transition-colors disabled:opacity-50"
                          aria-label="Edit"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                      </Tooltip>
                    )}
                    {onDelete && (
                      <Tooltip content="Delete">
                        <button
                          onClick={(e) => { e.stopPropagation(); onDelete(paginatedData[index]); }}
                          disabled={paginatedData[index]?.isDefault}
                          className="w-8 h-8 rounded-lg bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-colors disabled:opacity-50"
                          aria-label="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </Tooltip>
                    )}
                  </div>
                </div>
                <div className="space-y-1 text-xs">
                  {columns.map((column, idx) => (
                    <div key={idx} className="flex justify-between gap-2">
                      <span className="text-gray-400 font-medium uppercase tracking-wider text-[10px]">
                        {column.title}
                      </span>
                      <span className="font-medium text-(--text-main) text-right flex-1 truncate">
                        {column.render
                          ? column.render(getNestedValue(paginatedData[index], column.key), paginatedData[index])
                          : getNestedValue(paginatedData[index], column.key)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
          {!enableInfiniteScroll && enablePagination && totalItems > pageSize && (
            <Pagination
              page={page}
              totalPages={totalPages}
              pageSize={pageSize}
              totalItems={totalItems}
              onPageChange={onPageChange}
              onPageSizeChange={onPageSizeChange}
              pageSizes={DEFAULT_PAGE_SIZES}
              enablePageSizeSelector={enablePageSizeSelector}
            />
          )}
        </div>
      </div>
    );
  }

  // Table view for desktop
  return (
    <div className="bg-(--card-bg) border border-gray-100 dark:border-white/5 shadow-2xl rounded-[2rem] overflow-hidden transition-all duration-500 flex flex-col h-full min-h-0">
      <div className="p-4 border-b border-gray-100 dark:border-white/5 flex flex-wrap items-center justify-between gap-4">
        <h3 className="text-lg font-bold text-(--text-main)">{title || "Records"}</h3>
        <div className="flex items-center gap-4 flex-wrap">
          {handleAddItem && (
            <Button onClick={handleAddItem} className="px-4 py-2" startIcon={<Plus className="w-4 h-4" />}>
              Add
            </Button>
          )}
          {enablePagination && enablePageSizeSelector && (
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium text-gray-500 dark:text-gray-400">Rows per page:</span>
              <select
                value={pageSize}
                onChange={(e) => onPageSizeChange && onPageSizeChange(Number(e.target.value))}
                className="px-3 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-(--primary-color)"
              >
                {DEFAULT_PAGE_SIZES.map(size => (
                  <option key={size} value={size}>{size} per page</option>
                ))}
              </select>
            </div>
          )}
        </div>
      </div>

      <div
        ref={tableContainerRef}
        className="no-scrollbar flex-1 min-h-0 overflow-x-auto"
      >
        <table
          className="min-w-full divide-y divide-gray-100 dark:divide-white/5 text-xs sm:text-sm"
          style={{ tableLayout: "fixed", width: "100%" }}
        >
          <thead className="bg-(--sidebar-active-bg)/50 backdrop-blur-md sticky top-0 z-20">
            <tr>
              {enableRowNumbers && (
                <th className="px-4 py-4 text-center text-[10px] font-black text-gray-400 uppercase tracking-widest sticky top-0 z-10 border-b border-gray-100 dark:border-white/5 w-12">
                  S.No.
                </th>
              )}
              {columns.map((column, idx) => (
                <th
                  key={idx}
                  className={`px-4 py-4 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest min-w-[120px] sticky top-0 z-10 border-b border-gray-100 dark:border-white/5 ${
                    enableSorting && column.sortable !== false ? "cursor-pointer hover:bg-(--sidebar-active-bg)/20 select-none" : ""
                  }`}
                  onClick={() => enableSorting && column.sortable !== false && handleSort(column.key)}
                >
                  <div className="flex items-center gap-1">
                    {column.title}
                    {enableSorting && column.sortable !== false && sortConfig.key === column.key && (
                      <span className="flex-shrink-0">
                        {sortConfig.direction === "asc" ? (
                          <ChevronUp className="w-4 h-4 text-(--primary-color)" />
                        ) : (
                          <ChevronDown className="w-4 h-4 text-(--primary-color)" />
                        )}
                      </span>
                    )}
                  </div>
                </th>
              ))}
              {(onView || onEdit || onDelete) && (
                <th className="px-4 py-4 text-center text-[10px] font-black text-gray-400 uppercase tracking-widest sticky top-0 z-10 w-36 border-b border-gray-100 dark:border-white/5">
                  Actions
                </th>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50 dark:divide-white/5">
            {paginatedData.map((row, index) => (
              <tr
                key={row.id || index}
                ref={(el) => (rowRefs.current[index] = el)}
                className={`group/row hover:bg-(--sidebar-active-bg)/30 cursor-pointer transition-colors duration-200 ${
                  selectedRow?.id === row.id ? "bg-(--sidebar-active-bg) shadow-inner" : ""
                }`}
                onClick={() => onRowSelect && onRowSelect(row)}
              >
                {enableRowNumbers && (
                  <td className="px-4 py-3 text-center text-xs font-medium text-(--text-muted) w-12">
                    {(page - 1) * pageSize + index + 1}
                  </td>
                )}
                {columns.map((column, idx) => (
                  <td
                    key={idx}
                    className="px-4 py-3 text-xs font-medium text-(--text-main) min-w-[120px] truncate"
                    title={getNestedValue(row, column.key)}
                  >
                    {column.render
                      ? column.render(getNestedValue(row, column.key), row)
                      : getNestedValue(row, column.key)}
                  </td>
                ))}

                {(onView || onEdit || onDelete) && (
                  <td className="px-4 py-3 text-center w-36">
                    <div className="flex justify-center gap-1.5 opacity-60 group-hover/row:opacity-100 transition-opacity duration-200">
                      {onView && (
                        <Tooltip content="View details">
                          <IconButton
                            icon={Eye}
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              onView(paginatedData[index]);
                            }}
                            aria-label="View details"
                            className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500 hover:text-white transition-colors border-none"
                          />
                        </Tooltip>
                      )}
                      {onEdit && (
                        <Tooltip content="Edit">
                          <IconButton
                            icon={Edit}
                            size="sm"
                            disabled={paginatedData[index]?.isDefault}
                            onClick={(e) => {
                              e.stopPropagation();
                              onEdit(paginatedData[index]);
                            }}
                            aria-label="Edit"
                            className="w-8 h-8 rounded-lg bg-indigo-500/10 text-indigo-500 hover:bg-indigo-500 hover:text-white transition-colors border-none"
                          />
                        </Tooltip>
                      )}
                      {onDelete && (
                        <Tooltip content="Delete">
                          <IconButton
                            icon={Trash2}
                            size="sm"
                            disabled={paginatedData[index]?.isDefault}
                            onClick={(e) => {
                              e.stopPropagation();
                              onDelete(paginatedData[index]);
                            }}
                            aria-label="Delete"
                            className="w-8 h-8 rounded-lg bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-colors border-none"
                          />
                        </Tooltip>
                      )}
                    </div>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      {!enableInfiniteScroll && enablePagination && totalItems > pageSize && (
        <Pagination
          page={page}
          totalPages={totalPages}
          pageSize={pageSize}
          totalItems={totalItems}
          onPageChange={onPageChange}
          onPageSizeChange={onPageSizeChange}
          pageSizes={DEFAULT_PAGE_SIZES}
          enablePageSizeSelector={enablePageSizeSelector}
        />
      )}

      {/* Infinite Scroll Load More */}
      {onLoadMore && (
        <div ref={loadMoreRef} className="py-8 flex justify-center min-h-[100px] bg-gradient-to-t from-(--card-bg) to-transparent flex-shrink-0">
          {isLoadingMore && hasMore && (
            <div className="flex flex-col items-center gap-3 animate-pulse">
              <Loader />
              <span className="text-gray-400 text-[10px] font-black uppercase tracking-widest">Loading more records...</span>
            </div>
          )}
          {!isLoadingMore && !hasMore && data.length > 0 && (
            <span className="text-gray-300 text-[10px] font-black uppercase tracking-widest italic opacity-50">End of records</span>
          )}
        </div>
      )}
    </div>
  );
};

export default DataTable;
  page,
  totalPages,
  pageSize,
  totalItems,
  onPageChange,
  onPageSizeChange,
  pageSizes = [10, 25, 50, 100],
  enablePageSizeSelector = true,
}) => {
  if (totalPages <= 1 && !enablePageSizeSelector) return null;

  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;
    let start = Math.max(1, page - Math.floor(maxVisible / 2));
    let end = Math.min(totalPages, start + maxVisible - 1);

    if (end - start + 1 < maxVisible) {
      start = Math.max(1, end - maxVisible + 1);
    }

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    return pages;
  };

  const pageNumbers = getPageNumbers();

  return (
    <div className="px-4 py-4 border-t border-gray-100 dark:border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4">
      <div className="flex items-center gap-4 flex-wrap">
        <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
          Showing {(page - 1) * pageSize + 1} to {Math.min(page * pageSize, totalItems)} of {totalItems} records
        </span>
      </div>

      <div className="flex items-center gap-2 flex-wrap justify-end">
        <button
          onClick={() => onPageChange && onPageChange(1)}
          disabled={page === 1}
          className="px-3 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          aria-label="First page"
        >
          <ChevronFirst className="w-4 h-4" />
        </button>
        <button
          onClick={() => onPageChange && onPageChange(page - 1)}
          disabled={page === 1}
          className="px-3 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          aria-label="Previous page"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-1">
          {pageNumbers.map((num, idx) => (
            <button
              key={num}
              onClick={() => onPageChange && onPageChange(num)}
              className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${
                num === page
                  ? "bg-(--primary-color) text-white shadow-sm"
                  : "border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700"
              }`}
              aria-label={`Page ${num}`}
              aria-current={num === page ? "page" : undefined}
            >
              {num}
            </button>
          ))}
          {pageNumbers[0] > 1 && (
            <span className="px-2 text-gray-500 dark:text-gray-400">...</span>
          )}
          {pageNumbers[pageNumbers.length - 1] < totalPages && (
            <span className="px-2 text-gray-500 dark:text-gray-400">...</span>
          )}
        </div>

        <button
          onClick={() => onPageChange && onPageChange(page + 1)}
          disabled={page === totalPages}
          className="px-3 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          aria-label="Next page"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
        <button
          onClick={() => onPageChange && onPageChange(totalPages)}
          disabled={page === totalPages}
          className="px-3 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          aria-label="Last page"
        >
          <ChevronLast className="w-4 h-4" />
        </button>

        {enablePageSizeSelector && (
          <div className="flex items-center gap-2 ml-auto">
            <span className="text-xs text-gray-500 dark:text-gray-400">Rows per page:</span>
            <select
              value={pageSize}
              onChange={(e) => onPageSizeChange && onPageSizeChange(Number(e.target.value))}
              className="px-3 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-(--primary-color)"
            >
              {[10, 25, 50, 100].map(size => (
                <option key={size} value={size}>{size} per page</option>
              ))}
            </select>
          </div>
        )}
      </div>
    );
  };

const DataTable = ({
  title,
  columns = [],
  data = [],
  onEdit,
  onDelete,
  onView,
  handleAddItem,
  selectedRow,
  onRowSelect,
  fullHeight = false,
  onLoadMore,
  hasMore = false,
  loading = false,
  enableInfiniteScroll = true,
  // Pagination props
  page = 1,
  pageSize = 10,
  totalItems = 0,
  onPageChange,
  onPageSizeChange,
  enablePagination = true,
  enablePageSizeSelector = true,
  // Sorting props
  enableSorting = true,
  // Row numbers
  enableRowNumbers = true,
  // Responsive props
  responsive = true,
  cardViewBreakpoint = 768,
}) => {
  const rowRefs = useRef([]);
  const tableContainerRef = useRef(null);
  const loadMoreRef = useRef(null);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const prevDataLengthRef = useRef(0);
  const [isCardView, setIsCardView] = useState(false);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });

  // Sort handler
  const handleSort = (key) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === "asc" ? "desc" : "asc",
    }));
  };

  // Get sorted data
  const sortedData = useMemo(() => {
    if (!sortConfig.key) return data;
    return [...data].sort((a, b) => {
      const aVal = getNestedValue(a, sortConfig.key);
      const bVal = getNestedValue(b, sortConfig.key);
      if (aVal === bVal) return 0;
      const direction = sortConfig.direction === "asc" ? 1 : -1;
      if (typeof aVal === "number" && typeof bVal === "number") {
        return (aVal - bVal) * direction;
      }
      return String(aVal).localeCompare(String(bVal)) * direction;
    });
  }, [data, sortConfig]);

  // Paginated data
  const paginatedData = useMemo(() => {
    if (!enablePagination) return sortedData;
    const start = (page - 1) * pageSize;
    return sortedData.slice(start, start + pageSize);
  }, [sortedData, page, pageSize, enablePagination]);

  // Total pages
  const totalPages = Math.ceil(totalItems / pageSize) || 1;

  // Card view detection
  useEffect(() => {
    const checkCardView = () => {
      setIsCardView(window.innerWidth < cardViewBreakpoint && responsive);
    };
    checkCardView();
    window.addEventListener("resize", checkCardView);
    return () => window.removeEventListener("resize", checkCardView);
  }, [responsive, cardViewBreakpoint]);

  useEffect(() => {
    if (selectedRow && rowRefs.current) {
      const idx = data.findIndex((row) => row.id === selectedRow.id);
      if (idx !== -1 && rowRefs.current[idx]) {
        rowRefs.current[idx].scrollIntoView({
          block: "nearest",
          behavior: "smooth",
        });
      }
    }
  }, [selectedRow, data]);

  useEffect(() => {
    if (!enableInfiniteScroll || !onLoadMore || !hasMore || !loadMoreRef.current) return;

    const container = tableContainerRef.current;
    if (!container) return;

    let timeoutId;
    const observer = new IntersectionObserver(
      (entries) => {
        const target = entries[0];
        if (target.isIntersecting && !isLoadingMore && data.length > 0) {
          clearTimeout(timeoutId);
          timeoutId = setTimeout(() => {
            setIsLoadingMore(true);
            onLoadMore();
          }, 100);
        }
      },
      {
        root: container,
        rootMargin: "200px",
        threshold: 0,
      }
    );

    observer.observe(loadMoreRef.current);

    return () => {
      observer.disconnect();
      clearTimeout(timeoutId);
    };
  }, [enableInfiniteScroll, onLoadMore, hasMore, isLoadingMore, data.length]);

  useEffect(() => {
    if (data.length > prevDataLengthRef.current) {
      setIsLoadingMore(false);
    }
    prevDataLengthRef.current = data.length;
  }, [data.length]);

  if (!Array.isArray(data) || data.length === 0) {
    return (
      <div className="text-center py-20 bg-(--card-bg) rounded-3xl shadow-2xl border border-gray-100 dark:border-white/5 flex flex-col items-center animate-fade-in">
        <div className="w-20 h-20 bg-(--sidebar-active-bg)/30 rounded-full flex items-center justify-center mb-6">
          <Package className="w-10 h-10 text-gray-300" />
        </div>
        <div className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-6 px-1 italic">No operational records identified.</div>
        {handleAddItem && (
          <Button
            key="add"
            onClick={handleAddItem}
            className="rounded-[1rem] px-8 py-3 shadow-xl shadow-(--primary-color)/20 font-black uppercase tracking-widest text-[10px]"
            startIcon={<Plus className="w-4 h-4" />}
          >
            Initialize First Record
          </Button>
        )}
      </div>
    );
  }

  // Card view for mobile
  if (isCardView) {
    return (
      <div className="bg-(--card-bg) border border-gray-100 dark:border-white/5 shadow-2xl rounded-[2rem] overflow-hidden transition-all duration-500 flex flex-col h-full min-h-0">
        <div className="p-4 border-b border-gray-100 dark:border-white/5 flex items-center justify-between">
          <h3 className="text-lg font-bold text-(--text-main)">{title || "Records"}</h3>
          <div className="flex items-center gap-2">
            {handleAddItem && (
              <Button onClick={handleAddItem} className="px-4 py-2" startIcon={<Plus className="w-4 h-4" />}>
                Add
              </Button>
            )}
          </div>
        </div>
        <div className="p-4 space-y-3 max-h-[calc(100vh-200px)] overflow-y-auto">
          {paginatedData.map((row, index) => (
            <div
              key={row.id || index}
              className={`bg-(--sidebar-active-bg)/20 rounded-xl p-4 border border-gray-100 dark:border-white/10 transition-all hover:shadow-lg ${
                selectedRow?.id === row.id ? "ring-2 ring-(--primary-color)" : ""
              }"}
              onClick={() => onRowSelect && onRowSelect(row)}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-bold text-sm text-(--text-main)">
                  {enableRowNumbers ? `${(page - 1) * pageSize + index + 1}. ` : ""}
                  {getNestedValue(row, columns[0]?.key || "id")}
                </span>
                {(onView || onEdit || onDelete) && (
                  <div className="flex items-center gap-1">
                    {onView && (
                      <Tooltip content="View details">
                        <button
                          onClick={(e) => { e.stopPropagation(); onView(paginatedData[index]); }}
                          className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500 hover:text-white transition-colors"
                          aria-label="View"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      </Tooltip>
                    )}
                    {onEdit && (
                      <Tooltip content="Edit">
                        <button
                          onClick={(e) => { e.stopPropagation(); onEdit(paginatedData[index]); }}
                          disabled={paginatedData[index]?.isDefault}
                          className="w-8 h-8 rounded-lg bg-indigo-500/10 text-indigo-500 hover:bg-indigo-500 hover:text-white transition-colors disabled:opacity-50"
                          aria-label="Edit"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                      </Tooltip>
                    )}
                    {onDelete && (
                      <Tooltip content="Delete">
                        <button
                          onClick={(e) => { e.stopPropagation(); onDelete(paginatedData[index]); }}
                          disabled={paginatedData[index]?.isDefault}
                          className="w-8 h-8 rounded-lg bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-colors disabled:opacity-50"
                          aria-label="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </Tooltip>
                    )}
                  </div>
                </div>
                <div className="space-y-1 text-xs">
                  {columns.map((column, idx) => (
                    <div key={idx} className="flex justify-between gap-2">
                      <span className="text-gray-400 font-medium uppercase tracking-wider text-[10px]">
                        {column.title}
                      </span>
                      <span className="font-medium text-(--text-main) text-right flex-1 truncate">
                        {column.render
                          ? column.render(getNestedValue(paginatedData[index], column.key), paginatedData[index])
                          : getNestedValue(paginatedData[index], column.key)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
          {!enableInfiniteScroll && enablePagination && totalItems > pageSize && (
            <Pagination
              page={page}
              totalPages={totalPages}
              pageSize={pageSize}
              totalItems={totalItems}
              onPageChange={onPageChange}
              onPageSizeChange={onPageSizeChange}
              pageSizes={DEFAULT_PAGE_SIZES}
              enablePageSizeSelector={enablePageSizeSelector}
            />
          )}
        </div>
      </div>
    );
  }

  // Table view for desktop
  return (
    <div className="bg-(--card-bg) border border-gray-100 dark:border-white/5 shadow-2xl rounded-[2rem] overflow-hidden transition-all duration-500 flex flex-col h-full min-h-0">
      <div className="p-4 border-b border-gray-100 dark:border-white/5 flex flex-wrap items-center justify-between gap-4">
        <h3 className="text-lg font-bold text-(--text-main)">{title || "Records"}</h3>
        <div className="flex items-center gap-4 flex-wrap">
          {handleAddItem && (
            <Button onClick={handleAddItem} className="px-4 py-2" startIcon={<Plus className="w-4 h-4" />}>
              Add
            </Button>
          )}
          {enablePagination && enablePageSizeSelector && (
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium text-gray-500 dark:text-gray-400">Rows per page:</span>
              <select
                value={pageSize}
                onChange={(e) => onPageSizeChange && onPageSizeChange(Number(e.target.value))}
                className="px-3 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-(--primary-color)"
              >
                {DEFAULT_PAGE_SIZES.map(size => (
                  <option key={size} value={size}>{size} per page</option>
                ))}
              </select>
            </div>
          )}
        </div>
      </div>

      <div
        ref={tableContainerRef}
        className="no-scrollbar flex-1 min-h-0 overflow-x-auto"
      >
        <table
          className="min-w-full divide-y divide-gray-100 dark:divide-white/5 text-xs sm:text-sm"
          style={{ tableLayout: "fixed", width: "100%" }}
        >
          <thead className="bg-(--sidebar-active-bg)/50 backdrop-blur-md sticky top-0 z-20">
            <tr>
              {enableRowNumbers && (
                <th className="px-4 py-4 text-center text-[10px] font-black text-gray-400 uppercase tracking-widest sticky top-0 z-10 border-b border-gray-100 dark:border-white/5 w-12">
                  S.No.
                </th>
              )}
              {columns.map((column, idx) => (
                <th
                  key={idx}
                  className={`px-4 py-4 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest min-w-[120px] sticky top-0 z-10 border-b border-gray-100 dark:border-white/5 ${
                    enableSorting && column.sortable !== false ? "cursor-pointer hover:bg-(--sidebar-active-bg)/20 select-none" : ""
                  }`}
                  onClick={() => enableSorting && column.sortable !== false && handleSort(column.key)}
                >
                  <div className="flex items-center gap-1">
                    {column.title}
                    {enableSorting && column.sortable !== false && sortConfig.key === column.key && (
                      <span className="flex-shrink-0">
                        {sortConfig.direction === "asc" ? (
                          <ChevronUp className="w-4 h-4 text-(--primary-color)" />
                        ) : (
                          <ChevronDown className="w-4 h-4 text-(--primary-color)" />
                        )}
                      </span>
                    )}
                  </div>
                </th>
              ))}
              {(onView || onEdit || onDelete) && (
                <th className="px-4 py-4 text-center text-[10px] font-black text-gray-400 uppercase tracking-widest sticky top-0 z-10 w-36 border-b border-gray-100 dark:border-white/5">
                  Actions
                </th>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50 dark:divide-white/5">
            {paginatedData.map((row, index) => (
              <tr
                key={row.id || index}
                ref={(el) => (rowRefs.current[index] = el)}
                className={`group/row hover:bg-(--sidebar-active-bg)/30 cursor-pointer transition-colors duration-200 ${
                  selectedRow?.id === row.id ? "bg-(--sidebar-active-bg) shadow-inner" : ""
                }`}
                onClick={() => onRowSelect && onRowSelect(row)}
              >
                {enableRowNumbers && (
                  <td className="px-4 py-3 text-center text-xs font-medium text-(--text-muted) w-12">
                    {(page - 1) * pageSize + index + 1}
                  </td>
                )}
                {columns.map((column, idx) => (
                  <td
                    key={idx}
                    className="px-4 py-3 text-xs font-medium text-(--text-main) min-w-[120px] truncate"
                    title={getNestedValue(row, column.key)}
                  >
                    {column.render
                      ? column.render(getNestedValue(row, column.key), row)
                      : getNestedValue(row, column.key)}
                  </td>
                ))}

                {(onView || onEdit || onDelete) && (
                  <td className="px-4 py-3 text-center w-36">
                    <div className="flex justify-center gap-1.5 opacity-60 group-hover/row:opacity-100 transition-opacity duration-200">
                      {onView && (
                        <Tooltip content="View details">
                          <IconButton
                            icon={Eye}
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              onView(paginatedData[index]);
                            }}
                            aria-label="View details"
                            className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500 hover:text-white transition-colors border-none"
                          />
                        </Tooltip>
                      )}
                      {onEdit && (
                        <Tooltip content="Edit">
                          <IconButton
                            icon={Edit}
                            size="sm"
                            disabled={paginatedData[index]?.isDefault}
                            onClick={(e) => {
                              e.stopPropagation();
                              onEdit(paginatedData[index]);
                            }}
                            aria-label="Edit"
                            className="w-8 h-8 rounded-lg bg-indigo-500/10 text-indigo-500 hover:bg-indigo-500 hover:text-white transition-colors border-none"
                          />
                        </Tooltip>
                      )}
                      {onDelete && (
                        <Tooltip content="Delete">
                          <IconButton
                            icon={Trash2}
                            size="sm"
                            disabled={paginatedData[index]?.isDefault}
                            onClick={(e) => {
                              e.stopPropagation();
                              onDelete(paginatedData[index]);
                            }}
                            aria-label="Delete"
                            className="w-8 h-8 rounded-lg bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-colors border-none"
                          />
                        </Tooltip>
                      )}
                    </div>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      {!enableInfiniteScroll && enablePagination && totalItems > pageSize && (
        <Pagination
          page={page}
          totalPages={totalPages}
          pageSize={pageSize}
          totalItems={totalItems}
          onPageChange={onPageChange}
          onPageSizeChange={onPageSizeChange}
          pageSizes={DEFAULT_PAGE_SIZES}
          enablePageSizeSelector={enablePageSizeSelector}
        />
      )}

      {/* Infinite Scroll Load More */}
      {onLoadMore && (
        <div ref={loadMoreRef} className="py-8 flex justify-center min-h-[100px] bg-gradient-to-t from-(--card-bg) to-transparent flex-shrink-0">
          {isLoadingMore && hasMore && (
            <div className="flex flex-col items-center gap-3 animate-pulse">
              <Loader />
              <span className="text-gray-400 text-[10px] font-black uppercase tracking-widest">Loading more records...</span>
            </div>
          )}
          {!isLoadingMore && !hasMore && data.length > 0 && (
            <span className="text-gray-300 text-[10px] font-black uppercase tracking-widest italic opacity-50">End of records</span>
          )}
        </div>
      )}
    </div>
  );
};

export default DataTable;