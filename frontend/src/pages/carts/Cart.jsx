import React, { useEffect, useState } from "react";
import { useCart } from "../../contexts/CartContext";
import Loading from "../../components/Loading";

function Cart() {
  const { items } = useCart();
  // const {
  //   items,
  //   originalPrice,
  //   discountedPrice,
  //   discountPercentage,
  //   deliveryCharge,
  //   subTotal,
  //   total,
  //   loading,
  //   error,
  // } = useCart();
  // console.log("items", items);

  // if (loading) {
  //   return <Loading />;
  // }

  return (
    <div>
      <h2>Your cart</h2>
    </div>
  );
}

export default Cart;
