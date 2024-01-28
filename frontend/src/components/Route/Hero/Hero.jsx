import React from "react";
import styles from "../../../styles/styles";
import { backend_url } from "../../../Server";
import vid from "../../../assets/bgvideo.mp4";
function Hero() {
  return (
    <div
      className={`relative min-h-[70vh] 800px:min-h-[90vh] w-full bg-no-repeat ${styles.normalFlex}`}
    >
      {/* <video
        src={vid}
        loop
        autoPlay
        muted
        className="w-full h-full object-cover"
      ></video> */}
    </div>
  );
}

export default Hero;
