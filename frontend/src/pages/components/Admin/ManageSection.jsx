import React, { useEffect, useState } from "react";
import { FaCircleMinus, FaCirclePlus } from "react-icons/fa6";
import { backend_url, server } from "../../../Server";
import axios from "axios";
import { RxCross1 } from "react-icons/rx";
import Loader from "../../../components/Layout/Loader";
import { toast } from "react-toastify";
const ManageSection = () => {
  const [openCreate, setOpenCreate] = useState(false);
  const [openRemove, setOpenRemove] = useState(false);
  const [sectionName, setSectionName] = useState("");
  const [sections, setSections] = useState([]);
  const [currentSection, setCurrentSection] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const getSections = async () => {
      await axios
        .get(`${server}/section/get-sections`, { withCredentials: true })
        .then((res) => {
          setSections(res.data.sections);
        });
      setLoading(false);
      setCurrentSection(sections[0]);
    };
    getSections();
  }, []);

  const handleUpdateSubmit = async () => {
    console.log("submit update");
  };

  const handleCreateSubmit = async () => {
    await axios
      .post(`${server}/section/create-section/${sectionName}`, {
        withCredentials: true,
      })
      .then((res) => {
        toast.success("Section Created!");
      })
      .catch((err) => {
        toast.error(err.message);
      });
    window.location.reload();
  };

  const handleRemoveSubmit = async () => {
    await axios
      .post(`${server}/section/remove-section/${sectionName}`, {
        withCredentials: true,
      })
      .then((res) => {
        toast.success("Section Removed!");
      })
      .catch((err) => {
        toast.error(err.message);
      });
    window.location.reload();
  };

  return (
    <div className="relative w-full flex flex-col items-center justify-center">
      {/* Create section */}
      <div className="flex w-full">
        <div className=" flex m-5">
          <div className="cursor-pointer mr-3">
            <FaCirclePlus size={30} onClick={() => setOpenCreate(true)} />
          </div>
          <div className="cursor-pointer mr-3">
            <FaCircleMinus size={30} onClick={() => setOpenRemove(true)} />
          </div>
          {openCreate && (
            <div className="fixed top-0 left-0 w-full h-screen bg-[#00000062] z-[2000] flex items-center justify-center">
              <div className="w-[90%] 800px:w-[40%] h-[30vh] bg-white rounded-md shadow p-3">
                <div className="w-full flex justify-end mb-5">
                  <RxCross1
                    size={30}
                    className="cursor-pointer"
                    onClick={() => setOpenCreate(false)}
                  />
                </div>
                <h5 className="text-[30px] font-Poppins text-center">
                  Create Section
                </h5>
                {/* Form */}
                <form aria-required={true}>
                  <br />
                  <div className="flex flex-col items-center justify-center">
                    <label className=" text-xl">Section Name</label>
                    <input
                      type="text"
                      required
                      name="sectionName"
                      value={sectionName}
                      className="mt-2  appearance-none block w-[50%] px-3 h-[35px] border border-gray-300 rounded-[3px] placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      onChange={(e) => setSectionName(e.target.value)}
                      placeholder="Enter Section Name..."
                    />
                  </div>
                  <div className="mt-6 flex items-center justify-center">
                    <input
                      type="button"
                      onClick={() => handleCreateSubmit()}
                      value="Create"
                      className="mt-2 appearance-none block w-[70%] px-3 h-[35px] border border-gray-300 rounded-[3px] placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    />
                  </div>
                </form>
              </div>
            </div>
          )}
          {openRemove && (
            <div className="fixed top-0 left-0 w-full h-screen bg-[#00000062] z-[2000] flex items-center justify-center">
              <div className="w-[90%] 800px:w-[40%] h-[30vh] bg-white rounded-md shadow p-3">
                <div className="w-full flex justify-end mb-5">
                  <RxCross1
                    size={30}
                    className="cursor-pointer"
                    onClick={() => setOpenRemove(false)}
                  />
                </div>
                <h5 className="text-[30px] font-Poppins text-center">
                  Remove Section
                </h5>
                {/* Form */}
                <br />
                <div className="flex justify-center items-center">
                  <label className="mr-2 text-xl mt-1">Section Name</label>
                  <select
                    value={sectionName}
                    onChange={(e) => setSectionName(e.target.value)}
                    className="w-[min] mt-2 border h-[35px] rounded-[5px]"
                  >
                    {sections &&
                      sections.map((i) => (
                        <option value={i.name} key={i.name}>
                          {i.name}
                        </option>
                      ))}
                  </select>
                </div>
                <div className="mt-6 flex items-center justify-center">
                  <input
                    type="button"
                    onClick={() => handleRemoveSubmit()}
                    value="Remove"
                    className="mt-2 appearance-none block w-[70%] px-3 h-[35px] border border-gray-300 rounded-[3px] placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      {/* Update section */}
      <div className="items-center">
        <div className="flex items-center justify-center ">
          <label className="mr-2 text-2xl">Section</label>
          <select
            value={currentSection}
            onChange={(e) => setCurrentSection(e.target.value)}
            className="w-[min] mt-2 border h-[35px] rounded-[5px]"
          >
            {sections &&
              sections.map((i) => (
                <option value={i.name} key={i.name}>
                  {i.name}
                </option>
              ))}
          </select>
        </div>
      </div>
    </div>
  );
};

export default ManageSection;
