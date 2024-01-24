//getting all members of a shop
import { server } from "../../Server";
import axios from "axios";

export const getAllMembersShop = (id) => async (dispatch) => {
  try {
    dispatch({
      type: "getAllMembersShopRequest",
    });

    const { data } = await axios.get(
      `${server}/shop/get-all-members-shop/${id}`
    );
    dispatch({
      type: "getAllMembersShopSuccess",
      payload: data.members,
    });
  } catch (error) {
    dispatch({
      type: "getAllMembersShopFail",
      payload: error.response.data.message,
    });
  }
};
