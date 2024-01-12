import React from "react";
import DashboardHeader from "../components/Shop/Layout/DashboardHeader.jsx";
import DashboardSideBar from "../components/Shop/Layout/DashboardSidebar.jsx";

function ShopDashboardPage() {
  return (
    <div>
      <DashboardHeader />
      <div className="flex items-center justify-between w-full">
        <div className="w-[330px]">
          <DashboardSideBar active={1}></DashboardSideBar>
        </div>
      </div>
    </div>
  );
}

export default ShopDashboardPage;
