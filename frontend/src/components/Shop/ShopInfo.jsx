import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { backend_url, server } from "../../Server";
import styles from "../../styles/styles";
import axios from "axios";
import { useParams, Link } from "react-router-dom";
import { getAllProductsShop } from "../../redux/actions/product";
import Loader from "../Layout/Loader";

const ShopInfo = ({ isOwner }) => {
  const [data, setData] = useState({});
  const { products } = useSelector((state) => state.products);
  const [isLoading, setIsLoading] = useState(false);
  const { id } = useParams();
  const dispatch = useDispatch();
  let options = {
    timeZone: "America/New_York",
    year: "numeric",
    month: "numeric",
    day: "numeric",
    hour12: true,
    minute: "numeric",
    hour: "numeric",
  };
  useEffect(() => {
    dispatch(getAllProductsShop(id));
    setIsLoading(true);
    axios
      .get(`${server}/shop/get-shop-info/${id}`)
      .then((res) => {
        setData(res.data.shop);
        setIsLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setIsLoading(false);
      });
  }, []);

  const logoutHandler = async () => {
    axios.get(`${server}/shop/logout`, {
      withCredentials: true,
    });
    window.location.reload();
  };

  return (
    <>
      {isLoading ? (
        <Loader />
      ) : (
        <div>
          <div className="w-full py-5">
            <div className="w-full flex item-center justify-center">
              <img
                src={`${data.avatar?.url}`}
                alt=""
                className="w-[150px] h-[150px] object-cover rounded-full"
              />
            </div>
            <h3 className="text-center py-2 text-[20px]">{data.name}</h3>
            <p className="text-[16px] text-[#000000a6] p-[10px] flex items-center">
              {data?.description}
            </p>
          </div>
          {data?.valuation !== 0 && (
            <div className="p-3">
              <h5 className="font-[600]">Valuation</h5>
              <h4 className="text-[#000000a6]">
                ${data.valuation?.toLocaleString()}
              </h4>
            </div>
          )}
          {/* <div className="p-3">
            <h5 className="font-[600]">Founding Share Price</h5>
            <h4 className="text-[#000000a6]">{data.foundingSharePrice}</h4>
          </div> */}
          {data?.finalAcquisition !== 0 && (
            <div className="p-3">
              <h5 className="font-[600]">Final Acquisition</h5>
              <h4 className="text-[#000000a6]">
                ${data.finalAcquisition?.toLocaleString()}
              </h4>
            </div>
          )}

          <div className="p-3">
            <h5 className="font-[600]">Joined On</h5>
            <h4 className="text-[#000000b0]">
              {new Date(data?.createdAt).toLocaleString("en-US", options)}
            </h4>
          </div>
          {isOwner && (
            <div className="py-3 px-4">
              <Link to="/settings">
                <div
                  className={`${styles.button} !w-full !h-[42px] !rounded-[5px]`}
                >
                  <span className="text-white">Edit Shop</span>
                </div>
              </Link>
              <div
                className={`${styles.button} !w-full !h-[42px] !rounded-[5px]`}
                onClick={logoutHandler}
              >
                <span className="text-white">Log Out</span>
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
};
export default ShopInfo;
