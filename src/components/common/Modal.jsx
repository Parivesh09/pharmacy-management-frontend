import React, { useEffect, useRef } from "react";

const Modal = ({ open, onClose, title, children, className = "max-w-lg" }) => {
  const ref = useRef();

  useEffect(() => {
    if (!open) return;
    const handleKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [open, onClose]);

  useEffect(() => {
    if (open && ref.current) ref.current.focus();
  }, [open]);

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/10 backdrop-blur-[1px] animate-fade-in p-4" onClick={onClose}>
      <div
        className={`bg-(--card-bg)/90 max-h-[90vh] overflow-y-auto no-scrollbar rounded-[2rem] shadow-2xl border border-white/20 p-8 w-full relative transition-all duration-500 scale-100 animate-zoom-in ${className}`}
        tabIndex={-1}
        ref={ref}
        onClick={e => e.stopPropagation()}
      >
        {title && (
          <div className="mb-6 px-1">
            <h2 className="text-2xl font-black italic tracking-tighter text-(--text-main) uppercase leading-none">{title}</h2>
            <div className="w-12 h-1 bg-(--primary-color) mt-3 rounded-full"></div>
          </div>
        )}
        {children}
        <button
          className="absolute top-6 right-6 w-10 h-10 rounded-full bg-(--sidebar-active-bg)/30 flex items-center justify-center text-(--text-main) hover:bg-red-500 hover:text-white transition-all font-black text-xl cursor-pointer border-none shadow-sm"
          onClick={onClose}
          aria-label="Close"
        >
          ×
        </button>
      </div>
    </div>
  );
};

export default Modal; 