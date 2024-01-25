import React from "react";
import AdminSideBar from "../components/Admin/Layout/AdminSideBar";
import AdminHeader from "../components/Layout/AdminHeader";
import ManageSection from "../components/Admin/ManageSection";

const ManageSectionPage = () => {
  return (
    <div>
      <AdminHeader />
      <div className="w-full flex">
        <div className="flex items-start w-full">
          <div className="w-[80px] 800px:w-[330px]">
            <AdminSideBar active={7} />
          </div>
          <div className="flex items-center justify-center w-full">
            <ManageSection />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManageSectionPage;
