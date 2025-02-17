import React from "react";
import {
  HiArchive,
  HiOfficeBuilding,
  HiStar,
  HiUserGroup,
  HiViewGridAdd,
} from "react-icons/hi";
import { NavLink } from "react-router-dom";

function DashboardSidebar() {
  const navLinkClass = (isActive) => {
    return `flex items-center p-2 text-base font-medium ${
      isActive
        ? "text-gray-900 dark:text-white bg-gray-100 dark:hover:bg-gray-700"
        : "text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
    } rounded-lg group`;
  };

  return (
    <aside
      className="fixed top-0 left-0 z-40 w-64 h-screen pt-14 transition-transform -translate-x-full bg-white border-r border-gray-200 md:translate-x-0 dark:bg-gray-800 dark:border-gray-700"
      aria-label="Sidenav"
      id="drawer-navigation"
    >
      <div className="overflow-y-auto py-5 px-3 h-full bg-white dark:bg-gray-800">
        <form action="#" method="GET" className="md:hidden mb-2">
          <label htmlFor="sidebar-search" className="sr-only">
            Search
          </label>
          <div className="relative">
            <div className="flex absolute inset-y-0 left-0 items-center pl-3 pointer-events-none">
              <svg
                className="w-5 h-5 text-gray-500 dark:text-gray-400"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                ></path>
              </svg>
            </div>
            <input
              type="text"
              name="search"
              id="sidebar-search"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full pl-10 p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
              placeholder="Search"
            />
          </div>
        </form>
        <ul className="space-y-2">
          <li>
            <a
              href="#"
              className="flex items-center p-2 text-base font-medium text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
            >
              <svg
                aria-hidden="true"
                className="w-6 h-6 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M2 10a8 8 0 018-8v8h8a8 8 0 11-16 0z"></path>
                <path d="M12 2.252A8.014 8.014 0 0117.748 8H12V2.252z"></path>
              </svg>
              <span className="ml-3">Overview</span>
            </a>
          </li>
          <li>
            <NavLink
              to="/admin/users"
              className={({ isActive }) => navLinkClass(isActive)}
            >
              <HiUserGroup className="w-6 h-6 text-gray-500" />
              <span className="ml-3">Users</span>
            </NavLink>
          </li>
        </ul>
        <ul className="pt-5 mt-5 space-y-2 border-t border-gray-200 dark:border-gray-700">
          <li>
            <NavLink
              to="/admin/categories"
              className={({ isActive }) => navLinkClass(isActive)}
            >
              <HiViewGridAdd className="w-6 h-6 text-gray-500" />
              <span className="ml-3">Categories</span>
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/admin/products"
              className={({ isActive }) => navLinkClass(isActive)}
            >
              <HiArchive className="w-6 h-6 text-gray-500" />
              <span className="ml-3">Products</span>
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/admin/reviews"
              className={({ isActive }) => navLinkClass(isActive)}
            >
              <HiStar className="w-6 h-6 text-gray-500" />
              <span className="ml-3">Reviews</span>
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/admin/vendors"
              className={({ isActive }) => navLinkClass(isActive)}
            >
              <HiOfficeBuilding className="w-6 h-6 text-gray-500" />
              <span className="ml-3">Vendors</span>
            </NavLink>
          </li>
        </ul>
      </div>
    </aside>
  );
}

export default DashboardSidebar;
