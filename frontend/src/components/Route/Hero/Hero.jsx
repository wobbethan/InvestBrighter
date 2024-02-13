import React from "react";
import bg from "../../../assets/investbg.png";
import animationData from "../../../assets/animations/transBulb.json";
import Lottie from "react-lottie";
import { motion } from "framer-motion";
import styles from "../../../styles/styles";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

function Hero() {
  const { isAuthenticated } = useSelector((state) => state.user);
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
      className={`z-[999] flex flex-col h-[120vh] self-center bg-no-repeat bg-fixed bg-cover items-center p-[100px] mb-5 !cursor-default`}
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
          isClickToPauseDisabled={true}
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
        {!isAuthenticated && (
          <motion.div
            initial={{ opacity: 0, y: "100%" }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: "easeOut", delay: 2.5 }}
            className="text-[1.5rem] font-Poppins flex flex-col 800px:flex-row items-center w-full justify-evenly mt-5 mb-5"
          >
            <Link to="/login">
              <div className={`${styles.button} text-white`}>Login</div>
            </Link>
            <Link to="/sign-up">
              <div className={`${styles.button} text-white`}>Sign up</div>
            </Link>
          </motion.div>
        )}
      </div>
    </div>
  );
}

export default Hero;
