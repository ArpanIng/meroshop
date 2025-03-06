import React, {
  createContext,
  useContext,
  useEffect,
  useReducer,
  useState,
} from "react";
import { addToCart, fetchUserCart } from "../services/api/cartApi";

const initialCartState = {
  items: [],
  originalPrice: 0,
  discountedPrice: 0,
  discountPercentage: 0,
  deliveryCharge: 0,
  subTotal: 0,
  total: 0,
  loading: false,
  error: null,
};

function cartReducer(state, action) {
  switch (action.type) {
    case "FETCH_USER_CART_REQUEST":
      return { ...state, loading: true, error: null };
    case "FETCH_USER_CART_SUCCESS":
      return { ...state, loading: false, ...action.payload };
    case "FETCH_USER_CART_FAILURE":
      return { ...state, loading: false, ...action.payload };
    case "ADD_ITEM":
      return { ...state, ...action.payload };
    case "INCREMENT_QUANTITY":
      return "increment";
    case "DECREMENT_QUANTITY":
      return "decrement";
    case "REMOVE_ITEM":
      return "";
    default:
      return state;
  }
}

const cartContext = createContext();

function CartProvider({ children }) {
  const [state, dispatch] = useReducer(cartReducer, initialCartState);

  const getUserCart = async () => {
    dispatch({ type: "FETCH_USER_CART_REQUEST" });
    try {
      const response = await fetchUserCart();
      dispatch({ type: "FETCH_USER_CART_SUCCESS", payload: response.data });
    } catch (error) {
      console.error("Error loading user cart:", error.message);
      dispatch({ type: "FETCH_USER_CART_FAILURE", payload: error.message });
    }
  };

  const handleCartItemIncrementQuantity = () => {
    dispatch({ type: "INCREMENT_QUANTITY" });
  };

  const handleCartItemDecrementQuantity = () => {
    dispatch({ type: "DECREMENT_QUANTITY" });
  };

  const handleAddToCart = async (productId) => {
    try {
      const response = await addToCart(productId);
      console.info(response?.data?.message);
      if (response.status === 201) {
        // display toast message
      }
      dispatch({ type: "ADD_ITEM", payload: response.data });
    } catch (error) {
      throw error;
    }
  };

  useEffect(() => {
    getUserCart();
  }, []);

  return (
    <cartContext.Provider value={{ ...state, handleAddToCart }}>
      {children}
    </cartContext.Provider>
  );
}

export default CartProvider;

export const useCart = () => {
  return useContext(cartContext);
};
