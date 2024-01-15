import React, { useEffect } from "react";
import ShopLogin from "../../components/Shop/ShopLogin.jsx";
import { useNavigate } from "react-router";
import { useSelector } from "react-redux";

const ShopLoginPage = () => {
  const navigate = useNavigate();
  const { isSeller, seller, isLoading } = useSelector((state) => state.seller);
  useEffect(() => {
    if (isSeller === true) {
      navigate(`/dashboard`);
    }
  }, [isLoading, isSeller]);
  return (
    <div>
      <ShopLogin></ShopLogin>
    </div>
  );
};

export default ShopLoginPage;
