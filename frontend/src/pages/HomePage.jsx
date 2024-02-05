import React, { useEffect } from "react";
import Header from "../components/Layout/Header.jsx";
import Hero from "../components/Route/Hero/Hero.jsx";
import Categories from "../components/Route/Categories/Categories.jsx";
import BestDeals from "../components/Route/BestDeals/BestDeals.jsx";
import FeaturedProduct from "../components/Route/FeaturedProduct/FeaturedProduct.jsx";
import Events from "../components/Route/Events/Events.jsx";
import Sponsored from "../components/Route/Sponsored.jsx";
import Footer from "../components/Layout/Footer.jsx";
import FaqPage from "./FaqPage.jsx";
import { useSelector } from "react-redux";

function HomePage() {
  const { allEvents } = useSelector((state) => state.events);
  const { isAuthenticated, user } = useSelector((state) => state.user);
  return (
    <div>
      <Header activeHeading={1}></Header>
      <Hero />
      {isAuthenticated &&
        allEvents?.filter((event) => event.sections.includes(user?.section))
          .length != 0 && <Events />}
      <FeaturedProduct />
      {/* <FaqPage></FaqPage> */}
      <Footer />
    </div>
  );
}

export default HomePage;
