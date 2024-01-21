import React, { useState } from "react";
import { server } from "../../Server";
import axios from "axios";
import { useSelector } from "react-redux";

const ShopTeamMembers = () => {
  const { seller } = useSelector((state) => state.seller);
  const [data, setData] = useState({});
  const [email, setEmail] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    axios
      .get(`${server}/shop/shop-add-member/${seller._id}/${email}`)
      .then((res) => {
        setData(res.data.user);
      })
      .catch((error) => {
        console.log(error);
      });
  };
  return (
    <div>
      <div>Returned Name: {data[0] && data[0].name}</div>
      <form onSubmit={handleSubmit}>
        <div>
          <label className="pb-2">Search Users by email</label>
          <input
            type="email"
            value={email}
            className="mt-2 appearance-none block w-full px-3 h-[35px] border border-gray-300 rounded-[3px] placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter user email..."
          />
        </div>
        <div>
          <input
            type="submit"
            name=""
            id=""
            value="Search"
            className="mt-2 cursor-pointer appearance-none block w-full px-3 h-[35px] border border-gray-300 rounded-[3px] placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
        </div>
      </form>
    </div>
  );
};

export default ShopTeamMembers;
