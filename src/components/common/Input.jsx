import React, { forwardRef } from "react";

const Input = forwardRef(
  (
    {
      type,
      className = "",
      width,
      fullWidth,
      label,
      noPadding,
      startIcon,
      endIcon,
      ...props
    },
    ref
  ) => (
    <>
      {label && <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 px-1">{label}</label>}
      <div className={`flex ${fullWidth ? "w-full" : ""} relative align-center justify-center`}>
        {startIcon && (
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
            {startIcon}
          </div>
        )}
        <input
          type={type}
          ref={ref}
          className={`${className} ${width ? width : "w-full"} ${
            noPadding ? "p-0" : startIcon ? "pl-11 pr-4 py-3" : "py-3 px-4"
          } bg-white/50 dark:bg-white/5 border border-gray-400 dark:border-white/20 rounded-[1rem] focus:outline-none focus:ring-2 focus:ring-(--primary-color)/20 focus:border-(--primary-color) text-sm text-(--text-main) placeholder-gray-400 transition-all font-bold shadow-sm`.trim()}
          {...props}
        />
        {endIcon && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
            {endIcon}
          </div>
        )}
      </div>
    </>
  )
);

export default Input;
