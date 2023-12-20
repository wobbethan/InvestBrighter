import React from "react";
import Header from "../components/Layout/Header.jsx";
import Hero from "../components/Route/Hero/Hero.jsx";
import Categories from "../components/Route/Categories/Categories.jsx";
import BestDeals from "../components/Route/BestDeals/BestDeals.jsx";

function HomePage() {
  return (
    <div>
      <Header activeHeading={1}></Header>
      <Hero />
      <Categories></Categories>
      <BestDeals />
    </div>
  );
}

export default HomePage;
