import { useState, useEffect, useRef } from "react";
import { Search, X, BookOpen } from "lucide-react";
import { useGetLedgersQuery } from "../../services/ledgerApi.js";
import { useDebounce } from "../../utils/useDebounce.js";
import Pagination from "./Pagination.jsx";

const GlobalLedgerListModal = ({ 
    open, 
    onClose, 
    onSelectLedger, 
    title = "Select Ledger",
    groupIds,
    defaultFilters = {} 
}) => {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [data, setData] = useState([]);
  const debouncedSearch = useDebounce(search, 300);
  const prevDataRef = useRef([]);

  const { 
    data: ledgerData, 
    isLoading, 
    isFetching 
  } = useGetLedgersQuery({
    page,
    limit: 10,
    search: debouncedSearch,
    groupIds: groupIds,
    isActive: true,
    ...defaultFilters
  });

  useEffect(() => {
    setPage(1);
    setData([]);
    prevDataRef.current = [];
  }, [debouncedSearch, groupIds]);

  useEffect(() => {
    if (ledgerData?.data && ledgerData.data.length > 0) {
      const uniqueIncomingData = Array.from(
        new Map(ledgerData.data.map((item) => [item.id, item])).values()
      );

      if (page === 1) {
        setData(uniqueIncomingData);
        prevDataRef.current = uniqueIncomingData;
      } else {
        const existingIds = new Set(prevDataRef.current.map((item) => item.id));
        const uniqueNewData = uniqueIncomingData.filter(
          (item) => !existingIds.has(item.id)
        );

        if (uniqueNewData.length > 0) {
          const updatedData = [...prevDataRef.current, ...uniqueNewData];
          setData(updatedData);
          prevDataRef.current = updatedData;
        }
      }
    }
  }, [ledgerData, page]);

  const pagination = ledgerData?.pagination;
  const hasMore = pagination ? page < pagination.totalPages : false;

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/20 backdrop-blur-xl flex items-center justify-center z-50 p-4">
      <div className="w-full max-w-5xl max-h-[85vh] flex flex-col bg-(--card-bg)/90 rounded-[2.5rem] shadow-2xl border border-white/20 overflow-hidden animate-in fade-in zoom-in duration-300">
        {/* Header */}
        <div className="flex items-center justify-between p-8 border-b border-gray-100 dark:border-white/5 bg-gradient-to-r from-(--header-bg) to-(--header-bg)/90 text-white relative">
           <div className="absolute inset-0 opacity-10 pointer-events-none" style={{
            backgroundImage: `radial-gradient(#ffffff 1px, transparent 1px)`,
            backgroundSize: '20px 20px'
          }}></div>
          <div className="relative z-10 flex items-center gap-4">
            <div className="p-3 bg-white/10 rounded-2xl backdrop-blur-md">
               <BookOpen className="text-white" size={24} />
            </div>
            <div>
               <h2 className="text-xl font-black italic tracking-tighter uppercase leading-none">{title}</h2>
               <p className="text-[10px] font-bold text-white/60 uppercase tracking-widest mt-1">Acquire account ledger for financial operations</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="relative z-10 p-2 hover:bg-white/10 rounded-xl transition-colors text-white/50 hover:text-white"
          >
            <X size={24} />
          </button>
        </div>

        {/* Search */}
        <div className="p-6 border-b border-gray-100 dark:border-white/5 bg-(--sidebar-active-bg) flex gap-4 items-center flex-wrap">
          <div className="flex-1 min-w-64 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="SEARCH_LEDGER_REGISTRY..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-white/50 dark:bg-white/5 border border-gray-400 dark:border-white/10 rounded-2xl focus:outline-none focus:ring-2 focus:ring-(--primary-color)/20 font-bold text-sm shadow-sm"
            />
          </div>
          <div className="text-[10px] text-gray-400 font-black uppercase tracking-widest ml-auto italic">
            Ledgers Found: {pagination?.totalRecords || 0}
          </div>
        </div>

        {/* Table Content */}
        <div className="flex-1 overflow-y-auto">
          {isLoading ? (
            <div className="flex items-center justify-center h-64">
              <div className="w-12 h-12 border-4 border-(--primary-color)/20 border-t-(--primary-color) rounded-full animate-spin"></div>
            </div>
          ) : (
            <table className="w-full text-sm border-collapse">
              <thead className="sticky top-0 bg-(--bg-main) border-b border-gray-100 dark:border-white/5 z-10 backdrop-blur-md">
                <tr>
                  <th className="px-6 py-4 text-left font-black uppercase tracking-widest text-gray-400 text-[10px] min-w-[300px]">Account Identification</th>
                  <th className="px-6 py-4 text-left font-black uppercase tracking-widest text-gray-400 text-[10px] min-w-[150px]">Station</th>
                  <th className="px-6 py-4 text-right font-black uppercase tracking-widest text-gray-400 text-[10px] min-w-[150px]">Current Value</th>
                  <th className="px-6 py-4 text-center font-black uppercase tracking-widest text-gray-400 text-[10px] min-w-[120px]">Status</th>
                  <th className="px-6 py-4 text-center font-black uppercase tracking-widest text-gray-400 text-[10px] min-w-[100px]">Commit</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 dark:divide-white/5">
                {data.length > 0 ? (
                  data.map((ledger) => (
                    <tr
                      key={ledger.id}
                      className="bg-(--sidebar-active-bg) hover:bg-(--sidebar-active-bg)/80 transition-all duration-300 group cursor-pointer"
                      onClick={() => {
                        onSelectLedger(ledger);
                        onClose();
                      }}
                    >
                      <td className="px-6 py-5">
                        <div className="font-black text-(--text-main) uppercase tracking-tighter text-sm group-hover:text-(--primary-color) transition-colors">{ledger.name}</div>
                        <div className="text-[10px] text-gray-400 font-bold uppercase tracking-tight">Financial Entity</div>
                      </td>
                      <td className="px-6 py-5">
                        <div className="text-xs font-bold text-gray-500 uppercase tracking-tight">{ledger.station || "MAIN_OPERATIONAL_ZONE"}</div>
                      </td>
                      <td className="px-6 py-5 text-right">
                        <div className="font-black italic tracking-tighter text-sm text-(--text-main)">
                          ₹{parseFloat(ledger.closingBalance || 0).toFixed(2)}
                        </div>
                        <div className="text-[9px] font-black uppercase text-gray-400 tracking-[0.1em]">{ledger.balanceType}</div>
                      </td>
                      <td className="px-6 py-5 text-center">
                         <span className={`px-3 py-1 rounded-full text-[10px] font-black tracking-widest ${
                          (ledger.status || "Active").toLowerCase() === "active"
                            ? "bg-emerald-500/10 text-emerald-500"
                            : "bg-red-500/10 text-red-500"
                        }`}>
                          {ledger.status || "ACTIVE"}
                        </span>
                      </td>
                      <td className="px-6 py-5 text-center">
                        <button className="px-6 py-2 bg-(--primary-color) text-white rounded-xl text-[9px] font-black uppercase tracking-[0.1em] shadow-lg shadow-(--primary-color)/20 hover:brightness-110 active:scale-95 transition-all">
                          Deploy
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="px-6 py-20 text-center">
                       <div className="flex flex-col items-center gap-4 opacity-30">
                          <BookOpen size={32} />
                          <p className="text-[10px] font-black uppercase tracking-widest">No matching ledgers found in matrix</p>
                       </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>

        {/* Infinite Scroll / Pagination info would go here, for now using same layout */}
        <div className="p-4 border-t border-gray-100 dark:border-white/5 bg-(--bg-main)/50 flex justify-center">
             {hasMore && (
               <button 
                onClick={() => setPage(p => p + 1)}
                className="text-[10px] font-black uppercase tracking-[0.2em] text-(--primary-color) hover:brightness-110 transition-all py-2"
               >
                 Expand Repository View
               </button>
             )}
        </div>
      </div>
    </div>
  );
};

export default GlobalLedgerListModal;
