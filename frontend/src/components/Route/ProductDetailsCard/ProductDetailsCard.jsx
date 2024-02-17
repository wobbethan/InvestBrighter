import React, { useEffect, useState } from "react";
import { RxCross1 } from "react-icons/rx";
import styles from "../../../styles/styles";
import { Link } from "react-router-dom";
import {
  AiOutlineMessage,
  AiOutlineHeart,
  AiFillHeart,
  AiOutlineShoppingCart,
} from "react-icons/ai";
import { backend_url, server } from "../../../Server";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { addToCart } from "../../../redux/actions/cart";
import {
  addToWishlist,
  removeFromWishlist,
} from "../../../redux/actions/wishlist";
import axios from "axios";

const ProductDetailsCard = ({ setOpen, data }) => {
  const { wishlist } = useSelector((state) => state.wishlist);
  const { cart } = useSelector((state) => state.cart);
  const { isAuthenticated } = useSelector((state) => state.user);
  const { user } = useSelector((state) => state.user);

  const [newShopInfo, setNewShopInfo] = useState();
  const [count, setCount] = useState(1);
  const [click, setClick] = useState(false);
  const [select, setSelect] = useState(false);
  const dispatch = useDispatch();

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

  const decrementCount = () => {
    if (count > 1) {
      setCount(count - 1);
    }
  };
  const incrementCount = () => {
    setCount(count + 1);
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

      if (user.companyId === product.shopId) {
        toast.error("Cannot Invest in your own company");
      } else if (roundEnded === true) {
        toast.error("The round has concluded");
      } else if (roundStarted === false) {
        toast.error("Unable to invest until round has started");
      } else if (status == "Locked") {
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

  return (
    <div className="bg-[#fff]">
      {data ? (
        <div className="fixed w-full h-screen top-0 left-0 bg-[#00000030] z-40 flex items-center justify-center">
          <div className="w-[90%] 800px:w-[60%] h-[90vh] overflow-y-scroll 800px:h-[75vh] bg-white rounded-md shadow-sm relative p-4">
            <RxCross1
              size={30}
              className="absolute right-3 top-3 z-50 cursor-pointer"
              onClick={() => setOpen(false)}
            />

            <div className="block w-full 800px:flex">
              <div className="w-full 800px:w-[50%]">
                <img
                  src={`${newShopInfo?.avatar && newShopInfo?.avatar.url}`}
                  alt=""
                  className="p-2"
                />
                <h4 className="text-3xl text-bold p-3 text-center">
                  Valuation: ${newShopInfo?.valuation.toLocaleString()}
                </h4>
                <div className="flex mt-2">
                  <Link to={`/shop/preview/${data.shop._id}`} className="flex">
                    <img
                      src={`${newShopInfo && newShopInfo?.avatar.url}`}
                      alt=""
                      className="w-[50px] h-[50px] rounded-full mr-2"
                    />
                    <div>
                      <h3 className={`${styles.shop_name}`}>
                        {newShopInfo?.name}
                      </h3>
                    </div>
                  </Link>
                </div>

                <h5 className="text-[16px] text-[red] mt-5">
                  {data.stock} remaining
                </h5>
              </div>

              <div className="w-full 800px:w-[50%] pt-5 pl-[5px] pr-[5px]">
                <h1 className={`${styles.productTitle} text-[20px]`}>
                  {newShopInfo?.name}
                </h1>
                <p>{newShopInfo?.description}</p>

                <div className="flex pt-3">
                  <h4 className={`${styles.productDiscountPrice}`}>
                    ${data.price?.toLocaleString()}
                  </h4>
                </div>
                <div className="flex items-center mt-12 justify-between pr-3">
                  <div>
                    <button
                      className="bg-gradient-to-r from-teal-400 to-teal-500 text-white font-bold rounded-l px-4 py-2 shadow-lg hover:opacity-75 transition duration-300 ease-in-out"
                      onClick={decrementCount}
                    >
                      -
                    </button>
                    <span className="bg-gray-200 text-gray-800 font-medium px-4 py-[11px]">
                      {count}
                    </span>
                    <button
                      className="bg-gradient-to-r from-teal-400 to-teal-500 text-white font-bold rounded-l px-4 py-2 shadow-lg hover:opacity-75 transition duration-300 ease-in-out"
                      onClick={incrementCount}
                    >
                      +
                    </button>
                  </div>
                  <div>
                    {click ? (
                      <AiFillHeart
                        size={30}
                        className="cursor-pointer"
                        onClick={() => removeFromWishlistHandler(data)}
                        color={click ? "red" : "#333"}
                        title="Remove from wishlist"
                      />
                    ) : (
                      <AiOutlineHeart
                        size={30}
                        className="cursor-pointer"
                        onClick={() => addToWishlistHandler(data)}
                        title="Add to wishlist"
                        color={click ? "red" : "#333"}
                      />
                    )}
                  </div>
                </div>
                <div
                  className={`${styles.button} mt-6 rounded-[4px] h-11 flex items-center`}
                  onClick={() => addToCartHandler(data._id)}
                >
                  <span className="text-[#fff] flex items-center">
                    Add to cart <AiOutlineShoppingCart className="ml-1" />
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default ProductDetailsCard;
