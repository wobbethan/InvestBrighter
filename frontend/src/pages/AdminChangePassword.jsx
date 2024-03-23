import React, { useEffect, useState } from "react";
import AdminHeader from "./components/Layout/AdminHeader";
import { Link, useSearchParams } from "react-router-dom";
import { server } from "../Server";
import axios from "axios";
import { toast } from "react-toastify";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { IoMdArrowRoundBack } from "react-icons/io";
import { useSelector } from "react-redux";

const AdminChangePassword = () => {
  const { user } = useSelector((state) => state.user);

  const [searchParams] = useSearchParams();
  const [name, setName] = useState();
  const [email, setEmail] = useState();
  const [avatar, setAvatar] = useState();
  const [visible, setVisible] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [confirmVisible, setConfirmVisible] = useState(false);

  const parts = window.location.href.split("/");

  const id = parts[parts.length - 1];
  console.log(searchParams);

  useEffect(() => {
    axios.get(`${server}/user/get-user-info/${id}`).then((res) => {
      setEmail(res.data.user.email);
      setName(res.data.user.name);
      setAvatar(res.data.user.avatar.url);
    });
  }, []);

  const handlePasswordReset = async (e) => {
    e.preventDefault();
    if (confirmPassword !== password) {
      toast.error("Passwords do not match");
    } else {
      await axios
        .put(`${server}/user/password-reset/${email}/${password}`)
        .then((res) => {
          toast.success(`${name}'s has been changed`);
        })
        .catch((err) => {
          toast.error(err.response);
        });
    }
  };

  return (
    <div className="w-full">
      <div className="w-full h-[80px] bg-white shadow sticky top-0 left-0 z-30 flex items-center justify-between px-4">
        <div>
          <Link to="/admin/admin-users">
            <IoMdArrowRoundBack size={30} />
          </Link>
        </div>
        <div className="flex items-center">
          <div className="flex items-center mr-4">
            <Link to="/profile" className="800px:block hidden">
              <img
                src={`${user?.avatar.url}`}
                alt=""
                className="w-[50px] h-[50px] rounded-full object-cover"
              />
            </Link>
          </div>
        </div>
      </div>
      <div className="w-full flex justify-center text-center items-center mt-10 flex-col">
        <div className="mb-5 flex flex-col items-center align-center">
          <img
            src={avatar}
            alt=""
            className="w-[200px] h-[200px] mb-3 object-cover  rounded-full"
          />
          <h1 className="font-bold text-xl">
            Changing password for <span className="text-blue-600">{name}</span>
          </h1>
        </div>
        <form onSubmit={handlePasswordReset} aria-required={true}>
          <div className="mb-5">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              New Password
            </label>
            <div className="mt-1 relative">
              <input
                type={visible ? "text" : "password"}
                name="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm "
              />
              {visible ? (
                <AiOutlineEye
                  className="absolute right-2 top-2 cursor-pointer"
                  size={25}
                  onClick={() => setVisible(false)}
                />
              ) : (
                <AiOutlineEyeInvisible
                  className="absolute right-2 top-2 cursor-pointer"
                  size={25}
                  onClick={() => setVisible(true)}
                />
              )}
            </div>
          </div>
          <div className="mb-5">
            <label
              htmlFor="confirmPassword"
              className="block text-sm font-medium text-gray-700"
            >
              Confirm New Password
            </label>
            <div className="mt-1 relative">
              <input
                type={confirmVisible ? "text" : "password"}
                name="confirmPassword"
                autoComplete="current-password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="appearance-none block w-full  px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm mb-2"
              />
              {confirmVisible ? (
                <AiOutlineEye
                  className="absolute right-2 top-2 cursor-pointer"
                  size={25}
                  onClick={() => setConfirmVisible(false)}
                />
              ) : (
                <AiOutlineEyeInvisible
                  className="absolute right-2 top-2 cursor-pointer"
                  size={25}
                  onClick={() => setConfirmVisible(true)}
                />
              )}
            </div>
          </div>
          <div>
            <button
              type="submit"
              className="group relative w-full h-[40px] flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
            >
              Enter
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminChangePassword;
