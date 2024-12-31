import api from "./endpoint";

export const fetchUserCart = async () => {
  try {
    const response = await api.get("/api/carts/user/");
    return response.data;
  } catch (error) {
    console.error("Error fetching user cart:", error);
    throw error;
  }
};

export const addToCart = async (productId) => {
  try {
    const response = await api.post("/api/carts/add/", {
      product: productId,
    });
    return response;
  } catch (error) {
    console.error("Error adding item to cart:", error);
    throw error;
  }
};

export const cartItemIncrementQuantity = (itemId) => {
  try {
    const response = api.patch(`/api/carts/increment/${itemId}/`);
    return response;
  } catch (error) {
    console.error("Error incrementing cart item quantity:", error);
    throw error;
  }
};

export const cartItemDecrementQuantity = () => {
  try {
    const response = api.patch(`/api/carts/decrement/${itemId}/`);
    return response;
  } catch (error) {
    console.error("Error decrementing cart item quantity:", error);
    throw error;
  }
};

export const removeFromCart = async (itemId) => {
  try {
    const response = await api.delete(`/api/carts/remoe/${itemId}/`);
  } catch (error) {
    console.error(error.response?.data);
    console.error("Error removing product from cart:", error);
    throw error;
  }
};
