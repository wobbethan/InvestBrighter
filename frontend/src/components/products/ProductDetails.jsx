import React from "react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import styles from "../../styles/styles";
import { Link } from "react-router-dom";
import {
  AiFillHeart,
  AiOutlineHeart,
  AiOutlineMessage,
  AiOutlineShoppingCart,
} from "react-icons/ai";
import { backend_url, server } from "../../Server";
import { useDispatch, useSelector } from "react-redux";
import { getAllProductsShop } from "../../redux/actions/product";
import { toast } from "react-toastify";
import { addToCart } from "../../redux/actions/cart";
import {
  addToWishlist,
  removeFromWishlist,
} from "../../redux/actions/wishlist";
import axios from "axios";

const ProductDetails = ({ data, id }) => {
  const { wishlist } = useSelector((state) => state.wishlist);
  const { cart } = useSelector((state) => state.cart);
  const { products } = useSelector((state) => state.products);
  const { user, isAuthenticated } = useSelector((state) => state.user);
  const [newShopInfo, setNewShopInfo] = useState();

  const [count, setCount] = useState(1);
  const [click, setClick] = useState(false);
  const [select, setSelect] = useState(0);

  const navigate = useNavigate;
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getAllProductsShop(data && data.shop._id));
    if (wishlist && wishlist.find((i) => i?._id === data?._id)) {
      setClick(true);
    } else {
      setClick(false);
    }
  }, [wishlist, data]);

  useEffect(() => {
    const getInfo = async () => {
      await axios
        .get(`${server}/shop/get-shop-info/${data?.shopId}`)
        .then((res) => {
          setNewShopInfo(res.data.shop);
        });
    };
    getInfo();
  }, []);

  const decrementCount = () => {
    if (count > 1) {
      setCount(count - 1);
    }
  };
  const incrementCount = () => {
    if (data.stock < count + 1) {
      toast.error("Product stock limited");
    } else {
      setCount(count + 1);
    }
  };
  const addToCartHandler = async () => {
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
            const cartData = { ...data, qty: count };
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
    <div className="bg-white">
      {data ? (
        <div className={`unset ${styles.section} w-[90%] 800px:w-[80%]`}>
          <div className="w-full py-5">
            <div className="block w-full 800px:flex">
              <div className="w-full 800px:w-[50%]">
                {" "}
                <img
                  src={`${newShopInfo?.avatar?.url}`}
                  alt=""
                  className="w-[80%]"
                />
              </div>
              <div className="w-full 800px:w-[50%] pt-5">
                <h1 className={`${styles.productTitle}`}>
                  {newShopInfo?.name}
                </h1>
                <p>{newShopInfo?.description}</p>
                <div className="flex pt-3">
                  <h4 className={`${styles.productDiscountPrice}`}>
                    ${data?.price.toLocaleString()}
                  </h4>
                </div>
                <div className="flex items-center mt-12 justify-between pr-3">
                  <div>
                    <button
                      className="bg-gradient-to-r from-teal-400 to-teal-500 text-white font-bold rounded-l px-4 py-2 shadow-lg hover:opacity-75 transition duration-300 ease-in-out"
                      onClick={() => decrementCount()}
                    >
                      -
                    </button>
                    <span className="bg-gray-200 text-gray-800 font-medium px-4 py-[11px]">
                      {count}
                    </span>
                    <button
                      className="bg-gradient-to-r from-teal-400 to-teal-500 text-white font-bold rounded-l px-4 py-2 shadow-lg hover:opacity-75 transition duration-300 ease-in-out"
                      onClick={() => incrementCount()}
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
                        title="Remove from Wishlist"
                      />
                    ) : (
                      <AiOutlineHeart
                        size={30}
                        className="cursor-pointer"
                        onClick={() => addToWishlistHandler(data)}
                        color={click ? "red" : "#333"}
                        title="Add to Wishlist"
                      />
                    )}
                  </div>
                </div>
                <div
                  className={`${styles.button} !mt-6 !rounded !h-11 flex items-center`}
                  onClick={addToCartHandler}
                >
                  <span className="text-white flex items-center">
                    Add to Cart <AiOutlineShoppingCart className="ml-1" />
                  </span>
                </div>
                <div className="flex items-center pt-8">
                  <Link to={`/shop/preview/${data?.shop._id}`}>
                    <img
                      src={`${data?.shop?.avatar.url}`}
                      className="w-[50px] h-[50px] rounded-full mr-2"
                      alt=""
                    />
                  </Link>
                  <div className="pr-8">
                    <Link to={`/shop/preview/${data?.shop._id}`}>
                      <h3 className={`${styles.shop_name} pb-1 pt-1`}>
                        {" "}
                        {data.shop.name}
                      </h3>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <ProductDetailsInfo data={data} products={products} />
          <br />
          <br />
        </div>
      ) : null}
    </div>
  );
};

const ProductDetailsInfo = ({ data, products }) => {
  const [active, setActive] = useState(1);
  return (
    <div className="bg-[#f5f6fb] px-3 800px:px-10 py-2 rounded">
      <div className="w-full flex justify-evenly border-b pt-10 pb-2">
        <div className="relative">
          <h5
            className="text-[#000] text-[18px] px-1 leading-5 font-[600] cursor-pointer 800px:text-[20px]"
            onClick={() => setActive(1)}
          >
            Details
          </h5>
          {active === 1 ? (
            <div className={`${styles.active_indicator}`}></div>
          ) : null}
        </div>

        <div className="relative">
          <h5
            className="text-[#000] text-[18px] px-1 leading-5 font-[600] cursor-pointer 800px:text-[20px]"
            onClick={() => setActive(3)}
          >
            Company Information{" "}
          </h5>
          {active === 3 ? (
            <div className={`${styles.active_indicator}`}></div>
          ) : null}
        </div>
      </div>
      {active === 1 ? (
        <>
          <p className="py-2 text-[18px] leading-8 pb-10 whitespace-pre-line">
            {data.description}
          </p>
        </>
      ) : null}
      {active === 3 ? (
        <div className="w-full block 800px:flex p-5">
          <div className="w-full 800px:w-[50%]">
            <div className="flex items-center">
              <img
                src={`${data?.shop?.avatar.url}`}
                alt=""
                className="w-[50px] h-[50px] rounded-full"
              />
              <div className="pl-3">
                <h3 className={`${styles.shop_name}`}> {data.shop.name}</h3>
              </div>
            </div>
            <p className="pt-2">{data.shop.description}</p>
          </div>
          <div className="w-full 800px:w-[50%] mt-5 800px:mt-0 800px:flex flex-col items-end">
            <div className="text-left">
              <h5 className="font-[600]">
                Joined on:{" "}
                <span className="font-[500]">
                  {data.shop?.createdAt?.slice(0, 10)}
                </span>
              </h5>
              <h5 className="font-[600] pt-3">
                Rounds participated:{" "}
                <span className="font-[500]">
                  {products && products.length}
                </span>
              </h5>

              <Link to={`/shop/preview/${data?.shop._id}`}>
                <div
                  className={`${styles.button} !rounded-[4px] !h-[39.5px] mt-3`}
                >
                  <h4 className="text-white">Visit Company</h4>
                </div>
              </Link>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default ProductDetails;
