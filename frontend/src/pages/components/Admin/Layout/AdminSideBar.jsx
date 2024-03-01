import React from "react";
import { FiShoppingBag } from "react-icons/fi";
import { GrWorkshop } from "react-icons/gr";
import { RxDashboard } from "react-icons/rx";
import { CiMoneyBill, CiSettings } from "react-icons/ci";
import { Link } from "react-router-dom";
import { HiOutlineUserGroup } from "react-icons/hi";
import { BsHandbag } from "react-icons/bs";
import { MdManageHistory, MdOutlineLocalOffer } from "react-icons/md";
import { AiOutlineSetting } from "react-icons/ai";
import { GrUserAdmin, GrGroup } from "react-icons/gr";
import { FaCalendarPlus, FaChartBar } from "react-icons/fa";
import { BiTransferAlt } from "react-icons/bi";

const AdminSideBar = ({ active }) => {
  return (
    <div className="w-full h-[90vh] bg-white shadow-sm overflow-y-scroll sticky top-0 left-0 z-10">
      {/* single item */}

      <div className="w-full flex items-center p-4">
        <Link to="/admin/admin-orders" className="w-full flex items-center">
          <FaChartBar
            size={30}
            color={`${active === 11 ? "crimson" : "#555"}`}
          />
          <h5
            className={`hidden 800px:block pl-2 text-[18px] font-[400] ${
              active === 11 ? "text-[crimson]" : "text-[#555]"
            }`}
          >
            All Investments
          </h5>
        </Link>
      </div>

      <div className="w-full flex items-center p-4">
        <Link to="/admin/admin-companies" className="w-full flex items-center">
          <GrWorkshop
            size={30}
            color={`${active === 3 ? "crimson" : "#555"}`}
          />
          <h5
            className={`hidden 800px:block pl-2 text-[18px] font-[400] ${
              active === 3 ? "text-[crimson]" : "text-[#555]"
            }`}
          >
            All Companies
          </h5>
        </Link>
      </div>

      <div className="w-full flex items-center p-4">
        <Link to="/admin/admin-users" className="w-full flex items-center">
          <HiOutlineUserGroup
            size={30}
            color={`${active === 4 ? "crimson" : "#555"}`}
          />
          <h5
            className={`hidden 800px:block pl-2 text-[18px] font-[400] ${
              active === 4 ? "text-[crimson]" : "text-[#555]"
            }`}
          >
            All Users
          </h5>
        </Link>
      </div>

      <div className="w-full flex items-center p-4">
        <Link
          to="/admin/investment-rounds"
          className="w-full flex items-center"
        >
          <FaCalendarPlus
            size={30}
            color={`${active === 6 ? "crimson" : "#555"}`}
          />
          <h5
            className={`hidden 800px:block pl-2 text-[18px] font-[400] ${
              active === 6 ? "text-[crimson]" : "text-[#555]"
            }`}
          >
            Create Round
          </h5>
        </Link>
      </div>

      <div className="w-full flex items-center p-4">
        <Link to="/admin/manage-rounds" className="w-full flex items-center">
          <MdManageHistory
            size={30}
            color={`${active === 10 ? "crimson" : "#555"}`}
          />
          <h5
            className={`hidden 800px:block pl-2 text-[18px] font-[400] ${
              active === 10 ? "text-[crimson]" : "text-[#555]"
            }`}
          >
            Manage Rounds
          </h5>
        </Link>
      </div>

      <div className="w-full flex items-center p-4">
        <Link to="/admin/manage-sections" className="w-full flex items-center">
          <GrGroup size={30} color={`${active === 7 ? "crimson" : "#555"}`} />
          <h5
            className={`hidden 800px:block pl-2 text-[18px] font-[400] ${
              active === 7 ? "text-[crimson]" : "text-[#555]"
            }`}
          >
            Manage Sections
          </h5>
        </Link>
      </div>

      <div className="w-full flex items-center p-4">
        <Link to="/admin/manage-admins" className="w-full flex items-center">
          <GrUserAdmin
            size={30}
            color={`${active === 8 ? "crimson" : "#555"}`}
          />
          <h5
            className={`hidden 800px:block pl-2 text-[18px] font-[400] ${
              active === 8 ? "text-[crimson]" : "text-[#555]"
            }`}
          >
            Manage Admins
          </h5>
        </Link>
      </div>

      <div className="w-full flex items-center p-4">
        <Link to="/profile" className="w-full flex items-center">
          <AiOutlineSetting
            size={30}
            color={`${active === 9 ? "crimson" : "#555"}`}
          />
          <h5
            className={`hidden 800px:block pl-2 text-[18px] font-[400] ${
              active === 9 ? "text-[crimson]" : "text-[#555]"
            }`}
          >
            Settings
          </h5>
        </Link>
      </div>
    </div>
  );
};

export default AdminSideBar;
