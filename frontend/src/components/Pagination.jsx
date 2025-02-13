import React from "react";
import PropTypes from "prop-types";
import { HiChevronLeft, HiChevronRight } from "react-icons/hi";
import { Link } from "react-router-dom";

function Pagination({ currentPage, count, limit, offset, pathName }) {
  const prevBtnclass =
    "flex items-center justify-center h-full py-1.5 px-3 ml-0 text-gray-500 bg-white rounded-l-lg border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white";

  const disabledPrevBtnclass =
    "flex items-center justify-center h-full py-1.5 px-3 ml-0 text-gray-400 cursor-not-allowed bg-gray-100 rounded-l-lg border border-gray-300 hover:bg-gray-100 hover:text-gray-400 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white";

  const nextBtnClass =
    "flex items-center justify-center h-full py-1.5 px-3 leading-tight text-gray-500 bg-white rounded-r-lg border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white";

  const disabledNextBtnClass =
    "flex items-center justify-center h-full py-1.5 px-3 leading-tight text-gray-400 cursor-not-allowed bg-gray-100 rounded-r-lg border border-gray-300 hover:bg-gray-100 hover:text-gray-400 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white";

  const totalPages = Math.ceil(count / limit);

  return (
    <>
      {/* Show pagination only if there are multiple pages */}
      {count > limit && (
        <nav
          className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-3 md:space-y-0 p-4"
          aria-label="Table navigation"
        >
          <span class="text-sm font-normal text-gray-500 dark:text-gray-400">
            Showing{" "}
            <span class="font-semibold text-gray-900 dark:text-white">
              {offset + 1}-{Math.min(offset + limit, count)}{" "}
            </span>
            of{" "}
            <span class="font-semibold text-gray-900 dark:text-white">
              {count}
            </span>
          </span>
          <ul className="inline-flex items-stretch -space-x-px">
            {/* previous page link/button */}
            <li>
              {currentPage > 1 && (
                <Link
                  to={{
                    pathname: "/admin/products",
                    search: `?page=${currentPage - 1}`,
                  }}
                  className={prevBtnclass}
                >
                  <HiChevronLeft className="w-5 h-5 me-2" />
                  Previous
                </Link>
              )}
              {currentPage <= 1 && (
                <button type="button" className={disabledPrevBtnclass} disabled>
                  <HiChevronLeft className="w-5 h-5 me-2" />
                  Previous
                </button>
              )}
            </li>

            {/* next page link/button */}
            <li>
              {currentPage < totalPages && (
                <Link
                  to={{
                    pathname: pathName,
                    search: `?page=${currentPage + 1}`,
                  }}
                  className={nextBtnClass}
                >
                  Next
                  <HiChevronRight className="w-5 h-5 ms-2" />
                </Link>
              )}
              {currentPage >= totalPages && (
                <button type="button" className={disabledNextBtnClass} disabled>
                  Next
                  <HiChevronRight className="w-5 h-5 ms-2" />
                </button>
              )}
            </li>
          </ul>
        </nav>
      )}
    </>
  );
}

Pagination.propTypes = {
  currentPage: PropTypes.number.isRequired,
  count: PropTypes.number.isRequired,
  limit: PropTypes.number.isRequired,
  offset: PropTypes.number.isRequired,
  pathName: PropTypes.string.isRequired,
};

export default Pagination;
