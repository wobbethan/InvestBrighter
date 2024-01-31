import React from "react";
import AdminSideBar from "../components/Admin/Layout/AdminSideBar";
import AdminHeader from "../components/Layout/AdminHeader";
import ManageRounds from "../../components/Admin/ManageRounds.jsx";
const AdminManageRoundPage = () => {
  return (
    <div>
      <AdminHeader />
      <div className="w-full flex">
        <div className="flex items-start w-full">
          <div className="w-[80px] 800px:w-[330px]">
            <AdminSideBar active={10} />
          </div>
          <div className="flex items-center justify-center w-full mt-5">
            <ManageRounds />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminManageRoundPage;
