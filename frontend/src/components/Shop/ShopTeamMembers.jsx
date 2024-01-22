import React, { useEffect, useState } from "react";
import { backend_url, server } from "../../Server";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { RxCross1 } from "react-icons/rx";
import { getAllMembersShop } from "../../redux/actions/seller";
const ShopTeamMembers = () => {
  const { members, seller } = useSelector((state) => state.seller);
  const [data, setData] = useState({});
  const [email, setEmail] = useState("");

  const dispatch = useDispatch();

  const handleSubmit = async (e) => {
    e.preventDefault();
    axios
      .get(`${server}/shop/shop-add-member/${seller._id}/${email}`)
      .then((res) => {
        setData(res.data.user[0]);
        window.location.reload();
      })
      .catch((error) => {
        toast.error(error.message);
      });
    setEmail("");
  };

  const removeUser = async (index) => {
    axios
      .get(`${server}/shop/shop-remove-member/${index}/${seller._id}`)
      .then((res) => {
        setData(res.data.user[0]);
        window.location.reload();
      })
      .catch((error) => {
        window.location.reload();
      });
  };
  useEffect(() => {
    console.log(members);
  }, [members]);

  return (
    <div className="flex flex-col">
      <div className="m-8">
        <div className="flex flex-col justify-center w-full">
          <div className="relative">
            <img
              src={`${backend_url}${seller.avatar}`}
              className="w-[150px] h-[150px] rounded-full object-cover border-[3px] border-[#3ad132]"
              alt=""
            />
          </div>
          <br></br>
          <div className="flex flex-col">
            {/* {members &&
              members.map((i, index) => (
                <div className="flex flex-row items-center">
                  <div className="flex items-center m-2 text-lg">
                    <RxCross1
                      size={15}
                      className="mr-3 cursor-pointer"
                      onClick={() => removeUser(index)}
                    />
                    {members[index].name}
                  </div>
                  <div>
                    {members[index].companyRole
                      ? members[index].companyRole
                      : " No role assigned"}
                  </div>
                </div>
              ))} */}
          </div>
        </div>
      </div>
      <div className="text-center">
        <form onSubmit={handleSubmit}>
          <div>
            <label className="pb-2">Add Users by email</label>
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
              value="Add"
              className="mt-2 cursor-pointer appearance-none block w-full px-3 h-[35px] border border-gray-300 rounded-[3px] placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>
        </form>
      </div>
    </div>
  );
};

export default ShopTeamMembers;
