import axios from "axios";
import { server } from "../../Server";

// get all sections
export const getAllSectionsOfAdmin = (id) => async (dispatch) => {
  try {
    dispatch({
      type: "adminAllSectionsRequest",
    });

    const { data } = await axios.get(`${server}/section/get-sections/${id}`, {
      withCredentials: true,
    });

    dispatch({
      type: "adminAllSectionsSuccess",
      payload: data.sections,
    });
  } catch (error) {
    dispatch({
      type: "adminAllSectionsFailed",
      payload: error.response.data.message,
    });
  }
};
