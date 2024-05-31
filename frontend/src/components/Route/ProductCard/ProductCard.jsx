import axios from "axios";
import React, { useEffect, useState } from "react";
import {
  AiFillHeart,
  AiOutlineEye,
  AiOutlineHeart,
  AiOutlineShoppingCart,
} from "react-icons/ai";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { server } from "../../../Server.js";
import { addToCart } from "../../../redux/actions/cart.js";
import {
  addToWishlist,
  removeFromWishlist,
} from "../../../redux/actions/wishlist.js";
import styles from "../../../styles/styles";
import ProductDetailsCard from "../ProductDetailsCard/ProductDetailsCard.jsx";

function ProductCard({ data, isEvent }) {
  const { wishlist } = useSelector((state) => state.wishlist);
  const { cart } = useSelector((state) => state.cart);
  const [click, setClick] = useState(false);
  const [open, setOpen] = useState(false);
  const { isAuthenticated, user } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const [newShopInfo, setNewShopInfo] = useState();

  useEffect(() => {
    const getInfo = async () => {
      await axios
        .get(`${server}/shop/get-shop-info/${data.shopId}`)
        .then((res) => {
          setNewShopInfo(res.data.shop);
        });
    };
    getInfo();
  }, []);

  useEffect(() => {
    if (wishlist && wishlist.find((i) => i._id === data._id)) {
      setClick(true);
    } else {
      setClick(false);
    }
  }, [wishlist]);

  const removeFromWishlistHandler = (data) => {
    setClick(!click);
    dispatch(removeFromWishlist(data));
  };

  const addToWishlistHandler = (data) => {
    if (isAuthenticated) {
      setClick(!click);
      dispatch(addToWishlist(data));
    } else {
      toast.error("Please sign in to add to wishlist");
    }
  };

  const addToCartHandler = async (id) => {
    let roundStarted = null;
    let roundEnded = null;
    let status = null;
    if (isAuthenticated) {
      let product;
      await axios.get(`${server}/product/get-product/${id}`).then((res) => {
        product = res.data.product;
        const currentDate = new Date();
        if (
          product.start_Date !== "undefined" &&
          product.finish_Date !== "undefined"
        ) {
          const startDate = new Date(product.start_Date);
          const endDate = new Date(product.finish_Date);
          roundStarted = currentDate > startDate;
          roundEnded = currentDate > endDate;
        }
      });
      await axios
        .get(`${server}/event/event-status/${product.eventId}`)
        .then((res) => {
          status = res.data.data;
        });

      if (user.companyId === product.shopId && user.role !== "admin") {
        toast.error("Cannot Invest in your own company");
      } else if (roundEnded === true && user.role !== "admin") {
        toast.error("The round has concluded");
      } else if (roundStarted === false && user.role !== "admin") {
        toast.error("Unable to invest until round has started");
      } else if (status == "Locked" && user.role !== "admin") {
        toast.error("The investment round has been locked");
      } else {
        const isItemExists = cart && cart.find((i) => i._id === id);
        if (isItemExists) {
          toast.error("Item already in cart");
        } else {
          if (data.stock < 1) {
            toast.error("Product stock limited");
          } else {
            const cartData = { ...data, qty: 1 };
            dispatch(addToCart(cartData));
            toast.success("Item added to cart");
          }
        }
      }
    } else {
      toast.error("Please sign in to add to cart");
    }
  };

  return (
    <>
      <div className="w-full h-[400px] bg-white rounded-lg shadow-sm p-3 relative">
        <div className="flex justify-end"></div>

        <img
          src={`${newShopInfo?.avatar && newShopInfo?.avatar?.url}`}
          alt=""
          className="w-full h-[170px] object-contain p-6"
        />
        <div className="w-full items-center text-center">
          {newShopInfo?.valuation !== 0 && (
            <h5 className={`${styles.productDiscountPrice} !text-lg`}>
              {" "}
              Valuation: ${newShopInfo?.valuation.toLocaleString()}
            </h5>
          )}
        </div>
        <div className="w-full items-center text-center">
          {newShopInfo?.valuation !== 0 && (
            <h5
              className={`${styles.productDiscountPrice} !text-xs !font-normal`}
            >
              {data.eventName}
            </h5>
          )}
        </div>

        <Link to={`/shop/preview/${data?.shop._id}`}>
          <h5 className={`${styles.shop_name}`}>{newShopInfo?.name}</h5>
        </Link>

        <h4 className="pb-3 font-[500]">
          {newShopInfo?.name?.length > 40
            ? newShopInfo?.name.slice(0, 40) + "..."
            : newShopInfo?.name}{" "}
          | {newShopInfo?.section} class
        </h4>
        <h5 className="text-[16px] text-[red] justify-end">
          {data.stock} remaining
        </h5>

        <div className="py-2 flex items-center justify-between mt-3">
          <div className="flex">
            <h5 className={`${styles.productDiscountPrice} !text-2xl`}>
              ${data.price.toLocaleString()}
            </h5>
          </div>
          <span className="font-[400] text-[17px] text-[#6AD284]">
            {data.sold} Investments
          </span>
        </div>

        {/* Side options */}

        <div>
          {click ? (
            <AiFillHeart
              size={22}
              className="cursor-pointer absolute right-2 top-5"
              onClick={() => removeFromWishlistHandler(data)}
              color={click ? "red" : "#333"}
              title="Remove from Wishlist"
            />
          ) : (
            <AiOutlineHeart
              size={22}
              className="cursor-pointer absolute right-2 top-5"
              onClick={() => addToWishlistHandler(data)}
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
            onClick={() => addToCartHandler(data._id)}
            color={"#444"}
            title="Add to cart"
          />
          {open ? (
            <ProductDetailsCard
              setOpen={setOpen}
              data={data}
            ></ProductDetailsCard>
          ) : null}
        </div>
      </div>
    </>
  );
}

export default ProductCard;
