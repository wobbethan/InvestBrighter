import React from "react";
import DashboardHeader from "../../components/Shop/Layout/DashboardHeader";
import DashboardSidebar from "../../components/Shop/Layout/DashboardSidebar";
import AllEvents from "../../components/Shop/AllEvents";

const ShopAllEvents = () => {
  return (
    <div>
      {" "}
      <DashboardHeader />
      <div className="flex justify-between w-full">
        <div className="800px:w-[330px] w-[80px]">
          <DashboardSidebar active={5}></DashboardSidebar>
        </div>
        <div className="w-full justify-center flex">
          <AllEvents></AllEvents>
        </div>
      </div>
    </div>
  );
};

export default ShopAllEvents;
