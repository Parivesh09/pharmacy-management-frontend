import React from "react";
import { Search, Sun, Moon, Filter, Barcode } from "lucide-react";

const PosHeader = ({
  searchQuery,
  setSearchQuery,
  selectedCategory,
  setSelectedCategory,
  theme,
  onToggleTheme,
  onBarcodeScan,
}) => {
  const categories = [
    { id: "all", name: "All", icon: "Grid" },
    { id: "tablets", name: "Tablets", icon: "Pill" },
    { id: "syrups", name: "Syrups", icon: "Droplet" },
    { id: "injections", name: "Injections", icon: "Syringe" },
    { id: "ointments", name: "Ointments", icon: "Box" },
  ];

  return (
    <div
      className="p-4 border-b flex gap-4 items-center"
      style={{
        backgroundColor: "var(--card-bg)",
        borderColor: "var(--card-border)",
      }}
    >
      <div className="flex items-center gap-2">
        <label
          className="text-sm font-medium"
          style={{ color: "var(--text-secondary)" }}
        >
          Store:
        </label>
        <select
          className="input py-1.5 text-sm w-auto"
          style={{
            backgroundColor: "var(--input-bg)",
            borderColor: "var(--input-border)",
            color: "var(--text-main)",
          }}
        >
          <option>Main Store</option>
          <option>Branch 1</option>
          <option>Branch 2</option>
        </select>
      </div>

      <div className="flex-1 relative max-w-md">
        <Search
          className="absolute left-3 top-1/2 -translate-y-1/2"
          size={18}
          style={{ color: "var(--text-muted)" }}
        />
        <input
          type="text"
          placeholder="Search products... (F2)"
          className="input pl-10"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <button
          onClick={onBarcodeScan}
          className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-lg hover:bg-sidebar-hover transition-colors"
          style={{ color: "var(--text-secondary)" }}
          title="Barcode Scan (F9)"
        >
          <Barcode className="w-5 h-5" />
        </button>
      </div>

      <div className="flex items-center gap-1">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all duration-200 flex items-center gap-1 ${
              selectedCategory === cat.id
                ? "bg-primary text-white shadow-lg shadow-primary/20"
                : "text-sidebar-text hover:bg-sidebar-hover hover:text-sidebar-active-text"
            }`}
            style={{
              color: "var(--sidebar-text)",
              backgroundColor:
                selectedCategory === cat.id
                  ? "var(--primary-color)"
                  : "transparent",
            }}
          >
            {cat.name}
          </button>
        ))}
      </div>

      <button
        onClick={onToggleTheme}
        className="p-2 rounded-lg hover:bg-sidebar-hover transition-colors"
        style={{ color: "var(--text-secondary)" }}
        title={
          theme?.mode === "dark"
            ? "Switch to Light Mode"
            : "Switch to Dark Mode"
        }
      >
        {theme?.mode === "dark" ? (
          <Sun className="w-5 h-5" />
        ) : (
          <Moon className="w-5 h-5" />
        )}
      </button>
    </div>
  );
};

export default PosHeader;
