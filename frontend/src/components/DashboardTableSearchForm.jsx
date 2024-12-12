import React from "react";
import PropTypes from "prop-types";
import { HiSearch } from "react-icons/hi";

function DashboardTableSearchForm({
  searchQuery,
  setSearchQuery,
  handleSearchSubmit,
}) {
  return (
    <form className="flex items-center" onSubmit={handleSearchSubmit}>
      <label htmlFor="search" className="sr-only">
        Search
      </label>
      <div className="relative w-full">
        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
          <HiSearch className="w-5 h-5 text-gray-500" />
        </div>
        <input
          type="search"
          id="search"
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full pl-10 p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
          placeholder="Search"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
    </form>
  );
}

DashboardTableSearchForm.propTypes = {
  searchQuery: PropTypes.string.isRequired,
  setSearchQuery: PropTypes.func.isRequired,
  handleSearchSubmit: PropTypes.func.isRequired,
};

export default DashboardTableSearchForm;
