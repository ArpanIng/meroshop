import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button, Dropdown } from "flowbite-react";
import {
  HiCog,
  HiCurrencyDollar,
  HiOutlineShoppingCart,
  HiLogout,
  HiOutlineUserCircle,
  HiViewGrid,
} from "react-icons/hi";
import { useAuth } from "../contexts/AuthContext";

function Navbar() {
  const { isAuthenticated, handleLogout } = useAuth();
  const navigate = useNavigate();

  return (
    <nav className="bg-white dark:bg-gray-800 antialiased">
      <div className="max-w-screen-xl px-4 mx-auto 2xl:px-0 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-8">
            <div className="shrink-0">
              <a href="#" title="" className="">
                <img
                  className="block w-auto h-8 dark:hidden"
                  src="https://flowbite.s3.amazonaws.com/blocks/e-commerce/logo-full.svg"
                  alt=""
                />
                <img
                  className="hidden w-auto h-8 dark:block"
                  src="https://flowbite.s3.amazonaws.com/blocks/e-commerce/logo-full-dark.svg"
                  alt=""
                />
              </a>
            </div>

            <ul className="hidden lg:flex items-center justify-start gap-6 md:gap-8 py-3 sm:justify-center">
              <li>
                <Link
                  to="/"
                  title=""
                  className="flex text-sm font-medium text-gray-900 hover:text-primary-700 dark:text-white dark:hover:text-primary-500"
                >
                  Home
                </Link>
              </li>
              <li className="shrink-0">
                <a
                  href="#"
                  title=""
                  className="flex text-sm font-medium text-gray-900 hover:text-primary-700 dark:text-white dark:hover:text-primary-500"
                >
                  Best Sellers
                </a>
              </li>
            </ul>
          </div>

          <div className="flex items-center lg:space-x-2">
            <Link
              to="/cart"
              type="button"
              className="inline-flex items-center rounded-lg justify-center p-2 hover:bg-gray-100 dark:hover:bg-gray-700 text-sm font-medium leading-none text-gray-900 dark:text-white"
            >
              <span className="sr-only">Cart</span>
              <HiOutlineShoppingCart className="w-5 h-5" />
              <span class="inline-flex items-center justify-center w-4 h-4 ms-1 text-xs font-semibold text-red-800 bg-red-100 rounded-full">
                2
              </span>
            </Link>

            {isAuthenticated ? (
              <>
                <Dropdown label="Account" color="light">
                  <Dropdown.Header>
                    <span className="block text-sm">Bonnie Green</span>
                    <span className="block truncate text-sm font-medium">
                      bonnie@flowbite.com
                    </span>
                  </Dropdown.Header>
                  <Dropdown.Item icon={HiCurrencyDollar}>
                    My Account
                  </Dropdown.Item>
                  <Link to="/profile/me">
                    <Dropdown.Item icon={HiOutlineUserCircle}>
                      Profile
                    </Dropdown.Item>
                  </Link>
                  <Dropdown.Item icon={HiViewGrid}>Dashboard</Dropdown.Item>
                  <Link to="/settings">
                    <Dropdown.Item icon={HiCog}>Settings</Dropdown.Item>
                  </Link>
                  <Dropdown.Divider />
                  <Dropdown.Item icon={HiLogout} onClick={handleLogout}>
                    Sign out
                  </Dropdown.Item>
                </Dropdown>
              </>
            ) : (
              <>
                <Button
                  color="blue"
                  type="button"
                  onClick={() => navigate("/auth/login")}
                >
                  Login
                </Button>
                <Button
                  color="blue"
                  type="button"
                  onClick={() => navigate("/auth/register")}
                >
                  Register
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
