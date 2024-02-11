import React, { useEffect, useState } from "react";
import { FaCircleMinus, FaCirclePlus } from "react-icons/fa6";
import { backend_url, server } from "../../../Server";
import axios from "axios";
import { RxCross1 } from "react-icons/rx";
import Loader from "../../../components/Layout/Loader";
import { toast } from "react-toastify";
import { DataGrid, GridToolbar } from "@material-ui/data-grid";
import styles from "../../../styles/styles";
import { AiOutlineDelete } from "react-icons/ai";
import { Button } from "@material-ui/core";
import { useDispatch, useSelector } from "react-redux";
import { getAllSectionsOfAdmin } from "../../../redux/actions/section";

const ManageSection = () => {
  const [openCreate, setOpenCreate] = useState(false);
  const [sectionName, setSectionName] = useState("");
  const [open, setOpen] = useState(false);

  const dispatch = useDispatch();

  const { adminSections } = useSelector((state) => state.sections);
  const { user } = useSelector((state) => state.user);

  useEffect(() => {
    dispatch(getAllSectionsOfAdmin(user._id));
  }, [dispatch]);

  const handleCreateSubmit = async () => {
    if (sectionName && sectionName.includes(" ")) {
      toast.error("Please do not include any spaces");
    } else {
      await axios
        .post(
          `${server}/section/create-section/${sectionName}/${user._id}/${user.name}`,
          {
            withCredentials: true,
          }
        )
        .then((res) => {
          toast.success("Section Created!");
        })
        .catch((err) => {
          toast.error(err.message);
        });
      dispatch(getAllSectionsOfAdmin(user._id));
      setOpenCreate(false);
      setSectionName("");
    }
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
    dispatch(getAllSectionsOfAdmin(user._id));
  };

  const columns = [
    {
      field: "admin",
      headerName: "Admin",
      type: "string",
      minWidth: 130,
      flex: 0.7,
    },

    {
      field: "section",
      headerName: "Section",
      type: "string",
      minWidth: 130,
      flex: 0.7,
    },

    {
      field: "numStudents",
      headerName: "Students enrolled",
      type: "number",
      minWidth: 130,
      flex: 0.7,
    },

    {
      field: "createdAt",
      headerName: "Created on",
      type: "number",
      minWidth: 130,
      flex: 0.8,
    },
    {
      field: " ",
      flex: 1,
      minWidth: 150,
      headerName: "Delete Section",
      type: "number",
      sortable: false,
      renderCell: (params) => {
        return (
          <>
            <Button
              onClick={() =>
                setSectionName(params.row.section) || setOpen(true)
              }
            >
              <AiOutlineDelete size={20} />
            </Button>
          </>
        );
      },
    },
  ];

  const row = [];
  adminSections &&
    adminSections.forEach((item) => {
      row.push({
        id: item._id,
        admin: item?.admin?.name,
        section: item?.name,
        numStudents: item?.numStudents,
        createdAt: item?.createdAt.slice(0, 10),
      });
    });

  return (
    <div className="relative w-full flex flex-col items-center justify-center">
      {/* Create section */}
      <div className="flex w-full">
        <div className=" flex m-5">
          <div
            className="cursor-pointer mr-3 flex justify-center items-center"
            onClick={() => setOpenCreate(true)}
          >
            <h1 className="text-[25px] mr-[10px]">Create Section</h1>
            <FaCirclePlus size={30} />
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
        </div>
      </div>
      {/* Section grid */}
      <div className="w-full min-h-[45vh] pt-5 rounded flex justify-center">
        <div className="w-[97%] flex justify-center bg-white">
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
      {open && (
        <div className="w-full fixed top-0 left-0 z-[999] bg-[#00000039] flex items-center justify-center h-screen">
          <div className="w-[95%] 800px:w-[40%] min-h-[20vh] bg-white rounded shadow p-5">
            <div className="w-full flex justify-end cursor-pointer">
              <RxCross1 size={25} onClick={() => setOpen(false)} />
            </div>
            <h3 className="text-[25px] text-center py-5 font-Poppins text-[#000000cb]">
              Are you sure you want to delete this section?
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
                onClick={() => setOpen(false) || handleRemoveSubmit()}
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

export default ManageSection;
