import React from "react";
import { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { server } from "../Server";
import { RxCross1 } from "react-icons/rx";
import { useSelector } from "react-redux";

const ShopForgotPasswordPage = () => {
  const [email, setEmail] = useState("");
  const [code, setCode] = useState();
  const [generatedCode, setGeneratedCode] = useState();
  const [codeOpen, setCodeOpen] = useState(false);
  const [resetOpen, setResetOpen] = useState(false);
  const [visible, setVisible] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [confirmVisible, setConfirmVisible] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    await axios
      .post(`${server}/shop/forgot-password/${email}`)
      .then((res) => {
        toast.success(res.data.message);
        setGeneratedCode(res.data.code);
        setCodeOpen(true);
      })
      .catch((err) => {
        toast.error(err.response.data.message);
      });
  };

  const handleSubmitCode = async (e) => {
    e.preventDefault();
    if (code == generatedCode) {
      toast.success("Code correct");
      setCode(null);
      setCodeOpen(false);
      setResetOpen(true);
    } else {
      toast.error("Incorrect code");
    }
  };

  const handlePasswordReset = async (e) => {
    e.preventDefault();
    if (confirmPassword !== password) {
      toast.error("Passwords do not match");
    } else {
      await axios
        .put(`${server}/shop/password-reset/${email}/${password}`)
        .then((res) => {
          toast.success("password changed");
          navigate("/login");
        })
        .catch((err) => {
          toast.error(err.response);
        });
    }
  };

  return (
    <>
      <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Forgot Password
          </h2>
        </div>
        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div>
                {" "}
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700"
                >
                  Email Address
                </label>
                <div className="mt-1">
                  <input
                    type="email"
                    name="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="block w-full appearance-none px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm "
                  />
                </div>
              </div>
              <div>
                <button
                  type="submit"
                  className="group relative w-full h-[40px] flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                >
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
      {codeOpen && (
        <div className="fixed top-0 left-0 w-full h-screen bg-[#00000062] z-[2000] flex items-center justify-center">
          <div className="w-[90%] 800px:w-[30%] h-min bg-white rounded-md shadow p-4">
            <div className="w-full flex justify-end">
              <RxCross1
                size={30}
                className="cursor-pointer mb-2"
                onClick={() => setCodeOpen(false)}
              />
            </div>
            <h5 className="text-[25px] font-Poppins text-center mb-2">
              Enter Code:
            </h5>
            {/* Form */}
            <form onSubmit={handleSubmitCode} aria-required={true}>
              <div>
                {" "}
                <label
                  htmlFor="code"
                  className="block text-sm font-medium text-gray-700"
                >
                  Code
                </label>
                <div className="mt-1">
                  <input
                    type="number"
                    name="code"
                    required
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    className="block w-full appearance-none px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm mb-4"
                  />
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
      )}
      {resetOpen && (
        <div className="fixed top-0 left-0 w-full h-screen bg-[#00000062] z-[2000] flex items-center justify-center">
          <div className="w-[90%] 800px:w-[30%] h-min bg-white rounded-md shadow p-4">
            <div className="w-full flex justify-end">
              <RxCross1
                size={30}
                className="cursor-pointer mb-2"
                onClick={() => setResetOpen(false)}
              />
            </div>
            <h5 className="text-[25px] font-Poppins text-center mb-2"></h5>
            {/* Form */}
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
                    className="appearance-none block w-full  px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm "
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
      )}
    </>
  );
};

export default ShopForgotPasswordPage;
