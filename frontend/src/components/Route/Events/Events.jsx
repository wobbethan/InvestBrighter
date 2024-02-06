import React, { useEffect, useState } from "react";
import EventCard from "./EventCard.jsx";
import styles from "../../../styles/styles.js";
import Footer from "../../Layout/Footer.jsx";
import { useDispatch, useSelector } from "react-redux";
import { getAllEventsSection } from "../../../redux/actions/event.js";

const Events = () => {
  const [data, setData] = useState(null);
  const dispatch = useDispatch;
  const { allEvents, isLoading, allEventsSection } = useSelector(
    (state) => state.events
  );
  const { user } = useSelector((state) => state.user);

  useEffect(() => {
    const eventData =
      allEvents &&
      allEvents.filter((event) => event.sections.includes(user?.section));
    setData(eventData);
  }, [allEvents]);

  return (
    <>
      {!isLoading && allEvents?.length !== 0 && (
        <div>
          <div className={`${styles.section}`}>
            <div className={`${styles.heading}`}>
              <h1>Investment Round</h1>
            </div>
            <div className="w-full grid">
              <EventCard
                data={
                  allEvents?.filter((event) =>
                    event.sections.includes(user?.section)
                  )[0]
                }
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Events;
