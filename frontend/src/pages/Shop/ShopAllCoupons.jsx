import React from "react";
import DashboardHeader from "../../components/Shop/Layout/DashboardHeader.jsx";
import DashboardSidebar from "../../components/Shop/Layout/DashboardSidebar.jsx";
import AllCouponCodes from "../../components/Shop/AllCouponCodes.jsx";

const ShopAllCoupons = () => {
  return (
    <div>
      <DashboardHeader />
      <div className="flex justify-between w-full">
        <div className="800px:w-[330px] w-[80px]">
          <DashboardSidebar active={9}></DashboardSidebar>
        </div>
        <div className="w-full justify-center flex">
          <AllCouponCodes />
        </div>
      </div>
    </div>
  );
};

export default ShopAllCoupons;
