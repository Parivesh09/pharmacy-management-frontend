import React, { useState, useRef, useEffect } from "react";

export default function SearchableSelect({
  options = [],
  value,
  onChange,
  placeholder = "Select...",
  getOptionLabel,
  allowCreate = false,
  noPadding,
  startIcon,
  disabled = false,
}) {
  const [inputValue, setInputValue] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(0);
  const inputRef = useRef(null);
  const listRef = useRef(null);

  const normalizedOptions = options.map((opt) =>
    typeof opt === "string"
      ? { label: opt, value: opt }
      : {
          label: getOptionLabel ? getOptionLabel(opt) : opt.label,
          value: opt.value,
        }
  );

  const filteredOptions = normalizedOptions.filter((opt) =>
    opt.label?.toLowerCase().includes(inputValue.toLowerCase())
  );

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        inputRef.current &&
        !inputRef.current.contains(e.target) &&
        listRef.current &&
        !listRef.current.contains(e.target)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleKeyDown = (e) => {
    if (!isOpen) return;
    if (e.key === "ArrowDown") {
      setHighlightedIndex((prev) =>
        Math.min(prev + 1, filteredOptions.length - 1)
      );
    } else if (e.key === "ArrowUp") {
      setHighlightedIndex((prev) => Math.max(prev - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (filteredOptions[highlightedIndex]) {
        handleSelect(filteredOptions[highlightedIndex]);
      } else if (allowCreate && inputValue) {
        handleSelect({ label: inputValue, value: inputValue, isNew: true });
      }
    } else if (e.key === "Escape") {
      setIsOpen(false);
    }
  };

  const handleSelect = (option) => {
    setIsOpen(false);
    setInputValue("");
    setHighlightedIndex(0);
    onChange && onChange(option);
  };

  useEffect(() => {
    if (!isOpen && value) {
      const selected = normalizedOptions.find((opt) => opt.value === value);
      setInputValue(selected ? selected.label : "");
    }
  }, [isOpen, value]);

  return (
    <div className="relative w-full">
      <input
        ref={inputRef}
        disabled={disabled}
        type="text"
        className={`w-full ${
            noPadding ? "p-0" : startIcon ? "pl-11 pr-4 py-3" : "py-3 px-4"
          } bg-white/50 dark:bg-white/5 border border-gray-400 dark:border-white/20 rounded-[1rem] focus:outline-none focus:ring-2 focus:ring-(--primary-color)/20 focus:border-(--primary-color) text-sm text-(--text-main) transition-all font-bold placeholder-gray-400 shadow-sm`.trim()}
        placeholder={placeholder}
        value={
          isOpen
            ? inputValue
            : normalizedOptions.find((opt) => opt.value === value)?.label || ""
        }
        onChange={(e) => {
          const newValue = e.target.value;
          setInputValue(newValue);
          setIsOpen(true);
          setHighlightedIndex(0);
          
          if (newValue === "" && value) {
            onChange && onChange(null);
          }
        }}
        onFocus={() => setIsOpen(true)}
        onKeyDown={handleKeyDown}
        autoComplete="off"
      />
      {isOpen && (
        <ul
          ref={listRef}
          className="absolute z-50 mt-2 w-full bg-(--card-bg) border border-gray-100 dark:border-white/10 rounded-2xl shadow-2xl max-h-60 overflow-auto text-sm no-scrollbar animate-in fade-in zoom-in duration-200 backdrop-blur-md"
        >
          {filteredOptions.length === 0 && !allowCreate && (
             <li className="px-5 py-6 text-center text-[10px] font-black uppercase tracking-widest text-gray-400 opacity-50">
               No matching records
             </li>
          )}
          {filteredOptions.map((opt, idx) => (
            <li
              key={opt.value || idx}
              className={`px-5 py-3 cursor-pointer transition-colors ${
                idx === highlightedIndex 
                ? "bg-(--primary-color) text-white font-black" 
                : "text-(--text-main) hover:bg-(--sidebar-active-bg) font-bold"
              } text-xs uppercase tracking-tight`}
              onMouseDown={(e) => {
                e.preventDefault();
                handleSelect(opt);
              }}
              onMouseEnter={() => setHighlightedIndex(idx)}
            >
              {opt.label}
            </li>
          ))}
          {allowCreate &&
            !normalizedOptions.some((opt) => opt.label === inputValue) && (
              <li
                className="px-5 py-4 cursor-pointer text-(--primary-color) hover:bg-(--primary-color)/10 border-t border-gray-50 dark:border-white/5 font-black text-[10px] uppercase tracking-widest flex items-center gap-2"
                onMouseDown={(e) => {
                  e.preventDefault();
                  handleSelect({
                    label: inputValue,
                    value: inputValue,
                    isNew: true,
                  });
                }}
              >
                <div className="w-4 h-4 rounded-full bg-(--primary-color) text-white flex items-center justify-center text-[10px]">+</div>
                Initialize: {inputValue}
              </li>
            )}
        </ul>
      )}
    </div>
  );
}
