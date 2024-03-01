import React, { useEffect, useState } from "react";

import {
  DataGrid,
  GridToolbar,
  GridToolbarColumnsButton,
  GridToolbarContainer,
  GridToolbarDensitySelector,
  GridToolbarExport,
  GridToolbarFilterButton,
} from "@material-ui/data-grid";
import { useDispatch, useSelector } from "react-redux";
import { getAllOrdersOfAdmin } from "../redux/actions/order";
import AdminHeader from "./components/Layout/AdminHeader";
import AdminSideBar from "./components/Admin/Layout/AdminSideBar";
import { AiOutlineDelete } from "react-icons/ai";
import { Button } from "@material-ui/core";
import { BiTransferAlt } from "react-icons/bi";
import { RxCross1 } from "react-icons/rx";
import styles from "../styles/styles";
import { getAllUsers } from "../redux/actions/user";
import { server } from "../Server";
import { toast } from "react-toastify";
import axios from "axios";

let options = {
  timeZone: "America/New_York",
  year: "numeric",
  month: "numeric",
  day: "numeric",
  hour12: true,
  minute: "numeric",
  hour: "numeric",
};

const AdminAllOrdersPage = () => {
  const dispatch = useDispatch();
  const { user, users } = useSelector((state) => state.user);
  const [open, setOpen] = useState(false);
  const [data, setData] = useState([]);
  const [transferUser, setTransferUser] = useState();
  const [orderID, setOrderID] = useState();
  const { adminOrders, adminOrderLoading } = useSelector(
    (state) => state.order
  );

  const transferOrder = async () => {
    const id = toast.loading("Transferring Order");
    await axios
      .put(`${server}/order/admin-transfer-orders/${orderID}/${transferUser}`)
      .then(res);

    toast.update(id, {
      render: "Order transferred",
      type: "success",
      isLoading: false,
    });

    dispatch(getAllOrdersOfAdmin(user._id));
    const d = adminOrders?.filter((order) => order.user._id.includes(user._id));
    setData(d);
    setOpen(false);
  };

  useEffect(() => {
    dispatch(getAllOrdersOfAdmin(user._id));
    const d = adminOrders?.filter((order) => order.user._id.includes(user._id));
    setData(d);
    dispatch(getAllUsers(user._id));
  }, []);

  const columns = [
    {
      field: "section",
      headerName: "Section",
      type: "string",
      minWidth: 130,
      flex: 0.7,
    },

    {
      field: "section",
      headerName: "Section",
      type: "string",
      minWidth: 130,
      flex: 0.7,
    },
    {
      field: "event",
      headerName: "Round",
      type: "string",
      minWidth: 130,
      flex: 0.7,
    },

    {
      field: "investor",
      headerName: "Investor",
      type: "string",
      minWidth: 130,
      flex: 0.7,
    },

    {
      field: "company",
      headerName: "Company",
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
      headerName: "Investment Date",
      type: "date",
      minWidth: 130,
      flex: 0.8,
    },
    {
      field: " ",
      flex: 1,
      minWidth: 150,
      headerName: "Transfer Investment",
      type: "number",
      sortable: false,
      renderCell: (params) => {
        return (
          <>
            <Button onClick={() => setOpen(true) || setOrderID(params.row.id)}>
              <BiTransferAlt size={20} />
            </Button>
          </>
        );
      },
    },
  ];

  const row = [];
  data &&
    data.forEach((item) => {
      row.push({
        id: item._id,
        section: item.user.section,
        event: item.event.name,
        investor: item.user.name,
        company: item.company.shop.name,
        itemsQty: item.quantity,
        total: "$" + item.totalPrice.toLocaleString(),
        createdAt: new Date(item?.createdAt).toLocaleString("en-US", options),
      });
    });
  return (
    <div>
      <AdminHeader />
      <div className="w-full flex">
        <div className="flex items-start justify-between w-full">
          <div className="w-[80px] 800px:w-[330px]">
            <AdminSideBar active={11} />
          </div>

          <div className="w-full min-h-[45vh] pt-5 rounded flex flex-col justify-center">
            <h3 className="text-[22px] font-Poppins pb-2">My Investments</h3>
            <div className="w-[97%] flex justify-center bg-white">
              <DataGrid
                rows={row}
                columns={columns}
                pageSizeOptions={[10, 20, 50]}
                disableSelectionOnClick
                autoHeight
                components={{ Toolbar: GridToolbar }}
              />
            </div>
          </div>
        </div>
        {open && (
          <div className="w-full fixed top-0 left-0 z-[999] bg-[#00000039] flex items-center justify-center h-screen">
            <div className="w-[95%] 800px:w-[40%] min-h-[20vh] bg-white rounded shadow p-5 flex flex-col items-center">
              <div className="w-full flex justify-end cursor-pointer">
                <RxCross1 size={25} onClick={() => setOpen(false)} />
              </div>
              <h3 className="text-[25px] text-center py-5 font-Poppins text-[#000000cb]">
                Please select a user to transfer to
              </h3>
              <div className="flex items-center justify-center w-[45%] m-2  ">
                <input
                  className="justify-center mt-2 text-center appearance-none block w-full px-3 h-[35px] border border-gray-300 rounded-[3px] placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  list="data"
                  placeholder="Search"
                  onChange={(e) => setTransferUser(e.target.value)}
                />
                <datalist id="data" className="justify-center">
                  {users.map((user) => (
                    <option value={user.email}>{user.name}</option>
                  ))}
                </datalist>
              </div>
              <div className="w-full flex items-center justify-center">
                <div
                  className={`${styles.button} text-white text-[18px] !h-[42px] mr-4`}
                  onClick={() => setOpen(false)}
                >
                  cancel
                </div>
                <div
                  className={`${styles.button} text-white text-[18px] !h-[42px] ml-4`}
                  onClick={() => transferOrder()}
                >
                  confirm
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminAllOrdersPage;
