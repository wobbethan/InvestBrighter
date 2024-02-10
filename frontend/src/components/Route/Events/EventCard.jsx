import React from "react";
import styles from "../../../styles/styles";
import CountDown from "./CountDown.jsx";
import { backend_url } from "../../../Server.js";

const EventCard = ({ active, data }) => {
  return (
    <div
      className={`w-full block bg-white rounded-lg ${
        active ? "unset" : "mb-12"
      } lg:flex p-2`}
    >
      <div className="w-full m-auto lg:w-[50%]">
        <img src={`${data?.images[0].url}`} alt="" className="p-5" />
      </div>
      <div className="w-full lg:[w-50%] flex flex-col justify-center">
        <h2 className={`${styles.productTitle}`}> {data?.name}</h2>
        <p>{data?.description}</p>
        <div className="flex py-2 justify-between">
          <div className="flex">
            <h5 className="font-bold text-[20px] text-[#333] pr-3 font-Roboto">
              ${data?.checkPrice.toLocaleString()}
            </h5>
          </div>
          <span className="pr-3 font-[400] text-[17px] text-[#44a55e]">
            {data?.numChecks} Investment Checks
          </span>
        </div>
        {data?.start_Date !== "undefined" &&
          data?.finish_Date !== "undefined" && <CountDown data={data} />}
      </div>
    </div>
  );
};

export default EventCard;
