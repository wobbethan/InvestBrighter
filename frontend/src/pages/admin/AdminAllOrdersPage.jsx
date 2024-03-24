import React, { useEffect, useState } from "react";
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
import {
  filterAllOrdersOfAdmin,
  getAllOrdersOfAdmin,
} from "../../redux/actions/order";
import axios from "axios";
import { server } from "../../Server";
import Loader from "../../components/Layout/Loader";

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

  const { user } = useSelector((state) => state.user);
  const { adminOrders, adminOrderLoading } = useSelector(
    (state) => state.order
  );
  const [productData, setProductData] = useState();

  useEffect(() => {
    setLoading(true);
    if (selectedSection !== "All Sections") {
      dispatch(filterAllOrdersOfAdmin(selectedSection, user._id));
    } else {
      dispatch(getAllOrdersOfAdmin(user._id));
    }

    setLoading(false);
  }, [selectedSection]);

  useEffect(() => {
    setLoading(true);
    dispatch(getAllOrdersOfAdmin(user._id));
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
    </div>
  );
};

export default AdminAllOrdersPage;
