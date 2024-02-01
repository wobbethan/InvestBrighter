import React from "react";
import { AiOutlineGift } from "react-icons/ai";
import { MdOutlineLocalOffer } from "react-icons/md";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { FiPackage, FiShoppingBag } from "react-icons/fi";
import { BiMessageSquareDetail } from "react-icons/bi";
import { backend_url } from "../../../Server";
import { IoHomeOutline } from "react-icons/io5";
import { FaHome } from "react-icons/fa";
const DashboardHeader = () => {
  const { seller } = useSelector((state) => state.seller);
  return (
    <div className="w-full h-[80px] bg-white shadow sticky top-0 left-0 z-30 flex items-center justify-between px-4">
      <div>
        <Link to="/">
          <FaHome size={30} />
        </Link>
      </div>
      <div className="flex items-center">
        <div className="flex items-center mr-4">
          <Link to={"/dashboard-products"} className="800px:block hidden">
            <FiShoppingBag
              color="#555"
              size={30}
              className="mx-5 cursor-pointer"
              title="Products"
            />
          </Link>
          <Link to={"/dashboard-orders"} className="800px:block hidden">
            <FiPackage
              color="#555"
              size={30}
              className="mx-5 cursor-pointer"
              title="Orders"
            />
          </Link>

          <Link to={`/shop/${seller._id}`}>
            <img
              src={`${backend_url}${seller.avatar}`}
              alt=""
              className="w-[50px] h-[50px] rounded-full object-cover"
              title="Shop Page"
            />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default DashboardHeader;
