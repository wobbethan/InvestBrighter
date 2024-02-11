import axios from "axios";
import React, { useState } from "react";
import styles from "../styles/styles";
import { toast } from "react-toastify";
import { server } from "../Server";
import DashboardSidebar from "../components/Shop/Layout/DashboardSidebar";
import DashboardHeader from "../components/Shop/Layout/DashboardHeader";
import { useSelector } from "react-redux";

const ShopPasswordPage = () => {
  const { seller } = useSelector((state) => state.seller);

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const passwordChangeHandler = async (e) => {
    const id = seller._id;
    e.preventDefault();
    await axios
      .put(
        `${server}/shop/update-company-password`,
        { oldPassword, newPassword, confirmPassword, id },
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
    <div>
      <DashboardHeader />
      <div className="flex justify-between w-full">
        <div className="w-[80px] 800px:w-[330px]">
          <DashboardSidebar active={12} />
        </div>
        <div className="w-full justify-center flex">
          <div className="w-full px-5 pt-5">
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
        </div>
      </div>
    </div>
  );
};

export default ShopPasswordPage;
