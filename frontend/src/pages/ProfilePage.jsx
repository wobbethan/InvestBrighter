import React, { useState } from "react";
import Header from "../components/Layout/Header";
import Footer from "../components/Layout/Footer";
import styles from "../styles/styles";
import ProfileSideBar from "../components/profile/ProfileSideBar.jsx";
import ProfileContent from "../components/profile/ProfileContent.jsx";

const ProfilePage = () => {
  const [active, setActive] = useState(1);
  return (
    <div>
      <Header />
      <div className={`${styles.section} flex py-10 bg-[#f5f5f5] mt-[10vh]`}>
        <div className="800px:w-[355px] w-[50px] sticky mt-[18%] 800px:mt-[0%]">
          <ProfileSideBar active={active} setActive={setActive} />
        </div>
        <ProfileContent active={active} />
      </div>
    </div>
  );
};

export default ProfilePage;
