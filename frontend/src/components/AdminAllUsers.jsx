import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { DataGrid, GridToolbar } from "@material-ui/data-grid";
import { AiOutlineDelete } from "react-icons/ai";
import { Button } from "@material-ui/core";
import styles from "../styles/styles";
import { RxCross1 } from "react-icons/rx";
import axios from "axios";
import { server } from "../Server";
import { toast } from "react-toastify";
import { getAllUsers } from "../redux/actions/user";
import { FaEdit } from "react-icons/fa";
import Loader from "./Layout/Loader";

const AdminAllUsers = () => {
  const dispatch = useDispatch();
  const { users, user } = useSelector((state) => state.user);
  const [open, setOpen] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [name, setName] = useState();
  const [userId, setUserId] = useState("");
  const [email, setEmail] = useState();
  const [avatar, setAvatar] = useState();
  const [balance, setBalance] = useState();
  const [company, setCompany] = useState();
  const [sections, setSections] = useState([]);
  const [selectedSection, setSelectedSection] = useState();
  const [companies, setCompanies] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState();
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

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
    async function getInfo() {
      setLoading(true);

      if (userId !== "") {
        await axios
          .get(`${server}/section/get-sections/${user._id}`)
          .then((res) => {
            setSections(res.data.sections);
          });
        await axios
          .get(`${server}/user/get-user-info/${userId}`)
          .then((res) => {
            setBalance(res.data.user.accountBalance);
            setAvatar(res.data.user.avatar.url);
          });
      }
      setLoading(false);
    }
    getInfo();
  }, [userId]);

  useEffect(() => {
    axios
      .get(`${server}/shop/all-companies-section/${selectedSection}`)
      .then((res) => {
        setCompanies(res.data.sellers);
      });
  }, [selectedSection]);

  const handleDelete = async (id) => {
    await axios
      .delete(`${server}/user/delete-user/${id}`, { withCredentials: true })
      .then((res) => {
        toast.success(res.data.message);
      });

    dispatch(getAllUsers(user._id));
  };

  const handleSubmit = async (e) => {
    setLoading(true);
    e.preventDefault();
    await axios
      .put(`${server}/user/admin-update-user`, {
        userId,
        name,
        email,
        selectedSection,
        balance,
        selectedCompany,
      })
      .then((res) => {
        dispatch(getAllUsers(user._id));
        toast.success(res.data.message);
      })
      .catch((err) => {
        toast.error(err.response.data.message);
      });
    setLoading(false);
  };

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
      headerName: "Created on",
      type: "date",
      minWidth: 130,
      flex: 0.8,
    },
    {
      field: "team",
      headerName: "Company",
      type: "text",
      minWidth: 130,
      flex: 0.8,
    },
    {
      field: "balance",
      headerName: "Balance",
      type: "number",
      minWidth: 130,
      flex: 0.8,
    },
    {
      field: " edit",
      flex: 1,
      minWidth: 150,
      headerName: "Edit User",
      type: "number",
      sortable: false,
      renderCell: (params) => {
        return (
          <>
            <Button
              onClick={() =>
                setUserId(params.row.id) ||
                setOpenEdit(true) ||
                setName(params.row.name) ||
                setEmail(params.row.email) ||
                setSelectedSection(params.row.section) ||
                setSelectedCompany(params.row.team) ||
                setBalance(params.row.balance)
              }
            >
              <FaEdit size={20} />
            </Button>
          </>
        );
      },
    },

    {
      field: " ",
      flex: 1,
      minWidth: 150,
      headerName: "Delete User",
      type: "number",
      sortable: false,
      renderCell: (params) => {
        return (
          <>
            <Button onClick={() => setUserId(params.row.id) || setOpen(true)}>
              <AiOutlineDelete size={20} />
            </Button>
          </>
        );
      },
    },
  ];

  const row = [];
  users &&
    users.forEach((item) => {
      row.push({
        section: item?.section,
        id: item?._id,
        name: item?.name,
        email: item?.email,
        joinedAt: new Date(item?.createdAt).toLocaleString("en-US", options),
        balance: "$" + item?.accountBalance.toLocaleString(),
        team: item.companyName,
      });
    });

  return (
    <>
      {loading ? (
        <Loader></Loader>
      ) : (
        <div className="w-full flex justify-center pt-5">
          <div className="w-[97%]">
            <h3 className="text-[22px] font-Poppins pb-2">All Users</h3>
            <div className="w-full min-h-[45vh] bg-white rounded">
              <DataGrid
                rows={row}
                columns={columns}
                pageSizeOptions={[10, 20, 50]}
                disableSelectionOnClick
                autoHeight
                components={{ Toolbar: GridToolbar }}
                throttleRowsMs={1000}
              />
            </div>
            {open && (
              <div className="w-full fixed top-0 left-0 z-[999] bg-[#00000039] flex items-center justify-center h-screen">
                <div className="w-[95%] 800px:w-[40%] min-h-[20vh] bg-white rounded shadow p-5">
                  <div className="w-full flex justify-end cursor-pointer">
                    <RxCross1 size={25} onClick={() => setOpen(false)} />
                  </div>
                  <h3 className="text-[25px] text-center py-5 font-Poppins text-[#000000cb]">
                    Are you sure you want to delete this user?
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
              <div className="w-full fixed top-0 left-0 z-[999] bg-[#00000039] flex items-center justify-center h-screen overflow-scroll">
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
                    User information
                  </h3>
                  <form onSubmit={handleSubmit} aria-required={true}>
                    <br />
                    <div>
                      <label className="pb-2">Name</label>
                      <input
                        type="text"
                        required
                        name="name"
                        value={name}
                        className="mt-2 appearance-none block w-full px-3 h-[35px] border border-gray-300 rounded-[3px] placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Enter student name..."
                      />
                    </div>
                    <br />
                    <div>
                      <label className="pb-2">Email</label>
                      <input
                        type="email"
                        required
                        name="Email"
                        value={email}
                        className="mt-2 appearance-none block w-full px-3 h-[35px] border border-gray-300 rounded-[3px] placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter student email..."
                      />
                    </div>
                    <br />
                    <div>
                      <label className="pb-2">Section</label>
                      <select
                        value={selectedSection}
                        onChange={(e) => setSelectedSection(e.target.value)}
                        className="w-full mt-2 border h-[35px] rounded-[5px]"
                      >
                        {sections &&
                          sections.map((i, index) => (
                            <option value={i.name} key={index}>
                              {i.name}
                            </option>
                          ))}
                      </select>
                    </div>
                    <br />
                    <div>
                      <label className="pb-2">Account Balance</label>
                      <input
                        type="number"
                        name="balance"
                        value={balance}
                        className="mt-2 appearance-none block w-full px-3 h-[35px] border border-gray-300 rounded-[3px] placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        onChange={(e) => setBalance(e.target.value)}
                        placeholder="Enter account balance"
                      />
                    </div>
                    <br />
                    <div>
                      <label className="pb-2">Company</label>
                      <select
                        value={selectedCompany}
                        onChange={(e) => setSelectedCompany(e.target.value)}
                        className="w-full mt-2 border h-[35px] rounded-[5px]"
                      >
                        <option value={"Not Assigned"} key={"Not Assigned"}>
                          {"Not Assigned"}
                        </option>
                        {companies &&
                          companies.map((i, index) => (
                            <option value={i.name} key={index}>
                              {i.name}
                            </option>
                          ))}
                      </select>
                    </div>
                    <br />
                    <div className="w-full flex items-center justify-center ">
                      <h1
                        className="text-center hover:text-cyan-700 cursor-pointer"
                        onClick={() =>
                          navigate(`/admin/change-password/${userId}`, {
                            id: userId,
                          })
                        }
                      >
                        Change Password
                      </h1>
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
      )}
    </>
  );
};

export default AdminAllUsers;
