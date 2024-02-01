import React from "react";
import DashboardHeader from "../../components/Shop/Layout/DashboardHeader.jsx";
import DashboardMain from "../../components/Shop/DashboardMain.jsx";
import DashboardSidebar from "../../components/Shop/Layout/DashboardSidebar.jsx";

function ShopDashboardPage() {
  return (
    <div>
      <DashboardHeader />
      <div className="flex justify-between w-full">
        <div className="w-[80px] 800px:w-[330px]">
          <DashboardSidebar active={1} />
        </div>
        <div className="w-full justify-center flex">
          <DashboardMain />
        </div>
      </div>
    </div>
  );
}

export default ShopDashboardPage;
