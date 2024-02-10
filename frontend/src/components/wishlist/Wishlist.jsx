import React, { useState } from "react";
import { RxCross1 } from "react-icons/rx";
import styles from "../../styles/styles";
import { IoBagHandleOutline } from "react-icons/io5";
import { BsCartPlus } from "react-icons/bs";
import { Link } from "react-router-dom";
import { AiOutlineHeart } from "react-icons/ai";
import { useDispatch, useSelector } from "react-redux";
import { removeFromWishlist } from "../../redux/actions/wishlist.js";
import { backend_url } from "../../Server";
import { addToCart } from "../../redux/actions/cart";
import { toast } from "react-toastify";

const Wishlist = ({ setOpenWishlist }) => {
  const { wishlist } = useSelector((state) => state.wishlist);
  const { user } = useSelector((state) => state.user);

  const dispatch = useDispatch();

  const removeFromWishlistHandler = (data) => {
    dispatch(removeFromWishlist(data));
  };
  const addToCartHandler = (data) => {
    const currentDate = new Date();
    let roundStarted = null;
    let roundEnded = null;
    if (data.start_Date !== "undefined" && data.finish_Date !== "undefined") {
      const startDate = new Date(data.start_Date);
      const endDate = new Date(data.finish_Date);
      roundStarted = currentDate > startDate;
      roundEnded = currentDate > endDate;
    }

    if (data.shopId === user.companyId) {
      toast.error("Cannot Invest in your own company");
    } else if (roundEnded === true) {
      toast.error("The round has concluded");
    } else if (roundStarted === false) {
      toast.error("Unable to invest until round has started");
    } else {
      const newData = { ...data, qty: 1 };
      dispatch(addToCart(newData));
      toast.success("Added to cart");
    }
  };
  return (
    <div className="fixed top-0 left-0 w-full bg-[#0000004b] h-screen z-10">
      <div className="fixed top-0 right-0 h-full w-[80%] overflow-y-scroll 800px:w-[25%] bg-white flex flex-col justify-between shadow-sm">
        {wishlist && wishlist.length === 0 ? (
          <div className="w-full h-screen flex items-center justify-center">
            <div className="flex w-full justify-end pt-5 pr-5 fixed top-3 right-3">
              <RxCross1
                size={25}
                className="cursor-pointer"
                onClick={() => setOpenWishlist(false)}
              ></RxCross1>
            </div>
            <h5>Wishlist is Empty!</h5>
          </div>
        ) : (
          <>
            {" "}
            <div>
              <div className="flex w-full justify-end pt-5 pr-5">
                <RxCross1
                  size={25}
                  className="cursor-pointer"
                  onClick={() => setOpenWishlist(false)}
                />
              </div>
              {/* Items */}
              <div className={`${styles.normalFlex} p-4`}>
                <AiOutlineHeart size={25} />
                <h5 className="pl-2 text-[20px] font-[500]">
                  {wishlist && wishlist.length === 1
                    ? wishlist.length + " item"
                    : wishlist.length + " items"}
                </h5>
              </div>
              {/* Cart single Items */}
              <div className="w-full border-t">
                {wishlist &&
                  wishlist.map((i, index) => (
                    <CartSingle
                      key={index}
                      data={i}
                      removeFromWishlistHandler={removeFromWishlistHandler}
                      addToCartHandler={addToCartHandler}
                    />
                  ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

const CartSingle = ({ data, removeFromWishlistHandler, addToCartHandler }) => {
  const [value, setValue] = useState(1);
  const totalPrice = data.price * value;
  return (
    <div className="border-b p-4">
      <div className="w-full items-center justify-evenly flex">
        <RxCross1
          className="cursor-pointer 800px:mb-['unset'] 800px:ml-['unset'] mb-2 ml-2"
          onClick={() => removeFromWishlistHandler(data)}
        />
        <img
          src={`${data?.shop?.avatar.url}`}
          alt=""
          className="w-[130px] h-min ml-2 mr-2 rounded-[5px] select-none"
        />

        <div className="pl-[5px]">
          <h1>{data.name}</h1>

          <h4 className="font-[600] pt-3 800px:pt-[3px] text-[17px] text-[#d02222] font-Roboto">
            ${totalPrice?.toLocaleString()}
          </h4>
        </div>
        <div>
          <BsCartPlus
            size={20}
            className="cursor-pointer"
            title="Add to Cart"
            onClick={() => addToCartHandler(data)}
          />
        </div>
      </div>
    </div>
  );
};

export default Wishlist;
