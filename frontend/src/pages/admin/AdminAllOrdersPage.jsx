import React, { useEffect } from "react";
import AdminHeader from "../components/Layout/AdminHeader";
import AdminSideBar from "../components/Admin/Layout/AdminSideBar";
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
import { getAllOrdersOfAdmin } from "../../redux/actions/order";

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
  const { user } = useSelector((state) => state.user);
  const { adminOrders, adminOrderLoading } = useSelector(
    (state) => state.order
  );

  useEffect(() => {
    dispatch(getAllOrdersOfAdmin(user._id));
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
      headerName: "Order Date",
      type: "date",
      minWidth: 130,
      flex: 0.8,
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
            <AdminSideBar active={2} />
          </div>

          <div className="w-full min-h-[45vh] pt-5 rounded flex flex-col justify-center">
            <h3 className="text-[22px] font-Poppins pb-2">All Investments</h3>
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
      </div>
    </div>
  );
};

export default AdminAllOrdersPage;
