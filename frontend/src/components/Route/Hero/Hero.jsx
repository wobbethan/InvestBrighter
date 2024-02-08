import React from "react";
import bg from "../../../assets/investbg.png";
import animationData from "../../../assets/animations/transBulb.json";
import Lottie from "react-lottie";
import { motion } from "framer-motion";

function Hero() {
  const title = "Invest Brighter".split("");
  const defaultOptions = {
    loop: false,
    autoplay: true,
    animationData: animationData,
    renderSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };
  return (
    <div
      className={`z-[999] flex flex-col h-[100vh] self-center bg-no-repeat bg-fixed bg-cover items-center p-[100px] mb-5`}
      style={{
        backgroundImage: `url(${bg})`,
      }}
    >
      <div className="!cursor-default">
        <Lottie
          options={defaultOptions}
          width={300}
          height={300}
          className="!cursor-default"
        ></Lottie>
      </div>

      <div className="800px:text-[6.4rem] 600px:text-[5rem] text-[4rem] text-center text-black">
        {title.map((el, i) => (
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{
              duration: 0.25,
              delay: i / 20,
            }}
            key={i}
            className="font-Poppins mb-0"
          >
            {el}
          </motion.span>
        ))}
        <motion.p
          initial={{ opacity: 0, y: "100%" }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut", delay: 2 }}
          className="800px:block hidden text-[3rem] font-Poppins"
        >
          Your Investment solution
        </motion.p>
      </div>
    </div>
  );
}

export default Hero;
