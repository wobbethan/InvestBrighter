import { Button } from "@material-ui/core";
import { DataGrid, GridToolbar } from "@material-ui/data-grid";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import Loader from "../Layout/Loader";
import { getAllOrdersOfShop } from "../../redux/actions/order";
import { AiOutlineArrowRight } from "react-icons/ai";

const AllOrders = () => {
  const { orders, isLoading } = useSelector((state) => state.order);
  const { seller } = useSelector((state) => state.seller);

  const dispatch = useDispatch();

  let options = {
    timeZone: "America/New_York",
    year: "numeric",
    month: "numeric",
    day: "numeric",
    hour12: true,
    minute: "numeric",
    hour: "numeric",
  };

  useEffect(() => {
    dispatch(getAllOrdersOfShop(seller._id));
  }, [dispatch]);

  const columns = [
    {
      field: "investor",
      headerName: "Investor",
      type: "string",
      minWidth: 130,
      flex: 0.7,
    },

    {
      field: "itemsQty",
      headerName: "Items Qty",
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

    {
      field: "createdAt",
      headerName: "Order Date",
      type: "date",
      minWidth: 130,
      flex: 0.8,
    },
  ];

  const row = [];

  orders &&
    orders.forEach((item) => {
      row.push({
        id: item._id,
        investor: item.user.name,
        itemsQty: item.quantity,
        total: "$" + item.totalPrice.toLocaleString(),
        createdAt: new Date(item?.createdAt).toLocaleString("en-US", options),
      });
    });

  return (
    <>
      {isLoading ? (
        <Loader />
      ) : (
        <div className="w-full mx-8 pt-1 mt-10 bg-white">
          <DataGrid
            rows={row}
            columns={columns}
            pageSizeOptions={[10, 20, 50]}
            disableSelectionOnClick
            autoHeight
            components={{ Toolbar: GridToolbar }}
          />
        </div>
      )}
    </>
  );
};

export default AllOrders;
