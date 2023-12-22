import React from "react";
import Header from "../components/Layout/Header.jsx";
import Hero from "../components/Route/Hero/Hero.jsx";
import Categories from "../components/Route/Categories/Categories.jsx";
import BestDeals from "../components/Route/BestDeals/BestDeals.jsx";
import FeaturedProduct from "../components/Route/FeaturedProduct/FeaturedProduct.jsx";
import Events from "../components/Route/Events/Events.jsx";
import Sponsored from "../components/Route/Sponsored.jsx";
import Footer from "../components/Layout/Footer.jsx";

function HomePage() {
  return (
    <div>
      <Header activeHeading={1}></Header>
      <Hero />
      <Categories></Categories>
      <BestDeals />
      <Events />
      <FeaturedProduct />
      <Sponsored></Sponsored>
      <Footer />
    </div>
  );
}

export default HomePage;
