import React from "react";
import Header from "../components/Layout/Header.jsx";
import Hero from "../components/Route/Hero/Hero.jsx";
import Categories from "../components/Route/Categories.jsx";

function HomePage() {
  return (
    <div>
      <Header activeHeading={1}></Header>
      <Hero />
      <Categories></Categories>
    </div>
  );
}

export default HomePage;
