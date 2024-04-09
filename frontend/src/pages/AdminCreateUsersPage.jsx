import React from "react";
import AdminHeader from "./components/Layout/AdminHeader";
import AdminSideBar from "./components/Admin/Layout/AdminSideBar";
import AdminCreateUser from "../components/AdminCreateUser.jsx";

const AdminCreateUsersPage = () => {
  return (
    <div>
      <AdminHeader />
      <div className="w-full flex">
        <div className="flex items-start w-full">
          <div className="w-[80px] 800px:w-[330px]">
            <AdminSideBar active={15} />
          </div>
          <div className="flex flex-grow items-center justify-center w-[full] ">
            <AdminCreateUser />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminCreateUsersPage;
