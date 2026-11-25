import { useRef, useEffect, useState, useMemo, useCallback } from "react";
import { Edit, Trash2, Eye, Plus, Package, ChevronUp, ChevronDown } from "lucide-react";
import Button from "./Button";
import IconButton from "./IconButton";
import Loader from "./Loader";
import Tooltip from "./Tooltip";

// Helper function to access nested properties
const getNestedValue = (obj, path) => {
  return path.split('.').reduce((current, prop) => current?.[prop], obj) ?? "-";
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
  enableSorting = true,
  enableRowNumbers = true,
}) => {
  const rowRefs = useRef([]);
  const tableContainerRef = useRef(null);
  const loadMoreRef = useRef(null);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const prevDataLengthRef = useRef(0);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });

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
  
  // Clean up row refs when data changes to prevent memory leak
  useEffect(() => {
    const currentLength = data.length;
    if (rowRefs.current.length > currentLength) {
      rowRefs.current.length = currentLength;
    }
  }, [data.length]);
  
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

  // Reset loading state when data length changes (new data loaded)
  useEffect(() => {
    if (data.length > prevDataLengthRef.current) {
      setIsLoadingMore(false);
    }
    prevDataLengthRef.current = data.length;
  }, [data.length]);

  // Sorting handler
  const handleSort = useCallback((key) => {
    if (!enableSorting) return;
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === "asc" ? "desc" : "asc",
    }));
  }, [enableSorting]);

  // Get sorted data
  const sortedData = useMemo(() => {
    if (!sortConfig.key || !enableSorting) return data;
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
  }, [data, sortConfig, enableSorting]);

  if (!Array.isArray(sortedData) || sortedData.length === 0) {
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

  return (
    <div className="bg-(--card-bg) border border-gray-100 dark:border-white/5 shadow-2xl rounded-[2rem] overflow-hidden transition-all duration-500 flex flex-col h-full min-h-0">
      <div
        ref={tableContainerRef}
        className="no-scrollbar flex-1 min-h-0 overflow-y-auto"
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
                    enableSorting && column.sortable !== false ? "cursor-pointer hover:bg-(--sidebar-active-bg)/20" : ""
                  }`}
                  onClick={() => enableSorting && column.sortable !== false && handleSort(column.key)}
                >
                  <div className="flex items-center gap-1">
                    {column.title}
                    {enableSorting && column.sortable !== false && sortConfig.key === column.key ? (
                      <span className="flex-shrink-0">
                        {sortConfig.direction === "asc" ? (
                          <ChevronUp className="w-4 h-4 text-(--primary-color)" />
                        ) : (
                          <ChevronDown className="w-4 h-4 text-(--primary-color)" />
                        )}
                      </span>
                    ) : null}
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
            {sortedData.map((row, index) => (
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
                    {index + 1}
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
                              onView(row);
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
                            disabled={row.isDefault}
                            onClick={(e) => {
                              e.stopPropagation();
                              onEdit(row);
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
                            disabled={row.isDefault}
                            onClick={(e) => {
                              e.stopPropagation();
                              onDelete(row);
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

        {onLoadMore && (
          <div ref={loadMoreRef} className="py-8 flex justify-center min-h-[100px] bg-gradient-to-t from-(--card-bg) to-transparent flex-shrink-0">
            {isLoadingMore && hasMore && (
              <div className="flex flex-col items-center gap-3 animate-pulse">
                <Loader />
                <span className="text-gray-400 text-[10px] font-black uppercase tracking-widest">Synchronizing Metadata...</span>
              </div>
            )}
            {!isLoadingMore && !hasMore && sortedData.length > 0 && (
              <span className="text-gray-300 text-[10px] font-black uppercase tracking-widest italic opacity-50">Operational End of Stack</span>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default DataTable;