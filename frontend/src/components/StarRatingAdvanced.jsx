import React from "react";
import { Rating } from "flowbite-react";

const customTheme = {
  base: "flex items-center gap-2",
  label:
    "w-4 shrink-0 text-start text-sm font-medium leading-none text-gray-900 dark:text-white",
  progress: {
    base: "h-2.5 w-80 rounded-full bg-gray-200 dark:bg-gray-700",
    fill: "h-2.5 rounded-full bg-yellow-300",
    label:
      "w-8 shrink-0 text-right text-sm font-medium leading-none text-primary-700 hover:underline dark:text-primary-500 sm:w-auto sm:text-left",
  },
};

function StarRatingAdvanced() {
  return (
    <>
      <p className="mb-4 text-sm font-medium text-gray-500 dark:text-gray-400">
        1,745 ratings
      </p>
      <Rating.Advanced theme={customTheme} percentFilled={100}>
        5
      </Rating.Advanced>
      <Rating.Advanced theme={customTheme} percentFilled={80}>
        4
      </Rating.Advanced>
      <Rating.Advanced theme={customTheme} percentFilled={60}>
        3
      </Rating.Advanced>
      <Rating.Advanced theme={customTheme} percentFilled={40}>
        2
      </Rating.Advanced>
      <Rating.Advanced theme={customTheme} percentFilled={20}>
        1
      </Rating.Advanced>
    </>
  );
}

export default StarRatingAdvanced;
