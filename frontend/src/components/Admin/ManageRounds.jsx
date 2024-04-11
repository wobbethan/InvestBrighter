import { Button } from "@material-ui/core";
import { DataGrid, GridToolbar } from "@material-ui/data-grid";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { AiOutlineDelete, AiOutlineEye } from "react-icons/ai";
import { Link } from "react-router-dom";
import { server } from "../../Server";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { getAllEventsAdmin } from "../../redux/actions/event";
import { FaLock, FaUnlock } from "react-icons/fa";
import { RxCross1 } from "react-icons/rx";
import { FaEdit } from "react-icons/fa";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { MobileDateTimePicker } from "@mui/x-date-pickers/MobileDateTimePicker";

import styles from "../../styles/styles";

import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.tz.setDefault("America/New_York");

const ManageRounds = () => {
  const [avatar, setAvatar] = useState();
  const [openEdit, setOpenEdit] = useState(false);
  const [name, setName] = useState();
  const [sections, setSections] = useState(["forceArray"]);
  const [priceCheck, setPriceCheck] = useState();
  const [numChecks, setNumChecks] = useState();
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [investCompany, setInvestCompany] = useState();
  const [investRound, setInvestRound] = useState();
  const [loading, setLoading] = useState(false);
  const [description, setDescription] = useState("");
  const { adminSections } = useSelector((state) => state.sections);
  const [open, setOpen] = useState(false);
  const [id, setId] = useState(null);
  const { allEventsAdmin } = useSelector((state) => state.events);
  const { user } = useSelector((state) => state.user);
  let options = {
    timeZone: "America/New_York",
    year: "numeric",
    month: "numeric",
    day: "numeric",
    hour12: true,
    minute: "numeric",
    hour: "numeric",
  };
  const dispatch = useDispatch();

  const removeEvent = async (id) => {
    axios
      .delete(`${server}/event/delete-shop-event/${id}`, {
        withCredentials: true,
      })
      .then(() => {
        toast.success("Round Deleted");
      });
    window.location.reload();
  };

  const lockEvent = async (id) => {
    axios
      .put(`${server}/event/lock-shop-event/${id}`, {
        withCredentials: true,
      })
      .then(() => {
        toast.success("Round Locked");
        dispatch(getAllEventsAdmin(user._id));
      });
  };
  const unlockEvent = async (id) => {
    axios
      .put(`${server}/event/unlock-shop-event/${id}`, {
        withCredentials: true,
      })
      .then(() => {
        toast.success("Round Unlocked");
        dispatch(getAllEventsAdmin(user._id));
      });
  };

  useEffect(() => {
    dispatch(getAllEventsAdmin(user._id));
  }, []);

  const getRoundInfo = async (id) => {
    await axios.get(`${server}/event/get-event/${id}`).then((res) => {
      const event = res.data.data;
      setAvatar(event.images[0].url);
      setName(event.name);
      setDescription(event.description);
      setNumChecks(event.numChecks);
      setPriceCheck(event.checkPrice);
      setInvestCompany(event.maxInvestmentsCompany);
      setInvestRound(event.maxInvestmentsRound);
    });
  };
  useEffect(() => {
    if (id) {
      getRoundInfo(id);
    }
  }, [id]);

  const handleButtonClick = (option) => {
    if (sections.includes(option)) {
      // If option is already selected, remove it
      setSections(
        sections.filter((selectedOption) => selectedOption !== option)
      );
    } else {
      // If option is not selected, add it
      setSections((sections) => [...sections, option]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const updating = toast.loading("Updating event");

    const newForm = new FormData();

    newForm.append("name", name);
    newForm.append("description", description);
    newForm.append("maxInvestmentsCompany", investCompany);
    newForm.append("maxInvestmentsRound", investRound);
    newForm.append("numChecks", numChecks);
    newForm.append("checkPrice", priceCheck);
    newForm.append("start_Date", startDate?.toISOString());
    newForm.append("finish_Date", endDate?.toISOString());

    await axios.put(`${server}/event/update-event/${id}`, newForm).then(() => {
      toast.update(updating, {
        render: "Event Updated",
        type: "success",
        isLoading: false,
        autoClose: 3000,
      });
      setOpenEdit(false);
      dispatch(getAllEventsAdmin(user._id));
    });
  };

  const columns = [
    {
      field: "name",
      headerName: "Name",
      minWidth: 130,
      flex: 0.8,
    },

    {
      field: "numInvestments",
      headerName: "Investments",
      type: "number",
      minWidth: 130,
      flex: 0.6,
    },
    {
      field: "start",
      headerName: "Start Date",
      type: "date",
      minWidth: 70,
      flex: 0.7,
    },
    {
      field: "end",
      headerName: "End Date",
      type: "date",
      minWidth: 70,
      flex: 0.7,
    },
    {
      field: " ",
      flex: 0.7,
      minWidth: 50,
      headerName: "Event Status",
      type: "number",
      sortable: false,
      renderCell: (params) => {
        return (
          <>
            {params.row.status === "Running" ? (
              <Button
                className="flex flex-row items-center justify-center"
                onClick={() => lockEvent(params.row.id)}
              >
                Unlocked <FaUnlock className="mb-[7px] ml-[5px]" size={20} />
              </Button>
            ) : (
              <Button
                className="flex flex-row items-center justify-center"
                onClick={() => unlockEvent(params.row.id)}
              >
                LOCKED <FaLock className="mb-[7px] ml-[5px]" size={20} />
              </Button>
            )}
          </>
        );
      },
    },
    {
      field: " edit",
      flex: 1,
      minWidth: 150,
      headerName: "Edit Round",
      type: "number",
      sortable: false,
      renderCell: (params) => {
        return (
          <>
            <Button
              onClick={() =>
                setOpenEdit(true) ||
                setId(params.row.id) ||
                setName(params.row.name)
              }
            >
              <FaEdit size={20} />
            </Button>
          </>
        );
      },
    },

    {
      field: " d",
      flex: 0.7,
      minWidth: 50,
      headerName: "Delete Event",
      type: "number",
      sortable: false,
      renderCell: (params) => {
        return (
          <>
            <Button
              onClick={() => {
                setId(params.row.id) || setOpen(true);
              }}
            >
              <AiOutlineDelete size={20} />
            </Button>
          </>
        );
      },
    },
  ];

  const row = [];

  allEventsAdmin &&
    allEventsAdmin.forEach((item) => {
      row.push({
        id: item._id,
        name: item.name,
        start:
          item?.start_Date === "undefined"
            ? "N/A"
            : new Date(item?.start_Date).toLocaleString("en-US", options),
        end:
          item?.finish_Date === "undefined"
            ? "N/A"
            : new Date(item?.finish_Date).toLocaleString("en-US", options),
        numInvestments: item.numInvestments,
        status: item.status,
      });
    });

  return (
    <>
      <div className="w-full mx-8 pt-1 mt-10 bg-white">
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
              Are you sure you want to delete this round?
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
                onClick={() => setOpen(false) || removeEvent(id)}
              >
                confirm
              </div>
            </div>
          </div>
        </div>
      )}
      {openEdit && (
        <div className="w-full fixed top-0 left-0 z-[999] bg-[#00000039] flex items-center justify-center h-screen overflow-scroll">
          <div className="w-[95%] 800px:w-[40%] min-h-[20vh] bg-white rounded shadow p-5 mt-[15%]">
            <div className="w-full flex justify-end cursor-pointer">
              <RxCross1 size={25} onClick={() => setOpenEdit(false)} />
            </div>
            <h3 className="text-[25px] text-center py-5 font-Poppins text-[#000000cb] flex items-center flex-col justify-center">
              <img
                src={avatar}
                alt=""
                className="w-[125px] h-[125px] rounded-full mb-2 object-cover"
              />
              Round information
            </h3>
            <form aria-required={true} onSubmit={handleSubmit}>
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
              <br />
              <div>
                <label className="pb-2">Number of checks</label>
                <input
                  required
                  type="number"
                  name="numChecks"
                  value={numChecks}
                  className="mt-2 appearance-none block w-full px-3 h-[35px] border border-gray-300 rounded-[3px] placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  onChange={(e) => setNumChecks(e.target.value)}
                  placeholder="Number of checks..."
                  min={0}
                />
              </div>
              <br />
              <div>
                <label className="pb-2">Check Amount</label>
                <input
                  required
                  type="number"
                  name="priceCheck"
                  value={priceCheck}
                  className="mt-2 appearance-none block w-full px-3 h-[35px] border border-gray-300 rounded-[3px] placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  onChange={(e) => setPriceCheck(e.target.value)}
                  placeholder="Check amount..."
                  min={0}
                />
              </div>
              <br />
              <div>
                <label className="pb-2">Max Investments</label>
                <input
                  required
                  type="number"
                  name="investRound"
                  value={investRound}
                  className="mt-2 appearance-none block w-full px-3 h-[35px] border border-gray-300 rounded-[3px] placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  onChange={(e) => setInvestRound(e.target.value)}
                  placeholder="Enter max..."
                />
              </div>
              <br />
              <div>
                <label className="pb-2">Max Investments per Company</label>
                <input
                  required
                  type="number"
                  name="investCompany"
                  value={investCompany}
                  className="mt-2 appearance-none block w-full px-3 h-[35px] border border-gray-300 rounded-[3px] placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  onChange={(e) => setInvestCompany(e.target.value)}
                  placeholder="Enter max..."
                />
              </div>
              {/* <br />
              <div className="flex-col flex">
                <label className="pb-2">Round Start Date/Time</label>
                <MobileDateTimePicker
                  value={startDate}
                  onChange={(e) => setStartDate(e)}
                />
              </div>
              <br />
              <div className="flex-col flex">
                <label className="pb-2">Round End Date/Time</label>
                <MobileDateTimePicker
                  value={endDate}
                  onChange={(e) => setEndDate(e)}
                />
              </div> */}
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
    </>
  );
};

export default ManageRounds;
