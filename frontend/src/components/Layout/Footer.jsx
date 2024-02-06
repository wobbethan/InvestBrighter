import React from "react";
import {
  AiFillFacebook,
  AiOutlineTwitter,
  AiFillInstagram,
  AiFillYoutube,
} from "react-icons/ai";
import { Link } from "react-router-dom";
import {
  footerProductLinks,
  footerSupportLinks,
  footercompanyLinks,
} from "../../static/data";

function Footer() {
  return (
    <div className="bg-[#000] text-white">
      <div className="md:flex md:justify-between md:items-center sm:px-12 px-4 bg-[#342ac8] py-7"></div>
      <div className=" sm:px-8 px-5 py-16 sm:text-center"></div>
      <div className="flex items-center justify-evenly align-top text-center text-gray-400 text-sm"></div>
    </div>
  );
}

export default Footer;
