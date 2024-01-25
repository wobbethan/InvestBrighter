import React from "react";
import AdminSideBar from "../components/Admin/Layout/AdminSideBar";
import AddAdmin from "../components/Admin/AddAdmin";
import AdminHeader from "../components/Layout/AdminHeader";

const AddAdminPage = () => {
  return (
    <div>
      <AdminHeader />
      <div className="w-full flex">
        <div className="flex items-start w-full">
          <div className="w-[80px] 800px:w-[330px]">
            <AdminSideBar active={8} />
          </div>
          <div className="flex items-center justify-center w-full">
            <AddAdmin />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddAdminPage;
