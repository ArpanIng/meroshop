import React from "react";
import PropTypes from "prop-types";
import { HiBadgeCheck } from "react-icons/hi";
import StarRating from "../../components/StarRating";
import { formatDateOnly } from "../../utils/formatting";

function ProductReviewList({ review }) {
  return (
    <div className="gap-3 py-6 sm:flex sm:items-start">
      <div className="shrink-0 space-y-2 sm:w-48 md:w-72">
        <StarRating ratingValue={review.rating} />

        <div className="space-y-0.5">
          <p className="text-base font-semibold text-gray-900 dark:text-white">
            {review.user}
          </p>
          <p className="text-sm font-normal text-gray-500 dark:text-gray-400">
            {formatDateOnly(review.createdAt)}
          </p>
        </div>

        <div className="inline-flex items-center gap-1">
          <HiBadgeCheck className="h-6 w-6 text-green-500 dark:text-green-500" />
          <p className="text-sm font-medium text-green-600 dark:text-white">
            Verified purchase
          </p>
        </div>
      </div>

      <div className="mt-4 min-w-0 flex-1 space-y-4 sm:mt-0">
        <p className="text-base font-normal text-gray-500 dark:text-gray-400">
          {review.comment}
        </p>
      </div>
    </div>
  );
}

ProductReviewList.propTypes = {
  review: PropTypes.object.isRequired,
};

export default ProductReviewList;
