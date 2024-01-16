import React, { useEffect } from "react";
import EventCard from "./EventCard.jsx";
import styles from "../../../styles/styles.js";
import Footer from "../../Layout/Footer.jsx";
import { useSelector } from "react-redux";

const Events = () => {
  const { allEvents, isLoading } = useSelector((state) => state.events);

  // useEffect(() => {
  //   const data = allEvents && allEvents.find((a, b) => a.sold_out - b.sold_out);
  // }, [allEvents]);

  return (
    <>
      {!isLoading && (
        <div>
          <div className={`${styles.section}`}>
            <div className={`${styles.heading}`}>
              <h1>Popular Events</h1>
            </div>
            <div className="w-full grid">
              <EventCard data={allEvents[0]} />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Events;
