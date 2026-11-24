import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { setTheme, resetTheme } from "../../services/userSlice";
import { Palette, Moon, Sun, Check, RotateCcw } from "lucide-react";
import {
  applyTheme,
  presetThemes,
  generateThemeFromPrimary,
} from "../../utils/themeManager";

const ThemeSettings = () => {
  const theme = useSelector((state) => state.user.theme);
  const dispatch = useDispatch();

  const handleColorChange = (key, value) => {
    dispatch(setTheme({ [key]: value }));
  };

  const handlePresetSelect = (preset, isDark) => {
    const newTheme = generateThemeFromPrimary(
      preset.primary,
      isDark ? "dark" : "light",
    );
    dispatch(setTheme(newTheme));
  };

  const handleModeToggle = (mode) => {
    if (mode === "dark") {
      const darkTheme = {
        ...theme,
        mode: "dark",
        headerBg: shadeColor(theme.primaryColor, -40),
        sidebarBg: "#0f172a",
        sidebarText: "#e2e8f0",
      };
      dispatch(setTheme(darkTheme));
    } else {
      const lightTheme = {
        ...theme,
        mode: "light",
        headerBg: shadeColor(theme.primaryColor, -20),
        sidebarBg: "#ffffff",
        sidebarText: "#374151",
      };
      dispatch(setTheme(lightTheme));
    }
  };

  const handleReset = () => {
    dispatch(resetTheme());
  };

  const handleCustomPrimaryChange = (e) => {
    const primaryColor = e.target.value;
    const newTheme = generateThemeFromPrimary(primaryColor, theme.mode);
    dispatch(setTheme(newTheme));
  };

  return (
    <div className="p-6 w-full mx-auto bg-main min-h-screen">
      <div className="flex items-center gap-3 mb-8">
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center"
          style={{ backgroundColor: theme.primaryColor }}
        >
          <Palette className="w-6 h-6 text-white" />
        </div>
        <h1 className="text-3xl font-black italic tracking-tighter text-main uppercase">
          Theme Settings
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="card p-6 shadow-lg">
            <h2 className="text-xl font-semibold mb-6 flex items-center gap-2 text-main">
              <Sun className="w-5 h-5" style={{ color: theme.primaryColor }} />
              Appearance
            </h2>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-3 text-secondary">
                  Display Mode
                </label>
                <div className="flex gap-4">
                  <button
                    onClick={() => handleModeToggle("light")}
                    className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl border-2 transition-all ${
                      theme.mode === "light"
                        ? "border-primary bg-primary/10 text-primary shadow-lg shadow-primary/10"
                        : "border-border-main hover:border-primary/50 text-secondary"
                    }`}
                  >
                    <Sun className="w-5 h-5" /> Light
                  </button>
                  <button
                    onClick={() => handleModeToggle("dark")}
                    className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl border-2 transition-all ${
                      theme.mode === "dark"
                        ? "border-primary bg-primary/10 text-primary shadow-lg shadow-primary/10"
                        : "border-border-main hover:border-primary/50 text-secondary"
                    }`}
                  >
                    <Moon className="w-5 h-5" /> Dark
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-3 text-secondary">
                  Primary Color
                </label>
                <div className="flex flex-wrap items-center gap-3">
                  {presetThemes.map((p) => (
                    <button
                      key={p.name}
                      onClick={() =>
                        handlePresetSelect(p, theme.mode === "dark")
                      }
                      className="w-10 h-10 rounded-full shadow-md hover:scale-110 transition-transform relative border-2"
                      style={{
                        backgroundColor: p.primary,
                        borderColor:
                          theme.primaryColor === p.primary &&
                          theme.mode === "light"
                            ? "#fff"
                            : theme.primaryColor === p.primary &&
                                theme.mode === "dark"
                              ? "#000"
                              : "transparent",
                      }}
                      title={p.name}
                    >
                      {theme.primaryColor === p.primary && (
                        <Check
                          className="w-5 h-5 absolute inset-0 m-auto"
                          style={{
                            color: theme.mode === "dark" ? "#000" : "#fff",
                          }}
                        />
                      )}
                    </button>
                  ))}
                  <div className="relative group">
                    <input
                      type="color"
                      value={theme.primaryColor}
                      onChange={handleCustomPrimaryChange}
                      className="w-10 h-10 rounded-full cursor-pointer border-none p-0 overflow-hidden ring-2 ring-offset-2"
                      style={{ ringColor: theme.primaryColor }}
                    />
                    <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-xs text-muted whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
                      Custom
                    </span>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-3 text-secondary">
                  Header Background
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={theme.headerBg}
                    onChange={(e) =>
                      handleColorChange("headerBg", e.target.value)
                    }
                    className="w-12 h-12 rounded-lg cursor-pointer border-2 border-border-main"
                  />
                  <input
                    type="text"
                    value={theme.headerBg}
                    onChange={(e) =>
                      handleColorChange("headerBg", e.target.value)
                    }
                    className="input w-32 font-mono text-sm uppercase"
                    placeholder="#00505b"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-3 text-secondary">
                  Sidebar Background
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={theme.sidebarBg}
                    onChange={(e) =>
                      handleColorChange("sidebarBg", e.target.value)
                    }
                    className="w-12 h-12 rounded-lg cursor-pointer border-2 border-border-main"
                  />
                  <input
                    type="text"
                    value={theme.sidebarBg}
                    onChange={(e) =>
                      handleColorChange("sidebarBg", e.target.value)
                    }
                    className="input w-32 font-mono text-sm uppercase"
                    placeholder="#ffffff"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-3 text-secondary">
                  Sidebar Text Color
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={theme.sidebarText}
                    onChange={(e) =>
                      handleColorChange("sidebarText", e.target.value)
                    }
                    className="w-12 h-12 rounded-lg cursor-pointer border-2 border-border-main"
                  />
                  <input
                    type="text"
                    value={theme.sidebarText}
                    onChange={(e) =>
                      handleColorChange("sidebarText", e.target.value)
                    }
                    className="input w-32 font-mono text-sm uppercase"
                    placeholder="#374151"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="card p-6 shadow-lg">
            <h2 className="text-xl font-semibold mb-6 flex items-center gap-2 text-main">
              <RotateCcw
                className="w-5 h-5"
                style={{ color: theme.primaryColor }}
              />
              Actions
            </h2>
            <div className="flex flex-wrap gap-3">
              <button onClick={handleReset} className="btn-secondary">
                <RotateCcw className="w-4 h-4" /> Reset to Default
              </button>
              <button
                onClick={() =>
                  dispatch(
                    setTheme({
                      primaryColor: "#2563eb",
                      headerBg: "#1e40af",
                      sidebarBg: theme.mode === "dark" ? "#0f172a" : "#ffffff",
                      sidebarText:
                        theme.mode === "dark" ? "#e2e8f0" : "#374151",
                      mode: theme.mode,
                    }),
                  )
                }
                className="btn-primary"
              >
                Apply Blue Theme
              </button>
              <button
                onClick={() =>
                  dispatch(
                    setTheme({
                      primaryColor: "#7c3aed",
                      headerBg: theme.mode === "dark" ? "#4c1d95" : "#4c1d95",
                      sidebarBg: theme.mode === "dark" ? "#0f172a" : "#ffffff",
                      sidebarText:
                        theme.mode === "dark" ? "#e2e8f0" : "#374151",
                      mode: theme.mode,
                    }),
                  )
                }
                className="btn-secondary"
              >
                Apply Purple Theme
              </button>
              <button
                onClick={() =>
                  dispatch(
                    setTheme({
                      primaryColor: "#16a34a",
                      headerBg: theme.mode === "dark" ? "#14532d" : "#14532d",
                      sidebarBg: theme.mode === "dark" ? "#0f172a" : "#ffffff",
                      sidebarText:
                        theme.mode === "dark" ? "#e2e8f0" : "#374151",
                      mode: theme.mode,
                    }),
                  )
                }
                className="btn-secondary"
              >
                Apply Green Theme
              </button>
            </div>
          </div>
        </div>

        <div className="lg:col-span-1">
          <div
            className="card overflow-hidden shadow-xl h-full"
            style={{ borderColor: "var(--card-border)" }}
          >
            <h2
              className="text-xl font-semibold p-6 border-b text-main"
              style={{ borderColor: "var(--card-border)" }}
            >
              Live Preview
            </h2>
            <div
              className="p-6 h-[500px] flex flex-col"
              style={{ backgroundColor: "var(--bg-main)" }}
            >
              <div
                className="h-14 px-4 flex items-center justify-between rounded-t-xl mb-4"
                style={{ backgroundColor: "var(--header-bg)" }}
              >
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: "var(--primary-color)" }}
                >
                  <Palette className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1 mx-4">
                  <div
                    className="h-4 w-1/3 rounded"
                    style={{
                      backgroundColor: "var(--text-muted)",
                      opacity: 0.3,
                    }}
                  ></div>
                </div>
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: "var(--button-secondary-bg)" }}
                >
                  <Moon className="w-5 h-5 text-secondary" />
                </div>
              </div>
              <div className="flex-1 flex overflow-hidden">
                <div
                  className="w-48 border-r flex-shrink-0 flex flex-col"
                  style={{
                    backgroundColor: "var(--sidebar-bg)",
                    borderColor: "var(--sidebar-border)",
                  }}
                >
                  <div className="p-4 space-y-2">
                    <div
                      className="h-8 rounded-lg flex items-center gap-2 px-3"
                      style={{ backgroundColor: "var(--sidebar-active-bg)" }}
                    >
                      <Sun
                        className="w-4 h-4"
                        style={{ color: "var(--sidebar-active-text)" }}
                      />
                      <span
                        className="text-sm font-medium"
                        style={{ color: "var(--sidebar-active-text)" }}
                      >
                        Dashboard
                      </span>
                    </div>
                    <div className="h-8 rounded-lg flex items-center gap-2 px-3 hover:bg-sidebar-hover transition-colors cursor-pointer">
                      <Palette className="w-4 h-4 text-sidebar-text" />
                      <span
                        className="text-sm"
                        style={{ color: "var(--sidebar-text)" }}
                      >
                        Master
                      </span>
                    </div>
                    <div className="h-8 rounded-lg flex items-center gap-2 px-3 hover:bg-sidebar-hover transition-colors cursor-pointer">
                      <Package className="w-4 h-4 text-sidebar-text" />
                      <span
                        className="text-sm"
                        style={{ color: "var(--sidebar-text)" }}
                      >
                        Inventory
                      </span>
                    </div>
                    <div className="h-8 rounded-lg flex items-center gap-2 px-3 hover:bg-sidebar-hover transition-colors cursor-pointer">
                      <ShoppingCart className="w-4 h-4 text-sidebar-text" />
                      <span
                        className="text-sm"
                        style={{ color: "var(--sidebar-text)" }}
                      >
                        Sales
                      </span>
                    </div>
                    <div className="h-8 rounded-lg flex items-center gap-2 px-3 hover:bg-sidebar-hover transition-colors cursor-pointer">
                      <Briefcase className="w-4 h-4 text-sidebar-text" />
                      <span
                        className="text-sm"
                        style={{ color: "var(--sidebar-text)" }}
                      >
                        Accounting
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex-1 p-6 space-y-4 overflow-y-auto">
                  <div className="grid grid-cols-2 gap-4">
                    <div
                      className="card p-4 h-24 flex flex-col justify-between"
                      style={{ borderColor: "var(--card-border)" }}
                    >
                      <div className="flex items-center gap-2">
                        <div
                          className="w-8 h-8 rounded-lg flex items-center justify-center"
                          style={{ backgroundColor: "var(--primary-color)" }}
                        >
                          <Package className="w-4 h-4 text-white" />
                        </div>
                        <div>
                          <p className="text-xs font-medium text-muted">
                            Total Items
                          </p>
                          <p className="text-xl font-black text-main">1,234</p>
                        </div>
                      </div>
                      <div
                        className="h-1 w-full rounded-full"
                        style={{
                          backgroundColor: "var(--primary-color)",
                          opacity: 0.2,
                        }}
                      ></div>
                    </div>
                    <div
                      className="card p-4 h-24 flex flex-col justify-between"
                      style={{ borderColor: "var(--card-border)" }}
                    >
                      <div className="flex items-center gap-2">
                        <div
                          className="w-8 h-8 rounded-lg flex items-center justify-center"
                          style={{ backgroundColor: "var(--success-bg)" }}
                        >
                          <TrendingUp className="w-4 h-4 text-success" />
                        </div>
                        <div>
                          <p className="text-xs font-medium text-muted">
                            Today's Sales
                          </p>
                          <p className="text-xl font-black text-main">
                            ₹45,678
                          </p>
                        </div>
                      </div>
                      <div
                        className="h-1 w-full rounded-full"
                        style={{
                          backgroundColor: "var(--success-text)",
                          opacity: 0.3,
                        }}
                      ></div>
                    </div>
                  </div>
                  <div
                    className="card p-4"
                    style={{ borderColor: "var(--card-border)" }}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-semibold text-main">
                        Recent Transactions
                      </h3>
                      <span className="text-xs text-muted">View all</span>
                    </div>
                    <div className="space-y-2">
                      {[
                        {
                          name: "Paracetamol 500mg",
                          qty: 10,
                          amount: "₹50.00",
                          time: "10:30 AM",
                        },
                        {
                          name: "Amoxicillin 250mg",
                          qty: 5,
                          amount: "₹125.00",
                          time: "10:15 AM",
                        },
                        {
                          name: "Vitamin D3",
                          qty: 2,
                          amount: "₹340.00",
                          time: "09:45 AM",
                        },
                      ].map((tx, i) => (
                        <div
                          key={i}
                          className="flex items-center justify-between p-2 rounded-lg hover:bg-bg-secondary transition-colors"
                        >
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-main truncate">
                              {tx.name}
                            </p>
                            <p className="text-xs text-muted">
                              {tx.time} • Qty: {tx.qty}
                            </p>
                          </div>
                          <span className="font-bold text-primary ml-4">
                            {tx.amount}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div
                    className="card p-4"
                    style={{ borderColor: "var(--card-border)" }}
                  >
                    <button className="btn-primary w-full">
                      <Save className="w-4 h-4" /> Save Bill
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

function shadeColor(color, percent) {
  let R = parseInt(color.substring(1, 3), 16);
  let G = parseInt(color.substring(3, 5), 16);
  let B = parseInt(color.substring(5, 7), 16);

  R = parseInt((R * (100 + percent)) / 100);
  G = parseInt((G * (100 + percent)) / 100);
  B = parseInt((B * (100 + percent)) / 100);

  R = Math.min(255, Math.max(0, R));
  G = Math.min(255, Math.max(0, G));
  B = Math.min(255, Math.max(0, B));

  const RR = R.toString(16).padStart(2, "0");
  const GG = G.toString(16).padStart(2, "0");
  const BB = B.toString(16).padStart(2, "0");

  return `#${RR}${GG}${BB}`;
}

import {
  ShoppingCart,
  Briefcase,
  Save,
  TrendingUp,
  Package,
} from "lucide-react";

export default ThemeSettings;
