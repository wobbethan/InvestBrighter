import React from "react";
import DashboardSidebar from "../../components/Shop/Layout/DashboardSidebar";
import DashboardHeader from "../../components/Shop/Layout/DashboardHeader";
import ShopTeamMembers from "../../components/Shop/ShopTeamMembers.jsx";

const ShopTeamMembersPage = () => {
  return (
    <div>
      <DashboardHeader />
      <div className="flex justify-between w-full">
        <div className="800px:w-[330px] w-[80px]">
          <DashboardSidebar active={10}></DashboardSidebar>
        </div>
        <div className="w-full justify-center flex">
          <ShopTeamMembers />
        </div>
      </div>
    </div>
  );
};

export default ShopTeamMembersPage;
