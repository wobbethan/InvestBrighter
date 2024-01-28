import React from "react";
import AdminAllCompanies from "../../components/AdminAllCompanies.jsx";
import AdminSideBar from "../components/Admin/Layout/AdminSideBar.jsx";
import AdminHeader from "../components/Layout/AdminHeader.jsx";
const AdminAllCompaniesPage = () => {
  return (
    <div>
      <AdminHeader />
      <div className="w-full flex">
        <div className="flex items-start w-full">
          <div className="w-[80px] 800px:w-[330px]">
            <AdminSideBar active={3} />
          </div>
          <div className="flex items-center justify-center w-full">
            <AdminAllCompanies />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminAllCompaniesPage;
