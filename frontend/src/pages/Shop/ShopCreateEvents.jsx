import React from "react";
import CreateEvents from "../../components/Shop/CreateEvents.jsx";
import DashboardHeader from "../../components/Shop/Layout/DashboardHeader.jsx";
import DashboardSidebar from "../../components/Shop/Layout/DashboardSidebar.jsx";

const ShopCreateEvents = () => {
  return (
    <div>
      <DashboardHeader />
      <div className="flex justify-between items-center w-full">
        <div className="800px:w-[330px] w-[80px]">
          <DashboardSidebar active={6}></DashboardSidebar>
        </div>
        <div className="w-full justify-center flex">
          <CreateEvents />
        </div>
      </div>
    </div>
  );
};

export default ShopCreateEvents;
