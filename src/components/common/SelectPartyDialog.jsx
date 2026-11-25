import React, { useState, useMemo } from "react";
import { Search, X } from "lucide-react";
import { useGetLedgersQuery } from "../../services/ledgerApi";

const SelectPartyDialog = ({ open, onClose, onSelectParty }) => {
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("name");
  const { data: ledgersData, isLoading } = useGetLedgersQuery({ limit: 100 });

  const filteredLedgers = useMemo(() => {
    if (!ledgersData?.data) return [];

    let filtered = ledgersData.data.filter(ledger =>
      ledger.name?.toLowerCase().includes(search.toLowerCase()) ||
      ledger.address?.toLowerCase().includes(search.toLowerCase())
    );

    if (sortBy === "name") {
      filtered.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortBy === "balance") {
      filtered.sort((a, b) => (b.balance || 0) - (a.balance || 0));
    }

    return filtered;
  }, [ledgersData, search, sortBy]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/10 backdrop-blur-[2px] flex items-center justify-center z-50 p-4">
      <div className="w-full max-w-5xl max-h-[85vh] flex flex-col bg-(--card-bg)/90 rounded-[2.5rem] shadow-2xl border border-white/20 overflow-hidden animate-in fade-in zoom-in duration-300">
        {/* Header */}
        <div className="flex items-center justify-between p-8 border-b border-gray-100 dark:border-white/5 bg-gradient-to-r from-(--header-bg) to-(--header-bg)/90 text-white relative">
          <div className="absolute inset-0 opacity-10 pointer-events-none" style={{
            backgroundImage: `radial-gradient(#ffffff 1px, transparent 1px)`,
            backgroundSize: '20px 20px'
          }}></div>
          <div className="relative z-10 flex items-center gap-4">
            <div className="p-3 bg-white/10 rounded-2xl backdrop-blur-md">
              <Search className="text-white" size={24} />
            </div>
            <div>
              <h2 className="text-xl font-black italic tracking-tighter uppercase leading-none">Select Trading Ally</h2>
              <p className="text-[10px] font-bold text-white/60 uppercase tracking-widest mt-1">Acquire ledger for business transaction</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="relative z-10 p-2 hover:bg-white/10 rounded-xl transition-colors text-white/50 hover:text-white"
          >
            <X size={24} />
          </button>
        </div>

        {/* Search and Filter */}
        <div className="p-6 border-b border-gray-100 dark:border-white/5 bg-(--sidebar-active-bg) flex gap-4 items-center flex-wrap">
          <div className="flex-1 min-w-64 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="search.."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-white/50 dark:bg-white/5 border border-gray-400 dark:border-white/10 rounded-2xl focus:outline-none focus:ring-2 focus:ring-(--primary-color)/20 font-bold text-sm shadow-sm"
            />
          </div>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-6 py-3 bg-white/50 dark:bg-white/5 border border-gray-400 dark:border-white/10 rounded-2xl focus:outline-none focus:ring-2 focus:ring-(--primary-color)/20 font-black uppercase tracking-widest text-[10px] appearance-none shadow-sm"
          >
            <option value="name">Alpha Sort</option>
            <option value="balance">Account Depth</option>
          </select>
          <div className="text-[10px] text-gray-400 font-black uppercase tracking-widest ml-auto italic">
            Entities Found: {filteredLedgers.length}
          </div>
        </div>

        {/* Table */}
        <div className="flex-1 overflow-y-auto">
          {isLoading ? (
            <div className="flex items-center justify-center h-64">
              <div className="w-12 h-12 border-4 border-(--primary-color)/20 border-t-(--primary-color) rounded-full animate-spin"></div>
            </div>
          ) : (
            <table className="w-full text-sm border-collapse">
              <thead className="sticky top-0 bg-(--bg-main) border-b border-gray-100 dark:border-white/5 z-10 backdrop-blur-md">
                <tr>
                  <th className="px-6 py-4 text-left font-black uppercase tracking-widest text-gray-400 text-[10px] min-w-[300px]">Entity Identification</th>
                  <th className="px-6 py-4 text-left font-black uppercase tracking-widest text-gray-400 text-[10px] min-w-[120px]">Status</th>
                  <th className="px-6 py-4 text-right font-black uppercase tracking-widest text-gray-400 text-[10px] min-w-[120px]">Valuation</th>
                  <th className="px-6 py-4 text-center font-black uppercase tracking-widest text-gray-400 text-[10px] min-w-[100px]">Commit</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 dark:divide-white/5">
                {filteredLedgers.length > 0 ? (
                  filteredLedgers.map((ledger, idx) => (
                    <tr
                      key={ledger.id}
                      className="bg-(--sidebar-active-bg) hover:bg-(--sidebar-active-bg)/80 transition-all duration-300 group cursor-pointer"
                      onClick={() => {
                        onSelectParty(ledger);
                        onClose();
                      }}
                    >
                      <td className="px-6 py-5 min-w-[300px]">
                        <div className="font-black text-(--text-main) uppercase tracking-tighter text-sm group-hover:text-(--primary-color) transition-colors">{ledger.name}</div>
                        <div className="text-[10px] text-gray-400 font-bold uppercase tracking-tight truncate max-w-[400px]">{ledger.address || "No secondary address provided"}</div>
                      </td>
                      <td className="px-6 py-5">
                        <span className={`px-3 py-1 rounded-full text-[10px] font-black tracking-widest ${(ledger.status || "Active").toLowerCase() === "active"
                            ? "bg-emerald-500/10 text-emerald-500 shadow-sm shadow-emerald-500/10"
                            : "bg-red-500/10 text-red-500"
                          }`}>
                          {ledger.status || "ACTIVE"}
                        </span>
                      </td>
                      <td className="px-6 py-5 text-right font-black italic tracking-tighter text-sm text-(--text-main)">
                        ₹{parseFloat(ledger.balance || 0).toFixed(2)}
                      </td>
                      <td className="px-6 py-5 text-center">
                        <button
                          className="px-6 py-2 bg-(--primary-color) text-white rounded-xl text-[9px] font-black uppercase tracking-[0.1em] shadow-lg shadow-(--primary-color)/20 hover:brightness-110 active:scale-95 transition-all"
                        >
                          Deploy
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="px-6 py-20 text-center">
                      <div className="flex flex-col items-center gap-4 opacity-30">
                        <div className="w-16 h-16 rounded-full border-2 border-dashed border-gray-400 flex items-center justify-center">
                          <Search size={32} />
                        </div>
                        <p className="text-[10px] font-black uppercase tracking-widest">No matching entities found in matrix</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default SelectPartyDialog;
