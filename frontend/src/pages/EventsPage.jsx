import React from "react";
import Header from "../components/Layout/Header";
import EventCard from "../components/Route/Events/EventCard";
import Footer from "../components/Layout/Footer";
import { useSelector } from "react-redux";
import Loader from "../components/Layout/Loader";

const EventsPage = () => {
  const { allEvents, isLoading } = useSelector((state) => state.events);
  return (
    <>
      {isLoading ? (
        <Loader></Loader>
      ) : (
        <div>
          <Header activeHeading={4}></Header>
          {allEvents &&
            allEvents.map((i, index) => (
              <EventCard active={true} data={allEvents[index]}></EventCard>
            ))}

          <Footer></Footer>
        </div>
      )}
    </>
  );
};

export default EventsPage;
