import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { useParams } from "react-router-dom";
import ProductReviewList from "./ProductReviewList";
import StarRatingAdvanced from "../../components/StarRatingAdvanced";
import { fetchProductReviews } from "../../services/api/productApi";

function ProductReview({ product }) {
  const [productReviews, setProductReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  // filters
  const [rating, setRating] = useState("");
  let { productSlug } = useParams();

  const getProductReviews = async () => {
    try {
      const data = await fetchProductReviews(productSlug, rating);
      setProductReviews(data.results);
    } catch (error) {
      console.error("Error loading product reviews:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getProductReviews();
  }, [productSlug, rating]);

  return (
    <>
      <div className="mx-auto max-w-screen-xl px-4 2xl:px-0">
        <div className="flex items-center gap-2">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
            Ratings & Reviews of {product.name}
          </h2>
        </div>

        <div className="my-6 gap-8 sm:flex sm:items-start md:my-8">
          <div className="shrink-0 space-y-4">
            <p className="text-2xl font-semibold leading-none text-gray-900 dark:text-white">
              {product.rating}/5
            </p>
          </div>

          {/* product ratings */}
          <div className="mt-6 min-w-0 flex-1 space-y-3 sm:mt-0">
            <StarRatingAdvanced />
          </div>
        </div>

        {/* product review heading and filters */}
        <div className="gap-4 sm:flex sm:items-center sm:justify-between border-y-2">
          <h2 className="text-sm font-medium text-gray-900 dark:text-white sm:text-2xl">
            Product reviews
          </h2>

          <div className="mt-6 sm:mt-0">
            <label
              htmlFor="rating-filter"
              className="sr-only mb-2 block text-sm font-medium text-gray-900 dark:text-white"
            >
              Select rating
            </label>
            <select
              id="rating-filter"
              value={rating}
              className="block w-full min-w-[8rem] rounded-lg border border-gray-50 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-gray-50 focus:ring-gray-50 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder:text-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
              onChange={(e) => setRating(e.target.value)}
            >
              <option value="">All stars</option>
              <option value="5">5 stars</option>
              <option value="4">4 stars</option>
              <option value="3">3 stars</option>
              <option value="2">2 stars</option>
              <option value="1">1 star</option>
            </select>
          </div>
        </div>

        {/* product review list */}
        <div className="mt-6 divide-y divide-gray-200 dark:divide-gray-700">
          {productReviews.length > 0 ? (
            productReviews.map((review) => (
              <ProductReviewList key={review.id} review={review} />
            ))
          ) : (
            <p>No product reviews yet.</p>
          )}
        </div>

        <div className="mt-6 text-center">
          <button
            type="button"
            className="mb-2 me-2 rounded-lg border border-gray-200 bg-white px-5 py-2.5 text-sm font-medium text-gray-900 hover:bg-gray-100 hover:text-primary-700 focus:z-10 focus:outline-none focus:ring-4 focus:ring-gray-100 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white dark:focus:ring-gray-700"
          >
            View more reviews
          </button>
        </div>
      </div>
    </>
  );
}

ProductReview.propTypes = {
  product: PropTypes.object.isRequired,
};

export default ProductReview;
