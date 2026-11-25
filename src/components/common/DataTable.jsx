import { useRef, useEffect, useState } from "react";
import { Edit, Trash2, Eye, Plus, Package } from "lucide-react";
import Button from "./Button";
import IconButton from "./IconButton";
import Loader from "./Loader";

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
}) => {
  const rowRefs = useRef([]);
  const tableContainerRef = useRef(null);
  const loadMoreRef = useRef(null);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const prevDataLengthRef = useRef(0);

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
        
        // Only trigger if:
        // 1. Element is visible
        // 2. Not already loading
        // 3. Data has stabilized (prevent initial double-load)
        if (target.isIntersecting && !isLoadingMore && data.length > 0) {
          // Add a small delay to prevent rapid-fire calls
          clearTimeout(timeoutId);
          timeoutId = setTimeout(() => {
            setIsLoadingMore(true);
            onLoadMore();
          }, 100);
        }
      },
      {
        root: container,
        rootMargin: "200px", // Load earlier to make it smoother
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

  return (
    <div className="bg-(--card-bg) border border-gray-100 dark:border-white/5 shadow-2xl rounded-[2rem] overflow-hidden transition-all duration-500">
      <div
        ref={tableContainerRef}
        className="no-scrollbar"
        style={{
          maxHeight: fullHeight ? "calc(100vh - 200px)" : "calc(100vh - 300px)",
          overflowY: "auto",
        }}
      >
        <table
          className="min-w-full divide-y divide-gray-100 dark:divide-white/5 text-xs sm:text-sm"
          style={{ tableLayout: "fixed", width: "100%" }}
        >
          <thead className="bg-(--sidebar-active-bg)/50 backdrop-blur-md sticky top-0 z-20">
            <tr>
              {columns.map((column, idx) => (
                <th
                  key={idx}
                  className={`px-6 py-5 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest ${
                    idx === 0 ? "w-3/4" : "w-1/4"
                  } sticky top-0 z-10 border-b border-gray-100 dark:border-white/5`}
                >
                  {column.title}
                </th>
              ))}
              {(onView || onEdit || onDelete) && (
                <th className="px-6 py-5 text-center text-[10px] font-black text-gray-400 uppercase tracking-widest sticky top-0 z-10 w-32 border-b border-gray-100 dark:border-white/5">
                  Access Points
                </th>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50 dark:divide-white/5">
            {data.map((row, index) => (
              <tr
                key={row.id || index}
                ref={(el) => (rowRefs.current[index] = el)}
                className={`group/row hover:bg-(--sidebar-active-bg)/30 cursor-pointer transition-all duration-300 ${
                  selectedRow?.id === row.id ? "bg-(--sidebar-active-bg) shadow-inner" : ""
                }`}
                onClick={() => onRowSelect && onRowSelect(row)}
              >
                {columns.map((column, idx) => (
                  <td
                    key={idx}
                    className={`px-6 py-4 whitespace-nowrap text-xs font-bold text-(--text-main) ${
                      idx === 0 ? "w-3/4" : "w-1/4"
                    } transition-all group-hover/row:translate-x-1`}
                  >
                    {column.render
                      ? column.render(getNestedValue(row, column.key), row)
                      : getNestedValue(row, column.key)}
                  </td>
                ))}

                {(onView || onEdit || onDelete) && (
                  <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium w-32">
                    <div className="flex justify-center gap-1 opacity-40 group-hover/row:opacity-100 transition-all scale-95 group-hover/row:scale-100">
                      {onView && (
                        <IconButton
                          icon={Eye}
                          onClick={(e) => {
                            e.stopPropagation();
                            onView(row);
                          }}
                          className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500 hover:text-white transition-all border-none"
                        />
                      )}
                      {onEdit && (
                        <IconButton
                          icon={Edit}
                          disabled={row.isDefault}
                          onClick={(e) => {
                            e.stopPropagation();
                            onEdit(row);
                          }}
                          className="w-8 h-8 rounded-lg bg-indigo-500/10 text-indigo-500 hover:bg-indigo-500 hover:text-white transition-all border-none"
                        />
                      )}
                      {onDelete && (
                        <IconButton
                          icon={Trash2}
                          disabled={row.isDefault}
                          onClick={(e) => {
                            e.stopPropagation();
                            onDelete(row);
                          }}
                          className="w-8 h-8 rounded-lg bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-all border-none"
                        />
                      )}
                    </div>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>

        {onLoadMore && (
          <div ref={loadMoreRef} className="py-8 flex justify-center min-h-[100px] bg-gradient-to-t from-(--card-bg) to-transparent">
            {isLoadingMore && hasMore && (
              <div className="flex flex-col items-center gap-3 animate-pulse">
                <Loader />
                <span className="text-gray-400 text-[10px] font-black uppercase tracking-widest">Synchronizing Metadata...</span>
              </div>
            )}
            {!isLoadingMore && !hasMore && data.length > 0 && (
              <span className="text-gray-300 text-[10px] font-black uppercase tracking-widest italic opacity-50">Operational End of Stack</span>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default DataTable;