import React, { useEffect, useState } from "react";
import styles from "../../styles/styles";
import { Link } from "react-router-dom";
import { categoriesData, productData } from "../../static/data";
import {
  AiOutlineHeart,
  AiOutlineSearch,
  AiOutlineShoppingCart,
} from "react-icons/ai";
import { IoIosArrowDown, IoIosArrowForward } from "react-icons/io";
import { BiMenuAltLeft } from "react-icons/bi";
import DropDown from "./DropDown.jsx";
import Navbar from "./Navbar.jsx";
import { CgProfile } from "react-icons/cg";
import { useSelector } from "react-redux";
import { backend_url, server } from "../../Server.js";
import Cart from "../cart/Cart.jsx";
import Wishlist from "../wishlist/Wishlist.jsx";
import { RxCross1 } from "react-icons/rx";
import axios from "axios";
import { IoHomeOutline } from "react-icons/io5";
import { FaRegBuilding } from "react-icons/fa";
function Header({ activeHeading }) {
  const { cart } = useSelector((state) => state.cart);
  const { wishlist } = useSelector((state) => state.wishlist);

  const { isAuthenticated, user, loading } = useSelector((state) => state.user);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchData, setSearchData] = useState(null);
  const [active, setActive] = useState(false);
  const [dropDown, setDropDown] = useState(false);
  const [openCart, setOpenCart] = useState(false);
  const [openWishlist, setOpenWishlist] = useState(false);
  const [open, setOpen] = useState(false);
  const searchInput = React.useRef(null);
  const { allProducts } = useSelector((state) => state.products);
  const [sections, setSections] = useState();

  useEffect(() => {
    if (user?.role === "admin") {
      axios.get(`${server}/section/get-sections/${user._id}`).then((res) => {
        setSections(res.data.sections);
      });
    }
  }, [isAuthenticated]);

  window.addEventListener("scroll", () => {
    if (window.scrollY > 70) {
      setActive(true);
    } else {
      setActive(false);
    }
  });

  return (
    <>
      {/* ${
          user?.role === "admin" ? "justify-between" : "justify-end"
        } */}
      <div
        className={`${
          active === true ? "shadow-sm fixed top-0 left-0 z-10" : null
        } transition hidden 800px:flex items-center justify-between w-full h-[70px] bg-[#3321c8]`}
      >
        <div className="flex">
          {user?.role === "admin" && (
            <div onClick={() => setDropDown(!dropDown)}>
              <div
                className={`${styles.section} relative ${styles.normalFlex} justify-between`}
              >
                <div className="relative h-[60px] mt-[10px] w-[270px] hidden 1000px:block">
                  <BiMenuAltLeft
                    size={30}
                    className="absolute top-3 left-2 cursor-pointer"
                  />
                  <button className="h-[100%] w-full flex justify-normal items-center pl-10 bg-white font-sans text-lg font[500] select-none rounded-t-md">
                    All Sections
                  </button>
                  <IoIosArrowDown
                    size={20}
                    className="absolute top-4 right-2 cursor-pointer"
                    onClick={() => setDropDown(!dropDown)}
                  ></IoIosArrowDown>
                  {dropDown ? (
                    <DropDown
                      categoriesData={sections}
                      setDropDown={setDropDown}
                    />
                  ) : null}
                </div>
              </div>
            </div>
          )}
          <div className={`${styles.normalFlex}`}>
            <div className={`items-center justify-center m-5`}>
              <Link to={"/"}>
                <IoHomeOutline size={30} color="rgb(255 255 255 / 83%)" />
              </Link>
            </div>
            {user?.role !== "admin" && (
              <div className={`items-center justify-center`}>
                <Link to={"/company-login"}>
                  <FaRegBuilding size={30} color="rgb(255 255 255 / 83%)" />
                </Link>
              </div>
            )}
          </div>
        </div>
        {/* Nav items */}

        <div className="flex">
          {isAuthenticated && user.role == "user" ? (
            <div className="items-center justify-center text-white mr-[15px] text-lg">
              $
              {user.accountBalance &&
                user.accountBalance.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                })}
            </div>
          ) : (
            <div></div>
          )}
          {/* Heart */}
          <div className={`${styles.normalFlex}`}>
            <div
              className="relative cursor-pointer mr-[15px]"
              onClick={() => setOpenWishlist(true)}
            >
              <AiOutlineHeart
                size={30}
                color="rgb(255 255 255 / 83%)"
              ></AiOutlineHeart>
              <span className="absolute right-0 top-0 rounded-full bg-[#3bc177] w-4 h-4 top right p-0 m-0 text-white font-mono text-[12px] leading-tight text-center">
                {wishlist && wishlist.length}
              </span>
            </div>
          </div>

          {/* Shopping Cart */}
          <div className={`${styles.normalFlex}`}>
            <div
              className="relative cursor-pointer mr-[15px]"
              onClick={() => setOpenCart(true)}
            >
              <AiOutlineShoppingCart
                size={30}
                color="rgb(255 255 255 / 83%)"
              ></AiOutlineShoppingCart>
              <span className="absolute right-0 top-0 rounded-full bg-[#3bc177] w-4 h-4 top right p-0 m-0 text-white font-mono text-[12px] leading-tight text-center">
                {cart && cart.length}
              </span>
            </div>
          </div>

          {/* Profile Pic */}
          <div className={`${styles.normalFlex}`}>
            <div className="relative cursor-pointer mr-[15px]">
              {isAuthenticated ? (
                <Link to="/profile">
                  <img
                    src={`${backend_url}${user.avatar}`}
                    alt=""
                    className="w-[35px] h-[35px] rounded-full"
                  />
                </Link>
              ) : (
                <Link to="/login">
                  <CgProfile
                    size={30}
                    color="rgb(255 255 255 / 83%)"
                  ></CgProfile>
                </Link>
              )}
            </div>
          </div>
          {/* Cart */}
          {openCart ? <Cart setOpenCart={setOpenCart}></Cart> : null}
          {/* wishlist */}
          {openWishlist ? (
            <Wishlist setOpenWishlist={setOpenWishlist}></Wishlist>
          ) : null}
        </div>
      </div>

      {/* Mobile Header */}
      <div
        className={`${
          active === true ? "shadow-sm  top-0 left-0 z-10" : null
        }w-full h-[60px] bg-white z-50 top-0 left-0 shadow-sm 800px:hidden`}
      >
        <div className="w-full flex items-center justify-between">
          <div>
            <BiMenuAltLeft
              size={40}
              className="ml-4 cursor-pointer"
              onClick={() => setOpen(true)}
            />
          </div>

          <div>
            <div className="relative mr-[20px]">
              <AiOutlineShoppingCart
                size={30}
                onClick={() => setOpenCart(true)}
              />
              <span className="absolute right-0 top-0 rounded-full bg-[#3bc177] w-4 h-4 top right p-0 m-0 text-white font-mono text-[12px] leading-tight text-center">
                {cart && cart.length}
              </span>
            </div>
          </div>
          {/* cart popup */}
          {openCart ? <Cart setOpenCart={setOpenCart} /> : null}

          {/* wishlist popup */}
          {openWishlist ? <Wishlist setOpenWishlist={setOpenWishlist} /> : null}
        </div>

        {/* Header Sidebar*/}
        {open && (
          <div
            className={`fixed w-full bg-[#0000005f] z-20 h-full top-0 left-0`}
          >
            <div className="fixed w-[60%] bg-white h-screen top-0 left-0 z-10">
              <div className="w-full justify-between flex pr-3">
                <div>
                  <div
                    className="relative mr-[15px]"
                    onClick={() => setOpenWishlist(true) || setOpen(false)}
                  >
                    <AiOutlineHeart size={30} className="mt-5 ml-3" />
                    <span className="absolute right-0 top-0 rounded-full bg-[#3bc177] w-4 h-4 top right p-0 m-0 text-white font-mono text-[12px] leading-tight text-center">
                      {wishlist && wishlist.length}
                    </span>
                  </div>
                </div>
                <RxCross1
                  size={30}
                  className="ml-4 mt-5 cursor-pointer"
                  onClick={() => setOpen(false)}
                />
              </div>
              <div className="my-8 w-[92%] m-auto h-[30px]"></div>

              {/* Navigation */}
              <Navbar active={activeHeading}></Navbar>
              <br />
              <br />
              <br />
              <div className="flex w-full justify-center">
                {!isAuthenticated ? (
                  <>
                    <Link
                      to={"/login"}
                      className="text-[18px] pr-[10px] text-[#000000b7]"
                    >
                      Login{" "}
                    </Link>
                    <Link
                      to={"/sign-up"}
                      className="text-[18px] text-[#000000b7]"
                    >
                      Sign up
                    </Link>
                  </>
                ) : (
                  <div>
                    <Link to={"/profile"}>
                      <img
                        src={`${backend_url}${user.avatar}`}
                        alt=""
                        className="w-[60px] h-[60px] rounded-full border-[3px] border-[#3bc177]"
                      />
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default Header;
