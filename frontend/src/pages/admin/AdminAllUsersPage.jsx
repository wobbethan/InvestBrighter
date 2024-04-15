import React from "react";
import AdminAllUsers from "../../components/AdminAllUsers.jsx";
import AdminSideBar from "../components/Admin/Layout/AdminSideBar.jsx";
import AdminHeader from "../components/Layout/AdminHeader.jsx";
const AdminAllUsersPage = () => {
  return (
    <div>
      <AdminHeader />
      <div className="w-full flex">
        <div className="flex items-start w-full">
          <div className="w-[80px] 800px:w-[330px]">
            <AdminSideBar active={4} />
          </div>
          <div className="flex items-center justify-center w-full flex-col">
            <AdminAllUsers />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminAllUsersPage;
