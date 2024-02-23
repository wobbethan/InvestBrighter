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
      <div className="flex flex-col items-center justify-evenly align-top text-center text-gray-400 text-sm p-5">
        A platform created by
        <ul className="flex gap-5 mt-3 ">
          <li className="hover:underline cursor-pointer">
            <Link
              to={"https://www.linkedin.com/in/ethan-wobb/"}
              target="_blank"
              rel="noopener noreferrer"
            >
              Ethan Wobb
            </Link>
          </li>
          <li className="hover:underline cursor-pointer">
            <Link
              to={"https://www.linkedin.com/in/christian-bello-b886a3205/"}
              target="_blank"
              rel="noopener noreferrer"
            >
              Christian Bello
            </Link>
          </li>
          <li className="hover:underline cursor-pointer">
            <Link
              to={"https://www.linkedin.com/in/r-mcpherson/"}
              target="_blank"
              rel="noopener noreferrer"
            >
              Ryan McPherson
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
}

export default Footer;
