import { useNavigate } from "react-router-dom";
import { useGetItemsQuery } from "../../../../services/itemApi";
import { useGetStoresQuery } from "../../../../services/storeApi";
import { useState } from "react";
import Button from "../../../../componets/common/Button";
import { Plus } from "lucide-react";
import Select from "../../../../componets/common/Select";
import CommonPageLayout from "../../../../componets/layout/CommonPageLayout";
import { useDebounce } from "../../../../utils/useDebounce";

const ItemsPage = () => {
  const [selectedRow, setSelectedRow] = useState(null);
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 300);
  const [searchField, setSearchField] = useState("Description");
  const [selectedStore, setSelectedStore] = useState("");
  const [page, setPage] = useState(1);
  const [limit] = useState(10);

  const navigate = useNavigate();

  const { data, isLoading } = useGetItemsQuery({
    page,
    limit,
    search: debouncedSearch,
    filters: selectedStore ? { storeid: selectedStore } : {},
  });
  const { data: stores = [] } = useGetStoresQuery();

  const handleAddItem = () => navigate("/master/inventory/items/create");

  const columns = [
    { key: "productname", title: "Item Name" },
    { key: "packing", title: "Packing" },
    { key: "CompanyDetails.companyname", title: "Company" },
    { key: "Unit1.unitName", title: "Unit" },
    { key: "price", title: "M.R.P" },
  ];

  return (
    <CommonPageLayout
      title="Items Management"
      actions={[
        <Button key="add" onClick={handleAddItem}>
          <Plus className="w-4 h-4" /> Add Item
        </Button>,
      ]}
      search={search}
      onSearchChange={(e) => {
        setSearch(e.target.value);
        setPage(1);
      }}
      searchOptions={[{ value: "description", label: "Description" }]}
      selectedSearchField={searchField}
      onSearchFieldChange={(e) => setSearchField(e.target.value)}
      extraFilters={
        <Select
          className="w-full sm:w-40"
          value={selectedStore}
          onChange={(e) => {
            setSelectedStore(e.target.value);
            setPage(1);
          }}
        >
          <option value="">All Stores</option>
          {stores?.data?.map((store) => (
            <option key={store.id} value={store.id}>
              {store.storename}
            </option>
          ))}
        </Select>
      }
      tableData={data?.data || []}
      columns={columns}
      isLoading={isLoading}
      selectedRow={selectedRow}
      onRowSelect={setSelectedRow}
      onAdd={handleAddItem}
      onEdit={(row) => navigate(`/master/inventory/items/edit/${row.id}`)}
      onDelete={(row) => console.log("Delete:", row)}
      page={page}
      totalPages={data?.totalPages || 1}
      onPageChange={setPage}
    />
  );
};

export default ItemsPage;
