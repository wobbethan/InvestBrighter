import React, { useEffect, useState } from "react";
import { backend_url, server } from "../../Server";
import { useDispatch, useSelector } from "react-redux";
import {
  AiOutlineCamera,
  AiOutlineArrowRight,
  AiOutlineDelete,
} from "react-icons/ai";
import { Link } from "react-router-dom";
import { Button } from "@material-ui/core";
import { DataGrid, GridToolbar } from "@material-ui/data-grid";
import { MdOutlineTrackChanges } from "react-icons/md";
import styles from "../../styles/styles";
import { loadUser, updateUserInformation } from "../../redux/actions/user";
import { toast } from "react-toastify";
import axios from "axios";
import { getAllMembersShop } from "../../redux/actions/seller";
import { getAllOrdersOfUser } from "../../redux/actions/order";

const ProfileContent = ({ active }) => {
  const { user, error } = useSelector((state) => state.user);

  const [name, setName] = useState(user && user.name);
  const [email, setEmail] = useState(user && user.email);
  const [section, setSection] = useState(user && user.section);
  const [password, setPassword] = useState("");
  const [avatar, setAvatar] = useState(null);
  const [members, setMembers] = useState([]);
  const [shopInfo, setShopInfo] = useState([]);

  const dispatch = useDispatch();

  const handleImage = async (e) => {
    const reader = new FileReader();

    reader.onload = () => {
      if (reader.readyState === 2) {
        setAvatar(reader.result);
        axios
          .put(
            `${server}/user/update-avatar`,
            { avatar: reader.result },
            {
              withCredentials: true,
            }
          )
          .then((response) => {
            dispatch(loadUser());
            toast.success("avatar updated successfully!");
          })
          .catch((error) => {
            toast.error(error);
          });
      }
    };

    reader.readAsDataURL(e.target.files[0]);
  };

  useEffect(() => {
    const getMembers = async () => {
      await axios
        .get(`${server}/shop/get-all-members-shop/${user.companyId}`)
        .then((response) => {
          setMembers(response.data.members);
        })
        .catch((err) => {
          toast.error(err);
        });
      await axios
        .get(`${server}/shop/get-shop-info/${user.companyId}`)
        .then((response) => {
          setShopInfo(response.data.shop);
        })
        .catch((err) => {
          toast.error(err);
        });
    };
    getMembers();
  }, []);

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(
      updateUserInformation(user?.email, name, email, password, section)
    );
  };

  return (
    <div className="w-full">
      {/* Profile Page */}
      {active === 1 && (
        <>
          <div>
            <div className="flex justify-center w-full">
              <div className="relative">
                <img
                  src={`${user?.avatar.url}`}
                  className="w-[150px] h-[150px] rounded-full object-cover border-[3px] border-[#3ad132]"
                  alt=""
                />

                <div className="w-[30px] h-[30px] bg-[#E3E9EE] rounded-full flex items-center justify-center  absolute bottom-[5px] right-[5px]">
                  <input
                    type="file"
                    id="image"
                    className="hidden"
                    onChange={handleImage}
                  />
                  <label htmlFor="image" className="!cursor-pointer">
                    <AiOutlineCamera />
                  </label>
                </div>
              </div>
              <br />
              <br />
            </div>
            {user.role === "user" ? (
              <div>
                <br />
                <div className="flex justify-center w-full text-xl text-bold mb-1">
                  Available Balance:
                </div>
                <div className="flex justify-center w-full text-5xl text-bold">
                  $
                  {user.accountBalance &&
                    user.accountBalance.toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                    })}
                </div>
                <br />
                <br />
              </div>
            ) : (
              <div>
                <br />
                <br />
              </div>
            )}
          </div>
          <div className="w-full px-5">
            <form onSubmit={handleSubmit} aria-required>
              <div className="w-full 800px:flex block pb-3">
                <div className="w-full 800px:w-[50%]">
                  <label className="block pb-2">Full Name</label>
                  <input
                    type="text"
                    className={`${styles.input} !w-[95%] 800px:mb-0 mb-2 `}
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
                <div className="w-full 800px:w-[50%]">
                  <label className="block pb-2">Email Address</label>
                  <input
                    type="text"
                    className={`${styles.input} !w-[95%]  800px:mb-0 mb-2`}
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>
              <div className="w-full 800px:flex block pb-3">
                {user.role == "user" ? (
                  <div className="w-full 800px:w-[50%]">
                    <label className="block pb-2">Class Section</label>
                    <input
                      type="string"
                      className={`${styles.input} !w-[95%] 800px:mb-0 mb-2 cursor-not-allowed`}
                      value={user && user.section}
                      disabled
                    />
                  </div>
                ) : (
                  <div></div>
                )}

                <div className="w-full 800px:w-[50%]">
                  <label className="block pb-2">Enter Password to Update</label>
                  <input
                    type="password"
                    className={`${styles.input} !w-[95%]   800px:mb-0 mb-2`}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              </div>

              <input
                className={`w-[250px] h-[40px] border border-[#3a24db] text-center text-[#3a24db] rounded-[3px] mt-8 cursor-pointer`}
                required
                value="Update"
                type="submit"
              />
            </form>
          </div>
        </>
      )}

      {/* Order Page */}
      {active === 2 && (
        <div>
          <AllOrders></AllOrders>
        </div>
      )}

      {/* ChangePassword */}
      {active === 4 && (
        <div>
          <ChangePassword></ChangePassword>
        </div>
      )}
      {/* Company info */}
      {active === 5 && (
        <div className="flex flex-col justify-center w-full items-center">
          <div className="flex flex-col justify-center w-full items-center">
            <img
              src={`${shopInfo?.avatar?.url}`}
              className="w-[350px] h-[250px] object-cover justify-center items-center "
            />
            <div className="flex justify-center w-full text-4xl text-bold mb-4 mt-4 text-center">
              {shopInfo?.name}
            </div>
          </div>
          <div>
            <CompanyInfo members={members}></CompanyInfo>
          </div>
        </div>
      )}
    </div>
  );
};

