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
import styles from "../../styles/styles";
const ManageRounds = () => {
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
      });
  };
  const unlockEvent = async (id) => {
    axios
      .put(`${server}/event/unlock-shop-event/${id}`, {
        withCredentials: true,
      })
      .then(() => {
        toast.success("Round Unlocked");
      });
  };

  useEffect(() => {
    dispatch(getAllEventsAdmin(user._id));
  }, []);

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
      headerName: "Lock Event",
      type: "number",
      sortable: false,
      renderCell: (params) => {
        return (
          <>
            <Button onClick={() => lockEvent(params.row.id)}>
              <FaLock size={20} />
            </Button>
          </>
        );
      },
    },
    {
      field: " s",
      flex: 0.7,
      minWidth: 50,
      headerName: "Unlock Event",
      type: "number",
      sortable: false,
      renderCell: (params) => {
        return (
          <>
            <Button onClick={() => unlockEvent(params.row.id)}>
              <FaUnlock size={20} />
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
    </>
  );
};

export default ManageRounds;
