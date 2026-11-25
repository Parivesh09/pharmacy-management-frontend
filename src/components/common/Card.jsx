const Card = ({ children, className = "", ...props }) => (
  <div
    className={`bg-(--card-bg) text-(--text-main) rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 ${className}`.trim()}
    {...props}
  >
    {children}
  </div>
);

export default Card; 