import React from "react";
import Header from "../components/Layout/Header";
import Footer from "../components/Layout/Footer";
import Lottie from "react-lottie";
import animationData from "../assets/animations/nf.json";
const NotFound = () => {
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    renderSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };
  return (
    <div>
      <Header />
      <div className="">
        {" "}
        <Lottie options={defaultOptions} width={800} height={800}></Lottie>
      </div>
      <Footer></Footer>
    </div>
  );
};

export default NotFound;
