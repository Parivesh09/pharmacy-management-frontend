const PageHeader = ({ title, subtitle, actions }) => (
    <div className="bg-white shadow-sm border-b border-gray-200 px-6 py-2">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-xl font-bold text-gray-900">{title}</h1>
        </div>
        {actions && <div className="flex gap-2">{actions}</div>}
      </div>
    </div>
  );

  
  export default PageHeader