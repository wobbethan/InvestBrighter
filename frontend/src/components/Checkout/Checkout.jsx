import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "../../styles/styles";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import { server } from "../../Server";
import { toast } from "react-toastify";
import { RxCross1 } from "react-icons/rx";

const Payment = () => {
  const [orderData, setOrderData] = useState([]);
  const [open, setOpen] = useState(false);
  const { user } = useSelector((state) => state.user);
  const { cart } = useSelector((state) => state.cart);
  const navigate = useNavigate();

  useEffect(() => {
    const orderData = JSON.parse(localStorage.getItem("latestOrder"));
    setOrderData(orderData);
  }, []);

  const totalPrice = cart.reduce((acc, item) => acc + item.qty * item.price, 0);

  const cashOnDeliveryHandler = async (e) => {
    e.preventDefault();
    for (const item of cart) {
      try {
        const config = {
          headers: {
            "Content-Type": "application/json",
          },
        };

        let order = {
          company: item,
          user: user && user,
          totalPrice: item.qty * item.price,
          quantity: item.qty,
        };

        const res = await axios
          .post(`${server}/order/create-order`, order, config)
          .then((res) => {
            if (res.data.status === true) {
              navigate("/order/success");
            } else {
              navigate("/order/fail");
            }
          });
        setOpen(false);

        localStorage.setItem("cartItems", JSON.stringify([]));
        localStorage.setItem("latestOrder", JSON.stringify([]));
      } catch (error) {
        console.log(error);
      }
    }
    // navigate("/order/success");
    // window.location.reload();

    toast.success("Order successful!");
  };

  return (
    <div className="w-full flex flex-col items-center py-8">
      <div className="w-[90%] 1000px:w-[70%] block 800px:flex">
        <div className="w-full 800px:w-[65%]">
          <PaymentInfo
            user={user}
            open={open}
            setOpen={setOpen}
            cashOnDeliveryHandler={cashOnDeliveryHandler}
            orderData={orderData}
            totalPrice={totalPrice}
          />
        </div>
        <div className="w-full 800px:w-[35%] 800px:mt-0 mt-8">
          <CartData orderData={orderData} totalPrice={totalPrice} />
        </div>
      </div>
    </div>
  );
};

const PaymentInfo = ({
  cashOnDeliveryHandler,
  user,
  orderData,
  totalPrice,
}) => {
  const [select, setSelect] = useState(1);

  return (
    <div className="w-full 800px:w-[95%] bg-[#fff] rounded-md p-5 pb-8">
      {/* select buttons */}
      <div>
        <br />
        {/* cash on delivery */}
        <div>
          <div className="flex w-full pb-5 border-b mb-2">
            <div
              className="w-[25px] h-[25px] rounded-full bg-transparent border-[3px] border-[#1d1a1ab4] relative flex items-center justify-center"
              onClick={() => setSelect(1)}
            >
              {select === 1 ? (
                <div className="w-[13px] h-[13px] bg-[#1d1a1acb] rounded-full" />
              ) : null}
            </div>
            <h4 className="text-[18px] pl-2 font-[600] text-[#000000b1]">
              Pay with account balance:{" "}
              <span className="font-bold">
                ${user.accountBalance.toLocaleString()}
              </span>
            </h4>
          </div>

          {/* cash on delivery */}
          {select === 1 ? (
            <div className="w-full flex">
              <form className="w-full" onSubmit={cashOnDeliveryHandler}>
                <input
                  disabled={user?.accountBalance >= totalPrice ? false : true}
                  type="submit"
                  value="Confirm"
                  className={`${styles.button} ${
                    user?.accountBalance >= totalPrice
                      ? "!bg-[#f63b60]"
                      : "!bg-[#a3a0a0] !cursor-not-allowed"
                  } text-[#fff] h-[45px] rounded-[5px] cursor-pointer text-[18px] font-[600]`}
                />
              </form>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};

const CartData = ({ orderData, totalPrice }) => {
  return (
    <div className="w-full bg-[#fff] rounded-md p-5 pb-8">
      <div className="flex justify-between">
        <h3 className="text-[16px] font-[400] text-[#000000a4]">subtotal:</h3>
        <h5 className="text-[18px] font-[600]">
          ${totalPrice.toLocaleString()}
        </h5>
      </div>
      <br />

      <h5 className="text-[18px] font-[600] text-end pt-3">
        ${totalPrice.toLocaleString()}
      </h5>
      <br />
    </div>
  );
};

export default Payment;
