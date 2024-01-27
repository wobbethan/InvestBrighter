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
        <img src={`${backend_url}${data.images[0]}`} alt="" className="p-5" />
      </div>
      <div className="w-full lg:[w-50%] flex flex-col justify-center">
        <h2 className={`${styles.productTitle}`}> {data.name}</h2>
        <p>{data.description}</p>
        <div className="flex py-2 justify-between">
          <div className="flex">
            <h5 className="font-bold text-[20px] text-[#333] pr-3 font-Roboto">
              ${data.discountPrice.toLocaleString()}
            </h5>
          </div>
          <span className="pr-3 font-[400] text-[17px] text-[#44a55e]">
            3 Investment Checks
          </span>
        </div>
        <CountDown data={data} />
      </div>
    </div>
  );
};

export default EventCard;
