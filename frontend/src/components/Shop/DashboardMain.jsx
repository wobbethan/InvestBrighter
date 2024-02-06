import React, { useEffect, useState } from "react";
import { AiOutlineArrowRight, AiOutlineMoneyCollect } from "react-icons/ai";
import styles from "../../styles/styles";
import { Link } from "react-router-dom";
import { MdBorderClear } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { getAllOrdersOfShop } from "../../redux/actions/order";
import { getAllProductsShop } from "../../redux/actions/product";
import { Button } from "@material-ui/core";
import { DataGrid } from "@material-ui/data-grid";
import { GiReceiveMoney } from "react-icons/gi";
import { SlRefresh } from "react-icons/sl";
import { FaTable } from "react-icons/fa";

const DashboardMain = () => {
  const dispatch = useDispatch();
  const { orders } = useSelector((state) => state.order);
  const { seller } = useSelector((state) => state.seller);
  const { products } = useSelector((state) => state.products);

  useEffect(() => {
    dispatch(getAllOrdersOfShop(seller._id));
    dispatch(getAllProductsShop(seller._id));
  }, [dispatch]);

  const columns = [
    {
      field: "user",
      headerName: "Investor",
      type: "string",
      minWidth: 130,
      flex: 0.7,
    },
    {
      field: "itemsQty",
      headerName: "Checks",
      type: "number",
      minWidth: 130,
      flex: 0.7,
    },

    {
      field: "total",
      headerName: "Total",
      type: "number",
      minWidth: 130,
      flex: 0.8,
    },
  ];

  const row = [];

  orders &&
    orders.forEach((item) => {
      row.push({
        id: item._id,
        user: item.user.name,
        itemsQty: item.quantity,
        total: "$" + item.totalPrice.toLocaleString(),
      });
    });
  return (
    <div className="w-full p-8">
      <h3 className="text-[22px] font-Poppins pb-2">Overview</h3>
      <div className="w-full block 800px:flex items-center justify-between">
        <div className="w-full mb-4 800px:w-[30%] min-h-[20vh] bg-white shadow rounded px-2 py-5 flex flex-col items-center">
          <div className="flex items-center self-start">
            <GiReceiveMoney size={30} className="mr-2" />
            <h3
              className={`${styles.productTitle} !text-[18px] leading-5 !font-[400] text-[#00000085]`}
            >
              Capital Raised <span className="text-[16px]"></span>
            </h3>
          </div>
          <h5 className="pt-4 text-[36px] font-[500]">
            ${seller.balance.toLocaleString()}
          </h5>
        </div>

        <div className="w-full mb-4 800px:w-[30%] min-h-[20vh] bg-white shadow rounded px-2 py-5 flex flex-col items-center">
          <div className="flex items-center self-start">
            <FaTable size={30} className="mr-2" fill="#00000085" />
            <h3
              className={`${styles.productTitle} !text-[18px] leading-5 !font-[400] text-[#00000085]`}
            >
              All Investments
            </h3>
          </div>
          <h5 className="pt-2 text-[36px] font-[500]">
            {orders && orders.length}
          </h5>
          <Link to="/dashboard-orders">
            <h5 className="pt-4 pl-2 text-[#077f9c]">View Investments</h5>
          </Link>
        </div>

        <div className="w-full mb-4 800px:w-[30%] min-h-[20vh] bg-white shadow rounded px-2 py-5 flex flex-col items-center">
          <div className="flex items-center self-start">
            <SlRefresh size={30} className="mr-2" fill="#00000085" />
            <h3
              className={`${styles.productTitle} !text-[18px] leading-5 !font-[400] text-[#00000085]`}
            >
              Rounds
            </h3>
          </div>
          <h5 className="pt-2 text-[36px] font-[500]">
            {products && products.length}
          </h5>
          <Link to="/dashboard-products">
            <h5 className="pt-4 pl-2 text-[#077f9c]">View Rounds</h5>
          </Link>
        </div>
      </div>
      <br />
      <h3 className="text-[22px] font-Poppins pb-2">Latest Investments</h3>
      <div className="w-full min-h-[45vh] bg-white rounded">
        <DataGrid
          rows={row}
          columns={columns}
          pageSize={10}
          disableSelectionOnClick
          autoHeight
        />
      </div>
    </div>
  );
};

export default DashboardMain;
