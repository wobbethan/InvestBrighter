import React, { useEffect } from "react";
import Header from "../components/Layout/Header";
import Footer from "../components/Layout/Footer";
import Lottie from "react-lottie";
import animationData from "../assets/animations/nf.json";
import { toast } from "react-toastify";
const NotFound = () => {
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    renderSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };
  useEffect(() => {
    toast.error("Page not found");
  }, []);
  return (
    <div>
      <Header />
      <div className="">
        {" "}
        <Lottie options={defaultOptions} width={1000} height={1000}></Lottie>
      </div>
      <Footer></Footer>
    </div>
  );
};

export default NotFound;
