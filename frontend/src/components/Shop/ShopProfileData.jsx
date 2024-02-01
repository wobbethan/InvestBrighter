import React, { useEffect, useState } from "react";
import { productData } from "../../static/data";
import ProductCard from "../Route/ProductCard/ProductCard";
import { Link, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import styles from "../../styles/styles";
import { getAllEventsShop } from "../../redux/actions/event";
import { getAllProductsShop } from "../../redux/actions/product";
import Ratings from "../products/Ratings.jsx";
import { backend_url, server } from "../../Server.js";
import { getAllMembersShop } from "../../redux/actions/seller.js";
import axios from "axios";

const ShopProfileData = ({ isOwner }) => {
  const { seller } = useSelector((state) => state.seller);
  const { products } = useSelector((state) => state.products);
  const { events } = useSelector((state) => state.events);
  const [members, setMembers] = useState([]);
  const { id } = useParams();
  const dispatch = useDispatch();
  const [active, setActive] = useState(1);

  useEffect(() => {
    dispatch(getAllProductsShop(id));
    dispatch(getAllEventsShop(id));

    const getMembers = async () => {
      await axios
        .get(`${server}/shop/get-all-members-shop/${id}`)
        .then((response) => {
          setMembers(response.data.members);
        })
        .catch((err) => {
          console.log(err);
        });
    };
    getMembers();
  }, [active]);

  return (
    <div className="w-full">
      <div className="flex w-full items-center justify-between">
        <div className="w-full flex">
          <div className="flex items-center" onClick={() => setActive(1)}>
            <h5
              className={`font-[600] text-[20px] ${
                active === 1 ? "text-red-500" : "text-[#333]"
              } cursor-pointer pr-[20px]`}
            >
              Active Investments
            </h5>
          </div>

          <div className="flex items-center" onClick={() => setActive(3)}>
            <h5
              className={`font-[600] text-[20px] ${
                active === 3 ? "text-red-500" : "text-[#333]"
              } cursor-pointer pr-[20px]`}
            >
              Team Members
            </h5>
          </div>
        </div>
        <div>
          {isOwner && (
            <div>
              <Link to="/dashboard">
                <div className={`${styles.button} !rounded-[4px] h-[42px]`}>
                  <span className="text-[#fff]">Go Dashboard</span>
                </div>
              </Link>
            </div>
          )}
        </div>
      </div>

      <br />
      {active === 1 && (
        <div className="grid grid-cols-1 gap-[20px] md:grid-cols-2 md:gap-[25px] lg:grid-cols-3 lg:gap-[25px] xl:grid-cols-4 xl:gap-[20px] mb-12 border-0">
          {products &&
            products.map((i, index) => (
              <ProductCard data={i} key={index} isShop={true} />
            ))}
        </div>
      )}

      {active === 2 && (
        <div className="w-full">
          <div className="grid grid-cols-1 gap-[20px] md:grid-cols-2 md:gap-[25px] lg:grid-cols-3 lg:gap-[25px] xl:grid-cols-4 xl:gap-[20px] mb-12 border-0">
            {events &&
              events.map((i, index) => (
                <ProductCard
                  data={i}
                  key={index}
                  isShop={true}
                  isEvent={true}
                />
              ))}
          </div>
          {events && events.length === 0 && (
            <h5 className="w-full text-center py-5 text-[25px]">
              No Events have for this shop!
            </h5>
          )}
        </div>
      )}

      {active === 3 && (
        <div className="w-full">
          {seller.teamMembers.length > 0 ? (
            <div className="grid grid-cols-1 gap-[20px] md:grid-cols-2 md:gap-[25px] lg:grid-cols-3 lg:gap-[25px] xl:gap-[20px] mb-12 border-0">
              {members &&
                members.map((i, index) => (
                  <TeamMemberCard member={members[index]} />
                ))}
            </div>
          ) : (
            <div className="w-full text-center py-5 text-[25px]">
              This company currently has not added any team members
            </div>
          )}
        </div>
      )}
    </div>
  );
};

const TeamMemberCard = ({ member }) => {
  return (
    <div className=" w-[80%] 800px:w-full h-[250px] bg-white rounded-3xl shadow-sm p-3 relative flex-col items-center justify-center text-center content-center">
      <div className="justify-center self-center flex">
        <img
          draggable={false}
          className="w-[150px] h-[150px] object-contain rounded-3xl m-[10px]"
          src={`${backend_url}${member.avatar}`}
        />
      </div>
      <div className="text-2xl text-bold">{member.name}</div>
      {member.companyRole !== "Not Assigned" && (
        <div className="text-xl italic text-slate-400">
          {member.companyRole}
        </div>
      )}{" "}
    </div>
  );
};

export default ShopProfileData;
