import React, { useEffect, useState } from "react";
import { backend_url, server } from "../../Server";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { RxCross1 } from "react-icons/rx";
import { getAllMembersShop } from "../../redux/actions/seller";
import { DataGrid, GridToolbar } from "@material-ui/data-grid";
import { Button } from "@material-ui/core";
import { AiOutlineDelete } from "react-icons/ai";
import { CiEdit } from "react-icons/ci";
import styles from "../../styles/styles";

const ShopTeamMembers = () => {
  const { members, seller, isSeller } = useSelector((state) => state.seller);
  const [open, setOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [ownership, setOwnership] = useState();
  const [role, setRole] = useState();
  const [userId, setUserId] = useState();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const dispatch = useDispatch();

  const updateUser = async (id, r, o) => {
    await axios
      .put(`${server}/shop/shop-update-member/${id}/${r}/${o}/${seller._id}`)
      .then((res) => {
        toast.success(res.message);
      })
      .catch((error) => {});
    dispatch(getAllMembersShop(seller._id));
    setOpen(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await axios
      .get(`${server}/shop/shop-add-member/${seller._id}/${email}`)
      .then(() => {
        setEmail("");
        toast.success("Member Added");
      })
      .catch((error) => {
        toast.error(error.message);
      });
    dispatch(getAllMembersShop(seller._id));
  };

  const removeUser = async (id) => {
    await axios
      .get(`${server}/shop/shop-remove-member/${id}/${seller._id}`)
      .then(() => {})
      .catch((error) => {});
    dispatch(getAllMembersShop(seller._id));
  };

  useEffect(() => {
    dispatch(getAllMembersShop(seller._id));
  }, []);

  const columns = [
    {
      field: "role",
      headerName: "Role",
      type: "string",
      minWidth: 130,
      flex: 0.7,
    },
    {
      field: "member",
      headerName: "Name",
      type: "string",
      minWidth: 130,
      flex: 0.7,
    },

    {
      field: "ownership",
      headerName: "Ownership",
      type: "string",
      minWidth: 130,
      flex: 0.8,
    },

    {
      field: "editMember",
      flex: 0.8,
      minWidth: 130,
      headerName: "Edit",
      type: "number",
      sortable: false,
      renderCell: (params) => {
        return (
          <>
            <Button
              onClick={() =>
                setOpen(true) ||
                setName(params.row.member) ||
                setOwnership(params.row.ownership) ||
                setRole(params.row.role) ||
                setUserId(params.row.id)
              }
            >
              <CiEdit size={20} />
            </Button>
          </>
        );
      },
    },
    {
      field: "removeMember",
      flex: 0.7,
      minWidth: 130,
      headerName: "Remove Member",
      type: "number",
      sortable: false,
      renderCell: (params) => {
        return (
          <>
            <Button
              onClick={() => setConfirmOpen(true) || setUserId(params.row.id)}
            >
              <AiOutlineDelete size={20} />
            </Button>
          </>
        );
      },
    },
  ];

  const row = [];

  members &&
    members.forEach((member) => {
      row.push({
        id: member._id,
        role: member.companyRole,
        member: member.name,
        ownership: "$" + member.companyInvestment.toLocaleString(),
      });
    });

  return (
    <div className="flex flex-col w-full items-center">
      <div className="m-8">
        <div className="flex flex-col justify-center w-full">
          <div className="relative">
            <img
              src={`${backend_url}${seller.avatar}`}
              className="w-[150px] h-[150px] rounded-full object-cover border-[3px] border-[#3ad132]"
              alt=""
            />
          </div>
        </div>
      </div>

      <div className="text-center">
        <form onSubmit={handleSubmit}>
          <div>
            <label className="pb-2">Add Users by email</label>
            <input
              type="email"
              value={email}
              className="mt-2 appearance-none block w-full px-3 h-[35px] border border-gray-300 rounded-[3px] placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter user email..."
            />
          </div>
          <div>
            <input
              type="submit"
              name=""
              id=""
              value="Add"
              className="mt-2 cursor-pointer appearance-none block w-full px-3 h-[35px] border border-gray-300 rounded-[3px] placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>
        </form>
      </div>
      <div className="w-[90%] mx-8 pt-1 mt-10 bg-white">
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
        <div className="fixed top-0 left-0 w-full h-full bg-[#00000062] z-[2000] flex items-center justify-center">
          <div className="w-[90%] 800px:w-[40%] h-[40vh] bg-white rounded-md shadow p-3">
            <div className="w-full flex justify-end">
              <RxCross1
                size={30}
                className="cursor-pointer"
                onClick={() => setOpen(false)}
              />
            </div>
            <h5 className="text-[30px] font-Poppins text-center">
              {`Editing: ${name}`}
            </h5>
            {/* Form */}
            <form>
              <br />
              <div>
                <label className="pb-2">Role</label>
                <input
                  type="text"
                  required
                  name="name"
                  value={role}
                  className="mt-2 appearance-none block w-full px-3 h-[35px] border border-gray-300 rounded-[3px] placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  onChange={(e) => setRole(e.target.value)}
                  placeholder="Enter your coupon code name..."
                />
              </div>
              <br />
              <div>
                <label className="pb-2">Ownership</label>
                <input
                  type="number"
                  required
                  name="value"
                  value={ownership}
                  className="mt-2 appearance-none block w-full px-3 h-[35px] border border-gray-300 rounded-[3px] placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  onChange={(e) => setOwnership(e.target.value)}
                  placeholder="Enter ownership..."
                />
              </div>
              <div>
                <input
                  type="submit"
                  onClick={() => updateUser(userId, role, ownership)}
                  value="Update"
                  className="mt-8 appearance-none block w-full px-3 h-[35px] border border-gray-300 rounded-[3px] placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
            </form>
          </div>
        </div>
      )}
      {confirmOpen && (
        <div className="w-full fixed top-0 left-0 z-[999] bg-[#00000039] flex items-center justify-center h-full">
          <div className="w-[95%] 800px:w-[40%] min-h-[20vh] bg-white rounded shadow p-5">
            <div className="w-full flex justify-end cursor-pointer">
              <RxCross1 size={25} onClick={() => setConfirmOpen(false)} />
            </div>
            <h3 className="text-[25px] text-center py-5 font-Poppins text-[#000000cb]">
              Are you sure you want to remove this member?
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
                onClick={() => setConfirmOpen(false) || removeUser(userId)}
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

export default ShopTeamMembers;
