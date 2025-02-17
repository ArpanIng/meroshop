import React from "react";
import { Rating } from "flowbite-react";
import PropTypes from "prop-types";

const customTheme = {
  root: {
    base: "flex items-center",
  },
  star: {
    empty: "text-gray-300 dark:text-gray-500",
    filled: "text-yellow-300",
    sizes: {
      sm: "h-5 w-5",
      md: "h-7 w-7",
      lg: "h-10 w-10",
    },
  },
};

function StarRating({ ratingValue, ratingValueDisplay = false, reviewsCount }) {
  return (
    <Rating theme={customTheme}>
      <Rating.Star filled={ratingValue >= 1} />
      <Rating.Star filled={ratingValue >= 2} />
      <Rating.Star filled={ratingValue >= 3} />
      <Rating.Star filled={ratingValue >= 4} />
      <Rating.Star filled={ratingValue >= 5} />

      {/* average rating display */}
      {ratingValueDisplay && (
        <p className="ml-2 text-sm font-medium leading-none text-gray-500 dark:text-gray-400">
          ({ratingValue})
        </p>
      )}
      {/* total reviews display */}
      {reviewsCount >= 0 && (
        <>
          <span className="mx-1.5 h-1 w-1 rounded-full bg-gray-500 dark:bg-gray-400" />
          <p className="text-sm font-medium text-gray-900 dark:text-white">
            {reviewsCount} {reviewsCount === 1 ? "review" : "reviews"}
          </p>
        </>
      )}
    </Rating>
  );
}

StarRating.propTypes = {
  ratingValue: PropTypes.number.isRequired,
  ratingValueDisplay: PropTypes.bool,
  reviewsCount: PropTypes.number,
};

export default StarRating;
