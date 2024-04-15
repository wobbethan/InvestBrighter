import axios from "axios";
import { server } from "../../Server";
// get all orders of user
export const getAllOrdersOfUser = (userId) => async (dispatch) => {
  try {
    dispatch({
      type: "getAllOrdersUserRequest",
    });

    const { data } = await axios.get(
      `${server}/order/get-all-orders/${userId}`
    );

    dispatch({
      type: "getAllOrdersUserSuccess",
      payload: data.orders,
    });
  } catch (error) {
    dispatch({
      type: "getAllOrdersUserFailed",
      payload: error.response.data.message,
    });
  }
};

// get all orders of seller
export const getAllOrdersOfShop = (shopId) => async (dispatch) => {
  try {
    dispatch({
      type: "getAllOrdersShopRequest",
    });

    const { data } = await axios.get(
      `${server}/order/get-seller-all-orders/${shopId}`
    );

    dispatch({
      type: "getAllOrdersShopSuccess",
      payload: data.orders,
    });
  } catch (error) {
    dispatch({
      type: "getAllOrdersShopFailed",
      payload: error.response.data.message,
    });
  }
};

// get all orders for Admin
export const getAllOrdersOfAdmin = (id) => async (dispatch) => {
  try {
    dispatch({
      type: "adminAllOrdersRequest",
    });

    const { data } = await axios.get(`${server}/order/admin-all-orders/${id}`, {
      withCredentials: true,
    });

    dispatch({
      type: "adminAllOrdersSuccess",
      payload: data.orders,
    });
  } catch (error) {
    dispatch({
      type: "adminAllOrdersFailed",
      payload: error.response.data.message,
    });
  }
};

export const filterAllOrdersOfAdmin = (section, id) => async (dispatch) => {
  try {
    dispatch({
      type: "adminFilterAllOrdersRequest",
    });

    const { data } = await axios.get(`${server}/order/admin-all-orders/${id}`, {
      withCredentials: true,
    });

    const filteredOrders = data.orders.filter(
      (order) => order.user.section === section
    );

    dispatch({
      type: "adminFilterAllOrdersSuccess",
      payload: filteredOrders,
    });
  } catch (error) {
    dispatch({
      type: "adminFilterAllOrdersFailed",
    });
  }
};
