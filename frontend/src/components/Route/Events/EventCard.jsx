import React from "react";
import styles from "../../../styles/styles";
import CountDown from "./CountDown.jsx";

const EventCard = ({ active }) => {
  return (
    <div
      className={`w-full block bg-white rounded-lg ${
        active ? "unset" : "mb-12"
      } lg:flex p-2`}
    >
      <div className="w-full m-auto lg:w-[50%]">
        <img
          src="https://images.cnbctv18.com/wp-content/uploads/2020/04/wallstreet_NYSE1-768x512.jpg"
          alt=""
          className="p-5"
        />
      </div>
      <div className="w-full lg:[w-50%] flex flex-col justify-center">
        <h2 className={`${styles.productTitle}`}> Seed Investment Round</h2>
        <p>
          Lorem ipsum dolor sit amet consectetur adipisicing elit.
          Necessitatibus voluptate libero, odit, unde, enim rerum soluta quod
          itaque deleniti porro expedita odio provident quam nesciunt nemo quos
          quasi excepturi earum. Lorem ipsum dolor sit amet consectetur
          adipisicing elit. Necessitatibus voluptate libero, odit, unde, enim
          rerum soluta quod itaque deleniti porro expedita odio provident quam
          nesciunt nemo quos quasi excepturi earum.
        </p>
        <div className="flex py-2 justify-between">
          <div className="flex">
            <h5 className="font-[500] text-[18px] text-[#d55b45] pr-3 line-through"></h5>
            <h5 className="font-bold text-[20px] text-[#333] font-Roboto"></h5>
          </div>
          <span className="pr-3 font-[400] text-[17px] text-[#44a55e]">
            120 Investments
          </span>
        </div>
        <CountDown />
      </div>
    </div>
  );
};

export default EventCard;
