import { api } from "../../../config/api";
import {
  createOrderFailure,
  createOrderRequest,
  createOrderSuccess,
  getUsersOrdersFailure,
  getUsersOrdersRequest,
  getUsersOrdersSuccess,
} from "./ActionCreators";
import {
  GET_USERS_NOTIFICATION_FAILURE,
  GET_USERS_NOTIFICATION_SUCCESS,
} from "./ActionTypes";

export const createOrder = (reqData) => {
  return async (dispatch) => {
    dispatch(createOrderRequest());
    try {
      const { data } = await api.post("/api/order", reqData.order, {
        headers: {
          Authorization: `Bearer ${reqData.jwt}`,
        },
      });
      if (data.payment_url) {
        window.location.href = data.payment_url;
      }
      console.log("Created order data:", data);
      dispatch(createOrderSuccess(data));
    } catch (error) {
      console.error("Error while creating order:", error); // Log the error
      dispatch(createOrderFailure(error));
    }
  };
};

export const getUsersOrders = (jwt) => {
  return async (dispatch) => {
    dispatch(getUsersOrdersRequest());
    try {
      const { data } = await api.get(`/api/order/user`, {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      });
      console.log("User's orders:", data);
      dispatch(getUsersOrdersSuccess(data));
    } catch (error) {
      console.error("Error while fetching user's orders:", error);
      dispatch(getUsersOrdersFailure(error));
    }
  };
};

export const getUsersNotificationAction = () => {
  return async (dispatch) => {
    dispatch(createOrderRequest());
    try {
      const { data } = await api.get("/api/notifications");
      console.log("All notifications:", data);
      dispatch({ type: GET_USERS_NOTIFICATION_SUCCESS, payload: data });
    } catch (error) {
      console.error("Error while fetching notifications:", error);
      dispatch({ type: GET_USERS_NOTIFICATION_FAILURE, payload: error });
    }
  };
};
