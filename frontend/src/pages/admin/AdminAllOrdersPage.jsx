import React, { useEffect, useState } from "react";
import AdminHeader from "../components/Layout/AdminHeader";
import AdminSideBar from "../components/Admin/Layout/AdminSideBar";
import { toast } from "react-toastify";
import { AiOutlineDelete } from "react-icons/ai";

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
import {
  filterAllOrdersOfAdmin,
  getAllOrdersOfAdmin,
} from "../../redux/actions/order";
import axios from "axios";
import { server } from "../../Server";
import Loader from "../../components/Layout/Loader";
import { Button } from "@material-ui/core";
import { RxCross1 } from "react-icons/rx";
import styles from "../../styles/styles";
import { BiTransferAlt } from "react-icons/bi";
import { getAllUsers } from "../../redux/actions/user";

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
  const [sections, setSections] = useState([]);
  const [selectedSection, setSelectedSection] = useState("All Sections");
  const [loading, setLoading] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState();
  const [orderDelete, setOrderDelete] = useState();
  const [open, setOpen] = useState(false);

  const [transferUser, setTransferUser] = useState();
  const [orderID, setOrderID] = useState();

  const { user, users } = useSelector((state) => state.user);
  const { adminOrders, adminOrderLoading } = useSelector(
    (state) => state.order
  );
  const [productData, setProductData] = useState();

  const handleDelete = async () => {
    const transfer = toast.loading("Deleting Order");
    await axios
      .delete(`${server}/order/admin-delete-orders/${orderDelete}`)
      .then((res) => {
        if (res.data.success == true) {
          toast.update(transfer, {
            render: "Order deleted",
            type: "success",
            isLoading: false,
            autoClose: 3000,
          });
        } else {
          toast.update(transfer, {
            render: "Order deletion failed",
            type: "error",
            isLoading: false,
            autoClose: 3000,
          });
        }
      });

    getOrders();

    setConfirmOpen(false);
  };

  const transferOrder = async () => {
    const transfer = toast.loading("Transferring Order");
    await axios
      .put(`${server}/order/admin-transfer-orders/${orderID}/${transferUser}`)
      .then((res) => {
        if (res.data.success == true) {
          toast.update(transfer, {
            render: "Order transferred",
            type: "success",
            isLoading: false,
            autoClose: 3000,
          });
        } else {
          toast.update(transfer, {
            render: "Order transfer failed",
            type: "error",
            isLoading: false,
            autoClose: 3000,
          });
        }
      });

    getOrders();

    setOpen(false);
  };

  const getOrders = () => {
    if (selectedSection !== "All Sections") {
      dispatch(filterAllOrdersOfAdmin(selectedSection, user._id));
    } else {
      dispatch(getAllOrdersOfAdmin(user._id));
    }
  };

  useEffect(() => {
    setLoading(true);
    getOrders();
    setLoading(false);
  }, [selectedSection]);

  useEffect(() => {
    setLoading(true);
    dispatch(getAllOrdersOfAdmin(user._id));
    dispatch(getAllUsers(user._id));
    setProductData(adminOrders);

    async function getInfo() {
      await axios
        .get(`${server}/section/get-sections/${user._id}`)
        .then((res) => {
          setSections(res.data.sections);
        });

      setLoading(false);
    }
    getInfo();
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
      minWidth: 75,
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
    {
      field: "delete",
      flex: 1,
      minWidth: 75,
      headerName: "Delete Investment",
      type: "number",
      sortable: false,
      renderCell: (params) => {
        return (
          <>
            <Button
              onClick={() =>
                setConfirmOpen(true) || setOrderDelete(params.row.id)
              }
            >
              <AiOutlineDelete size={20} />
            </Button>
          </>
        );
      },
    },
  ];

  const row = [];
  adminOrders &&
    adminOrders.forEach((item) => {
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
          <>
            {loading ? (
              <Loader></Loader>
            ) : (
              <div className="w-full min-h-[45vh] pt-5 rounded flex flex-col justify-center">
                <h3 className="text-[22px] font-bold font-Poppins pb-2">
                  All Investments
                </h3>
                <div className="flex flex-col mt-2">
                  <label className="pb-2 font-semibold text-lg">Section:</label>
                  <select
                    value={selectedSection}
                    onChange={(e) => setSelectedSection(e.target.value)}
                    className="w-[20%]  mb-4 border h-[35px] rounded-[5px]"
                  >
                    <option value={"All Sections"} key={"All Sections"}>
                      {"All Sections"}
                    </option>
                    {sections &&
                      sections.map((i, index) => (
                        <option value={i.name} key={index}>
                          {i.name}
                        </option>
                      ))}
                  </select>
                </div>
                <div className="w-[100%] flex justify-center bg-white">
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
            )}
          </>
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
                <option value={user.email}>{user.name}</option>
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
      {confirmOpen && (
        <div className="w-full fixed top-0 left-0 z-[999] bg-[#00000039] flex items-center justify-center h-screen">
          <div className="w-[95%] 800px:w-[40%] min-h-[20vh] bg-white rounded shadow p-5">
            <div className="w-full flex justify-end cursor-pointer">
              <RxCross1 size={25} onClick={() => setConfirmOpen(false)} />
            </div>
            <h3 className="text-[25px] text-center py-5 font-Poppins text-[#000000cb]">
              Are you sure you want to delete this investment?
            </h3>
            <div className="w-full flex items-center justify-center">
              <div
                className={`${styles.button} text-white text-[18px] !h-[42px] mr-4`}
                onClick={() => setConfirmOpen(false)}
              >
                cancel
              </div>
              <div
                className={`${styles.button} text-white text-[18px] !h-[42px] ml-4`}
                onClick={() => setConfirmOpen(false) || handleDelete()}
              >
                confirm
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminAllOrdersPage;
