import React from "react";
import { Link } from "react-router-dom";
import { useState } from "react";
import styles from "../../../styles/styles";
import {
  AiFillStar,
  AiOutlineStar,
  AiFillHeart,
  AiOutlineHeart,
  AiOutlineEye,
  AiOutlineShoppingCart,
} from "react-icons/ai";
function ProductCard({ data }) {
  const [click, setClick] = useState(false);
  const [open, setOpen] = useState(false);
  const d = data.name;
  const product_name = d.replace(/\s+/g, "-");

  return (
    <>
      <div className="w-full h-[370px] bg-white rounded-lg shadow-sm p-3 relative cursor-pointer">
        <div className="flex justify-end"></div>
        <Link to={`/product/${product_name}`}>
          <img
            src={data.image_Url[0].url}
            alt=""
            className="w-full h-[170px] object-contain"
          />
        </Link>
        <Link to="/">
          <h5 className={`${styles.shop_name}`}>{data.shop.name}</h5>
        </Link>

        <Link to="/">
          <h4 className="pb-3 font-[500]">
            {data.name.length > 40 ? data.name.slice(0, 40) + "..." : data.name}
          </h4>
          <div className="flex">
            <AiFillStar
              size={20}
              className="mr-2 cursor-pointer"
              color="#F6BA00"
            ></AiFillStar>
            <AiFillStar
              size={20}
              className="mr-2 cursor-pointer"
              color="#F6BA00"
            ></AiFillStar>
            <AiFillStar
              size={20}
              className="mr-2 cursor-pointer"
              color="#F6BA00"
            ></AiFillStar>
            <AiFillStar
              size={20}
              className="mr-2 cursor-pointer"
              color="#F6BA00"
            ></AiFillStar>
            <AiOutlineStar
              size={20}
              className="mr-2 cursor-pointer"
              color="#F6BA00"
            ></AiOutlineStar>
          </div>

          <div className="py-2 flex items-center justify-between">
            <div className="flex">
              <h5 className={`${styles.productDiscountPrice}`}>
                ${data.price === 0 ? data.price : data.discount_price}
              </h5>
              <h4 className={`${styles.price}`}>
                {data.price ? "$" + data.price : null}
              </h4>
            </div>
            <span className="font-[400] text-[17px] text-[#6AD284]">
              {data.total_sell} sold
            </span>
          </div>
        </Link>

        {/* Side options */}

        <div>
          {click ? (
            <AiFillHeart
              size={22}
              className="cursor-pointer absolute right-2 top-5"
              onClick={() => setClick(!click)}
              color={click ? "red" : "#333"}
              title="Remove from Wishlist"
            />
          ) : (
            <AiOutlineHeart
              size={22}
              className="cursor-pointer absolute right-2 top-5"
              onClick={() => setClick(!click)}
              color={click ? "red" : "#333"}
              title="Add to Wishlist"
            />
          )}
          <AiOutlineEye
            size={22}
            className="cursor-pointer absolute right-2 top-14"
            onClick={() => setOpen(!open)}
            color={"#333"}
            title="Preview"
          />
          <AiOutlineShoppingCart
            size={22}
            className="cursor-pointer absolute right-2 top-24"
            onClick={() => setOpen(!open)}
            color={"#444"}
            title="Add to cart"
          />
        </div>
      </div>
    </>
  );
}

export default ProductCard;
