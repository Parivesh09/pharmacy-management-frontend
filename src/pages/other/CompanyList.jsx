import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useGetUserCompaniesQuery } from "../../services/userCompanyApi";
import CommonPageLayout from "../../components/layout/CommonPageLayout";
import { useLocation, useNavigate } from "react-router-dom";
import Button from "../../components/common/Button";
import { LogOut, Plus } from "lucide-react";
import { logout, setCurrentCompany } from "../../services/userSlice";

const CompanyList = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.user);
  const { currentCompany } = useSelector((state) => state.user);

  const userId = user?.id;
  const { data: userCompanies } = useGetUserCompaniesQuery(userId);

  useEffect(() => {
    // Only redirect if there are no companies
    if (userCompanies?.data?.length === 0) {
      navigate("/create-company");
    }
  }, [userCompanies, navigate]);

  const columns = [
    { key: "companyName", title: "Company Name" },
    {
      key: "isPrimary",
      title: "Primary",
      render: (value) => (
        <span
          className={`px-2 py-1 rounded-full text-xs font-medium ${
            value === true
              ? "bg-blue-100 text-green-800"
              : "bg-rose-100 text-rose-800"
          }`}
        >
          {value ? <span>Yes</span> : <span>No</span>}
        </span>
      ),
    },
    { key: "branchCode", title: "Branch Code" },
    { key: "address", title: "Address" },
  ];

  const handleCompanySelect = (row) => {
    dispatch(setCurrentCompany(row));
    navigate(`/dashboard`, { replace: true });
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login", { replace: true });
  };

  return (
    <div>
      <CommonPageLayout
        title="Company List"
        onRowSelect={handleCompanySelect}
        onAdd={() => navigate("/create-company")}
        tableData={userCompanies?.data || []}
        columns={columns}
        actions={[
          <Button key="add" onClick={() => navigate("/create-company")}>
            <Plus className="w-4 h-4 mr-2" /> Create Company
          </Button>,
          // logout button can be added here
          <Button key="logout" onClick={handleLogout}>
            <LogOut className="w-4 h-4 mr-2" /> Logout
          </Button>,
        ]}
        onEdit={(company) => navigate(`/edit-company/${company.id}`)}
        onDelete={(id) => {}}
      />
    </div>
  );
};

export default CompanyList;
