import React, { useEffect, useState } from "react";
import { FaCirclePlus } from "react-icons/fa6";
import { backend_url, server } from "../../../Server";
import axios from "axios";
import { RxCross1 } from "react-icons/rx";
import Loader from "../../../components/Layout/Loader";

const AddAdmin = () => {
  const [admins, setAdmins] = useState([]);
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const getAdmins = async () => {
      await axios
        .get(`${server}/user/get-admins`, { withCredentials: true })
        .then((res) => {
          setAdmins(res.data.admins);
        });
      setLoading(false);
    };
    getAdmins();
  }, []);

  const addAdmin = async (email) => {
    await axios
      .put(`${server}/user/add-admin/${email}`, { withCredentials: true })
      .then((res) => {
        console.log(res.message);
      });
    window.location.reload();
  };

  return (
    <>
      {loading ? (
        <div className="flex flex-col items-center justify-center m-5 w-full"></div>
      ) : (
        <div className="flex flex-col items-center justify-center m-5 w-full">
          <div className="flex flex-wrap m-5">
            {admins && admins.map((i) => <AdminCard admin={i} />)}
          </div>
          <div className="flex items-center justify-center mb-10 mt-5">
            <FaCirclePlus
              size={40}
              className="cursor-pointer"
              onClick={() => setOpen(true)}
            />
          </div>
          {open && (
            <div className="fixed top-0 left-0 w-full h-screen bg-[#00000062] z-[2000] flex items-center justify-center">
              <div className="w-[90%] 800px:w-[40%] h-[30vh] bg-white rounded-md shadow p-3">
                <div className="w-full flex justify-end mb-5">
                  <RxCross1
                    size={30}
                    className="cursor-pointer"
                    onClick={() => setOpen(false)}
                  />
                </div>
                <h5 className="text-[30px] font-Poppins text-center">
                  Add Admin
                </h5>
                {/* Form */}
                <br />
                <div className="flex flex-col items-center justify-center">
                  <label className="pb-2">Email</label>
                  <input
                    type="email"
                    required
                    name="email"
                    value={email}
                    className="mt-2 appearance-none block w-full px-3 h-[35px] border border-gray-300 rounded-[3px] placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter e-mail..."
                  />
                </div>
                <div className="mt-6 flex items-center justify-center">
                  <input
                    type="button"
                    onClick={() => addAdmin(email)}
                    value="Add"
                    className="mt-2 appearance-none block w-[70%] px-3 h-[35px] border border-gray-300 rounded-[3px] placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
};

const AdminCard = ({ admin }) => {
  const removeAdmin = async (id) => {
    await axios
      .put(`${server}/user/remove-admin/${id}`, { withCredentials: true })
      .then((res) => {
        console.log(res.message);
      });
    window.location.reload();
  };
  return (
    <div className=" w-[100%] 800px:w-[250px] h-[300px] bg-white rounded-3xl shadow-sm p-3 relative flex-col items-center justify-center text-center content-center m-2">
      <div className="justify-center self-center flex">
        <img
          draggable={false}
          className="w-full h-[150px] object-contain  m-[10px]"
          src={`${backend_url}${admin.avatar}`}
        />
      </div>
      <div className="text-2xl text-bold">{admin.name}</div>
      <div
        className="text-lg text-bold italic text-slate-400 cursor-pointer"
        onClick={() => removeAdmin(admin._id)}
      >
        remove
      </div>
    </div>
  );
};

export default AddAdmin;
