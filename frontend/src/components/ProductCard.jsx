import React from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { HiOutlineShoppingCart } from "react-icons/hi";
import StarRating from "./StarRating";

function ProductCard({ product }) {
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
      <div className="h-56 w-full">
        <Link to={`/products/${product.slug}`}>
          <img
            className="mx-auto h-full dark:hidden"
            src={`${product.image}`}
            alt={`${product.name} Image`}
          />
        </Link>
      </div>
      <div className="pt-6">
        <div className="mb-4 flex items-center justify-between gap-4">
          {product.has_discount && (
            <span className="me-2 rounded bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-primary-800 dark:bg-primary-900 dark:text-primary-300">
              Up to {product.discount_percentage}% off
            </span>
          )}
        </div>

        <Link
          to={`/products/${product.slug}`}
          className="text-lg font-semibold leading-tight text-gray-900 hover:underline dark:text-white"
        >
          {product.name}
        </Link>

        <div className="mt-2 flex items-center gap-2">
          <StarRating ratingValue={product.rating} />
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
            ({product.totalReviews})
          </p>
        </div>

        <div className="mt-4 flex items-center justify-between">
          <div className="flex flex-col gap-1">
            {product.hasDiscount ? (
              <>
                <p className="text-lg font-bold leading-tight text-gray-900 dark:text-white">
                  Rs.{product.discountPrice}
                </p>
                <p className="text-sm font-medium leading-tight text-gray-600 line-through dark:text-white">
                  Rs.{product.price}
                </p>
              </>
            ) : (
              <p className="text-lg font-bold leading-tight text-gray-900 dark:text-white">
                Rs.{product.price}
              </p>
            )}
          </div>

          {product.status === "Out of Stock" ? (
            <button
              type="button"
              class="inline-flex items-center text-white bg-red-400 dark:bg-red-500 cursor-not-allowed font-medium rounded-lg text-sm px-5 py-2.5 text-center"
              disabled
            >
              Out of stock
            </button>
          ) : (
            <button
              type="button"
              className="inline-flex items-center rounded-lg bg-blue-700 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-800 focus:outline-none focus:ring-4  focus:ring-primary-300 dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
            >
              <HiOutlineShoppingCart className="-ms-2 me-2 h-5 w-5" />
              Add to cart
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

ProductCard.propTypes = {
  product: PropTypes.object.isRequired,
};

export default ProductCard;
