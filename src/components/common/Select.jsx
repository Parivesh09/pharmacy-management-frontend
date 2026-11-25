import React, { forwardRef } from "react";

const Select = forwardRef(
  (
    { className = "", value, onChange, options, children, noPadding, ...props },
    ref
  ) => (
    <select
      value={value}
      onChange={onChange}
      ref={ref}
      className={`${className} w-full ${
        noPadding ? "" : "py-3 px-4"
      } bg-white/50 dark:bg-white/5 border border-gray-400 dark:border-white/20 rounded-[1rem] focus:outline-none focus:ring-2 focus:ring-(--primary-color)/20 focus:border-(--primary-color) text-sm text-(--text-main) transition-all font-bold appearance-none shadow-sm`.trim()}
      {...props}
    >
      {options
        ? options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))
        : children}
    </select>
  )
);

export default Select;
