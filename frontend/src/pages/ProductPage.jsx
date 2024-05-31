import React, { useEffect, useState } from "react";
import Header from "../components/Layout/Header";
import styles from "../styles/styles";
import { useSearchParams } from "react-router-dom";
import ProductCard from "../components/Route/ProductCard/ProductCard";
import Footer from "../components/Layout/Footer";
import { useSelector } from "react-redux";
import Loader from "../components/Layout/Loader";
import EventCard from "../components/Route/Events/EventCard";

function ProductPage() {
  const { allEvents } = useSelector((state) => state.events);
  const { allProducts, isLoading } = useSelector((state) => state.products);
  const [searchParams] = useSearchParams();
  const categoryData = searchParams.get("section");
  const [data, setData] = useState([]);
  const [events, setEvents] = useState([]);

  useEffect(() => {
    if (categoryData === null) {
      const d = allProducts;
      setData(d);
    } else {
      const d =
        allProducts && allProducts.filter((i) => i.section === categoryData);
      setData(d);
    }
  }, [allProducts]);

  useEffect(() => {
    if (categoryData === null) {
      const d = allEvents;
      setEvents(d);
    } else {
      const d =
        allEvents &&
        allEvents?.filter((event) => event.sections.includes(categoryData));
      setEvents(d);
    }
  }, [allEvents]);

  return (
    <>
      {isLoading ? (
        <Loader></Loader>
      ) : (
        <div className="mt-10">
          <Header activeHeading={3} />
          <br />
          <br />
          <div className="text-4xl  text-center mb-3">{categoryData}</div>
          <div className="text-3xl m-5">{events?.length !== 0 && "Rounds"}</div>
          <div>
            {events &&
              events.map((i, index) => <EventCard data={i} key={index} />)}
          </div>
          <br />
          <br />
          <div className="text-3xl m-5">
            {data?.length !== 0 && "Companies"}
          </div>

          <div className={`${styles.section}`}>
            <div className="grid grid-cols-1 gap-[20px] md:grid-cols-2 md:gap-[25px] lg:grid-cols-4 lg:gap-[25px] xl:grid-cols-5 xl:gap-[30px] mb-12">
              {data &&
                data.map((i, index) => <ProductCard data={i} key={index} />)}
            </div>
            {data && data.length === 0 ? (
              <h1 className="text-center w-full pb-[100px] text-[20px]">
                No rounds exist for this section!
              </h1>
            ) : null}
          </div>
          <Footer />
        </div>
      )}
    </>
  );
}

export default ProductPage;
