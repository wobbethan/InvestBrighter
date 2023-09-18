import React, { useState } from "react";
import styles from "../../styles/styles";
import { Link } from "react-router-dom";
import { categoriesData, productData } from "../../static/data";
import { AiOutlineSearch } from "react-icons/ai";
import { IoIosArrowDown, IoIosArrowForward } from "react-icons/io";
import { BiMenuAltLeft } from "react-icons/bi";
import DropDown from "./DropDown.jsx";
function Header() {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchData, setSearchData] = useState(null);
  const [active, setActive] = useState(false);
  const [dropDown, setDropDown] = useState(false);
  const searchInput = React.useRef(null);

  const handleSearchChange = (e) => {
    const term = e.target.value;
    setSearchTerm(term);

    const filterProducts =
      productData &&
      productData.filter((product) =>
        product.name.toLowerCase().includes(term.toLowerCase())
      );
    setSearchData(filterProducts);
  };

  window.addEventListener("scroll", () => {
    if (window.screenY > 70) {
      setActive(true);
    } else {
      setActive(false);
    }
  });
  return (
    <>
      <div className={`${styles.section}`}>
        <div className="hidden 800px:h-[50px] 800px:my-[20px] 800px:flex items-center justify-between">
          <div>
            <Link to="/">
              <img
                src="https://shopo.quomodothemes.website/assets/images/logo.svg"
                alt=""
              />
            </Link>
          </div>
          <div className="w-[50%] relative">
            <input
              ref={searchInput}
              type="text"
              placeholder="Search Product..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="h-[40px] w-full px-2 border-[#3957db] border-[2px] rounded-md"
            />
            <AiOutlineSearch
              size={30}
              className="absolute right-2 top-1.5 cursor-pointer"
            ></AiOutlineSearch>
            {searchData &&
            searchData.length &&
            (document.activeElement === searchInput.current) !== 0 ? (
              <div className="absolute min-h-[30vh] bg-slate-50 shadow-sm-2 z-[9] p-4">
                {searchData &&
                  searchData.map((i, index) => {
                    const d = i.name;

                    const Product_name = d.replace(/\s+/g, "-");
                    return (
                      <Link to={`/product/${Product_name}`}>
                        <div className="w-full flex items-start py-3">
                          <img
                            className="w-[40px] h-[40px] mr-[10px]"
                            src={i.image_Url[0].url}
                            alt=""
                          />
                          <h1>{i.name}</h1>
                        </div>
                      </Link>
                    );
                  })}
              </div>
            ) : null}
          </div>
          <div className={`${styles.button}`}>
            <Link to="/seller">
              <h1 className="text-[#fff] flex items-center">
                Become Seller{" "}
                <IoIosArrowForward className="ml-1"></IoIosArrowForward>
              </h1>
            </Link>
          </div>
        </div>
        <div
          className={`${styles.section} relative ${styles.normalFlex} justify-between`}
        ></div>
      </div>
      <div
        className={`${
          active === true ? "shadow-sm fixed top-0 left-0 z-10" : null
        } transition hidden 800px:flex items-center justify-between w-full h-[70px] bg-[#3321c8]`}
      >
        <div>
          <div className="relative h-[60px] mt-[10px] w-[270px] hidden 1000px:block">
            <BiMenuAltLeft size={30} className="absolute top-3 left-2" />
            <button className="h-[100%] w-full flex justify-between items-center pl-10 bg-white font-sans text-lg font[500] select-none rounded-t-md">
              All Categories
            </button>
            <IoIosArrowDown
              size={20}
              className="absolute top-4 right-2 cursor-pointer"
              onClick={() => setDropDown(!dropDown)}
            ></IoIosArrowDown>
            {dropDown ? <DropDown categoriesData={categoriesData} /> : null}
          </div>
        </div>
      </div>
    </>
  );
}

export default Header;
