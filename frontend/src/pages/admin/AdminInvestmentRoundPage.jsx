import React from "react";
import AdminAllUsers from "../../components/AdminAllUsers.jsx";
import AdminSideBar from "../components/Admin/Layout/AdminSideBar.jsx";
import AdminHeader from "../components/Layout/AdminHeader.jsx";
import CreateEvents from "../../components/Shop/CreateEvents.jsx";
const AdminInvestmentRoundPage = () => {
  return (
    <div>
      <AdminHeader />
      <div className="w-full flex">
        <div className="flex items-start w-full">
          <div className="w-[80px] 800px:w-[330px]">
            <AdminSideBar active={6} />
          </div>
          <div className="flex items-center justify-center w-full mt-5">
            <CreateEvents />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminInvestmentRoundPage;
