import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { DataGrid, GridToolbar } from "@material-ui/data-grid";
import { AiOutlineDelete, AiOutlineEye } from "react-icons/ai";
import { Button } from "@material-ui/core";
import styles from "../styles/styles";
import { RxCross1 } from "react-icons/rx";
import axios from "axios";
import { server } from "../Server";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import { getAllSellers } from "../redux/actions/seller";
import { FaEdit } from "react-icons/fa";

const AdminAllCompanies = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.user);
  const { sellers } = useSelector((state) => state.seller);
  const [open, setOpen] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);

  const [shopName, setShopName] = useState();
  const [description, setDescription] = useState();
  const [valuation, setValuation] = useState();
  const [finalAc, setFinalAc] = useState();
  const [avatar, setAvatar] = useState();

  const [userId, setUserId] = useState("");
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
    dispatch(getAllSellers(user._id));
  }, [dispatch]);

  const handleDelete = async (id) => {
    await axios
      .delete(`${server}/shop/delete-seller/${id}`, { withCredentials: true })
      .then((res) => {
        toast.success(res.data.message);
      });

    dispatch(getAllSellers(user._id));
  };

  const handleSubmit = async (e) => {};

  useEffect(() => {
    setShopName();
    setAvatar();
    setDescription();
    setFinalAc();
    setValuation();
    async function getInfo() {
      if (userId !== "") {
        await axios
          .get(`${server}/shop/get-shop-info/${userId}`)
          .then((res) => {
            setShopName(res.data.shop.name);
            setAvatar(res.data.shop.avatar.url);
            setDescription(res.data.shop.description);
            setFinalAc(res.data.shop.finalAcquisition);
            setValuation(res.data.shop.valuation);
          });
      }
    }
    getInfo();
  }, [userId]);

  const columns = [
    {
      field: "section",
      headerName: "Section",
      minWidth: 130,
      flex: 0.7,
    },
    {
      field: "name",
      headerName: "Name",
      minWidth: 130,
      flex: 0.7,
    },
    {
      field: "email",
      headerName: "Email",
      type: "text",
      minWidth: 130,
      flex: 0.7,
    },

    {
      field: "joinedAt",
      headerName: "Created",
      type: "date",
      minWidth: 130,
      flex: 0.8,
    },
    {
      field: "mems",
      headerName: "Members",
      type: "number",
      minWidth: 130,
      flex: 0.8,
    },
    {
      field: " edit",
      flex: 1,
      minWidth: 150,
      headerName: "Edit Company",
      type: "number",
      sortable: false,
      renderCell: (params) => {
        return (
          <>
            <Button onClick={() => setUserId(params.id) || setOpenEdit(true)}>
              <FaEdit size={20} />
            </Button>
          </>
        );
      },
    },
    {
      field: "  ",
      flex: 1,
      minWidth: 150,
      headerName: "View Company",
      type: "number",
      sortable: false,
      renderCell: (params) => {
        return (
          <>
            <Link to={`/shop/preview/${params.id}`}>
              <Button>
                <AiOutlineEye size={20} />
              </Button>
            </Link>
          </>
        );
      },
    },
    {
      field: " ",
      flex: 1,
      minWidth: 150,
      headerName: "Delete Company",
      type: "number",
      sortable: false,
      renderCell: (params) => {
        return (
          <>
            <Button onClick={() => setUserId(params.id) || setOpen(true)}>
              <AiOutlineDelete size={20} />
            </Button>
          </>
        );
      },
    },
  ];

  const row = [];
  sellers &&
    sellers.forEach((item) => {
      row.push({
        id: item._id,
        section: item.section,
        name: item?.name,
        email: item?.email,
        mems:
          item?.teamMembers && item?.teamMembers.length > 0
            ? item?.teamMembers.length
            : 0,
        joinedAt: new Date(item.createdAt).toLocaleString("en-US", options),
      });
    });

  return (
    <div className="w-full flex justify-center pt-5">
      <div className="w-[97%]">
        <h3 className="text-[22px] font-Poppins pb-2">All Companies</h3>
        <div className="w-full min-h-[45vh] bg-white rounded">
          <DataGrid
            rows={row}
            columns={columns}
            pageSizeOptions={[10, 20, 50]}
            disableSelectionOnClick
            autoHeight
            components={{ Toolbar: GridToolbar }}
          />
        </div>
        {open && (
          <div className="w-full fixed top-0 left-0 z-[999] bg-[#00000039] flex items-center justify-center h-screen">
            <div className="w-[95%] 800px:w-[40%] min-h-[20vh] bg-white rounded shadow p-5">
              <div className="w-full flex justify-end cursor-pointer">
                <RxCross1 size={25} onClick={() => setOpen(false)} />
              </div>
              <h3 className="text-[25px] text-center py-5 font-Poppins text-[#000000cb]">
                Are you sure you want to delete this company?
              </h3>
              <div className="w-full flex items-center justify-center">
                <div
                  className={`${styles.button} text-white text-[18px] !h-[42px] mr-4`}
                  onClick={() => setOpen(false)}
                >
                  cancel
                </div>
                <div
                  className={`${styles.button} text-white text-[18px] !h-[42px] ml-4`}
                  onClick={() => setOpen(false) || handleDelete(userId)}
                >
                  confirm
                </div>
              </div>
            </div>
          </div>
        )}
        {openEdit && (
          <div className="w-full fixed top-0 left-0 z-[999] bg-[#00000039] flex items-center justify-center h-screen">
            <div className="w-[95%] 800px:w-[40%] min-h-[20vh] bg-white rounded shadow p-5">
              <div className="w-full flex justify-end cursor-pointer">
                <RxCross1 size={25} onClick={() => setOpenEdit(false)} />
              </div>
              <h3 className="text-[25px] text-center py-5 font-Poppins text-[#000000cb] flex items-center flex-col justify-center">
                <img
                  src={avatar}
                  alt=""
                  className="w-[125px] h-[125px] rounded-full mb-2 object-cover"
                />
                Company information
              </h3>
              <form onSubmit={handleSubmit} aria-required={true}>
                <br />
                <div>
                  <label className="pb-2">Name</label>
                  <input
                    type="text"
                    required
                    name="name"
                    value={shopName}
                    className="mt-2 appearance-none block w-full px-3 h-[35px] border border-gray-300 rounded-[3px] placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    onChange={(e) => setShopName(e.target.value)}
                    placeholder="Enter shop name..."
                  />
                </div>
                <br />
                <div>
                  <label className="pb-2">Description</label>
                  <textarea
                    cols="30"
                    rows="8"
                    type="text"
                    required
                    name="description"
                    value={description}
                    className="mt-2 appearance-none block w-full pt-3 px-3  border border-gray-300 rounded-[3px] placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Enter description..."
                  />
                </div>

                <div>
                  <label className="pb-2">Valuation</label>
                  <input
                    type="number"
                    value={valuation}
                    onChange={(e) => setValuation(e.target.value)}
                    className={`${styles.input} !w-[95%] mb-4 800px:mb-0`}
                    required
                  />
                </div>

                <div>
                  <label className="pb-2">Final Acquisition</label>
                  <input
                    type="number"
                    value={finalAc}
                    onChange={(e) => setFinalAc(e.target.value)}
                    className={`${styles.input} !w-[95%] mb-4 800px:mb-0`}
                    required
                  />
                </div>

                <br />
                <div>
                  <input
                    type="submit"
                    value="Save"
                    className="mt-2 cursor-pointer appearance-none block w-full px-3 h-[35px] border border-gray-300 rounded-[3px] placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminAllCompanies;