const AllOrders = () => {
  const { user } = useSelector((state) => state.user);
  const { orders } = useSelector((state) => state.order);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getAllOrdersOfUser(user._id));
  }, []);

  const columns = [
    {
      field: "round",
      headerName: "Round",
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
      field: "quantity",
      headerName: "Quantity",
      type: "number",
      minWidth: 130,
      flex: 0.8,
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
      type: "number",
      minWidth: 130,
      flex: 0.8,
    },
  ];

  const row = [];

  orders &&
    orders.forEach((item) => {
      row.push({
        id: item?._id,
        round: item.event.name,
        company: item?.company.shop.name,
        quantity: item?.quantity,
        total: "$" + item?.totalPrice.toLocaleString(),
        createdAt: item?.createdAt.slice(0, 10),
      });
    });

  return (
    <div className="pl-8 pt-1">
      <DataGrid
        rows={row}
        columns={columns}
        pageSizeOptions={[10, 20, 50]}
        disableSelectionOnClick
        autoHeight
        components={{ Toolbar: GridToolbar }}
      />
    </div>
  );
};

const ChangePassword = () => {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const passwordChangeHandler = async (e) => {
    e.preventDefault();
    await axios
      .put(
        `${server}/user/update-user-password`,
        { oldPassword, newPassword, confirmPassword },
        {
          withCredentials: true,
        }
      )
      .then(() => {
        toast.success("Password changed");
        setOldPassword("");
        setNewPassword("");
        setConfirmPassword("");
      })
      .catch((error) => {
        toast.error(error.response.data.message);
      });
  };

  return (
    <div className="w-full px-5">
      <h1 className="block text-[25px] text-center font-[600] text-[#000000ba] pb-2">
        Change Password
      </h1>
      <div className="w-full">
        <form
          aria-required
          onSubmit={passwordChangeHandler}
          className="flex flex-col items-center"
        >
          {" "}
          <div className="w-full 800px:w-[50%]">
            <label className="block pb-2">Current Password</label>
            <input
              type="password"
              className={`${styles.input} !w-[95%] 800px:mb-2 mb-4 `}
              required
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
            />
          </div>
          <div className="w-full 800px:w-[50%]">
            <label className="block pb-2">New Password</label>
            <input
              type="password"
              className={`${styles.input} !w-[95%]  800px:mb-2 mb-4`}
              required
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
          </div>
          <div className="w-full 800px:w-[50%]">
            <label className="block pb-2">Confirm New Password</label>
            <input
              type="password"
              className={`${styles.input} !w-[95%]  800px:mb-2 mb-4`}
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            <input
              className={`!w-[95%] h-[40px] border border-[#3a24db] text-center text-[#3a24db] rounded-[3px] mt-8 cursor-pointer`}
              required
              value="Update"
              type="submit"
            />
          </div>
        </form>
      </div>
    </div>
  );
};

const CompanyInfo = ({ members }) => {
  return (
    <div className="flex flex-wrap m-5">
      {members.length !== 0 &&
        members.map((i, index) => <TeamMemberCard member={i} />)}
    </div>
  );
};

const TeamMemberCard = ({ member }) => {
  return (
    <div className=" w-[100%] 800px:w-[250px] h-[min] bg-white rounded-3xl shadow-sm p-3 relative flex-col items-center justify-center text-center content-center m-2">
      <div className="justify-center self-center flex">
        <img
          draggable={false}
          className="w-full h-[150px] object-contain  m-[10px]"
          src={`${member.avatar.url}`}
        />
      </div>
      <div className="text-2xl text-bold">{member.name}</div>
      {member.companyRole !== "Not Assigned" && (
        <div className="text-xl italic text-slate-400">
          {member.companyRole}
        </div>
      )}
    </div>
  );
};

export default ProfileContent;
