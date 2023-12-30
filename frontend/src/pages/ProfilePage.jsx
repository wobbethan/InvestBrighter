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
      <div className={`${styles.section} flex py-10 bg-[#f5f5f5]`}>
        <div className="w-[355px]">
          <ProfileSideBar active={active} setActive={setActive} />
        </div>
        <ProfileContent active={active} />
      </div>
    </div>
  );
};

export default ProfilePage;
