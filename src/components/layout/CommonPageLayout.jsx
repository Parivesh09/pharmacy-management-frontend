import { useRef } from "react";
import PageHeader from "../common/PageHeader";
import Input from "../common/Input";
import Select from "../common/Select";
import DataTable from "../common/DataTable";
import Loader from "../common/Loader";
import Pagination from "../common/Pagination";

const CommonPageLayout = ({
  title,
  subtitle,
  actions,
  search,
  onSearchChange,
  searchOptions = [],
  selectedSearchField,
  onSearchFieldChange,
  extraFilters = null,
  tableData = [],
  columns,
  isLoading,
  selectedRow,
  onRowSelect,
  onAdd,
  onEdit,
  onDelete,
  rowInfoPanel = null,
  onArrowNavigation = null,
  fullTableHeight = false,
  justifyBetween = false,
  onLoadMore,
  hasMore,
  page,
  totalPages,
  onPageChange,
  enableInfiniteScroll = false,
}) => {
  const tableRef = useRef();

  return (
    <div className="flex space-y-2 flex-col h-[calc(100vh-120px)]">
      <PageHeader title={title} subtitle={subtitle} actions={actions} />

      <div
        className={`flex flex-wrap gap-2 px-6 items-center ${
          justifyBetween ? "justify-between" : "justify-start"
        }`}
      >
        <Input
          type="text"
          className="w-full sm:w-64"
          placeholder="Search..."
          value={search}
          onChange={onSearchChange}
        />
        {searchOptions.length > 0 && (
          <Select
            className="w-full sm:w-40"
            value={selectedSearchField}
            onChange={onSearchFieldChange}
          >
            {searchOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </Select>
        )}
        {extraFilters}
      </div>

      <div className="flex-1 flex flex-col px-6 min-h-fit">
        {isLoading ? (
          <Loader />
        ) : (
          <>
            <DataTable
              title={title}
              columns={columns}
              data={tableData}
              handleAddItem={onAdd}
              onEdit={onEdit}
              onDelete={onDelete}
              selectedRow={selectedRow}
              onRowSelect={onRowSelect}
              fullHeight={fullTableHeight}
              onLoadMore={onLoadMore}
              hasMore={hasMore}
              loading={false}
              enableInfiniteScroll={enableInfiniteScroll}
            />
            {!enableInfiniteScroll && totalPages && (
              <Pagination
                page={page}
                totalPages={totalPages}
                onPageChange={onPageChange}
              />
            )}
          </>
        )}

        {rowInfoPanel && (
          <div className="border border-gray-300 rounded-lg bg-white p-3 mt-2 min-h-[60px]">
            {rowInfoPanel}
          </div>
        )}
      </div>
    </div>
  );
};

export default CommonPageLayout;