import React from "react";
import { Breadcrumb } from "flowbite-react";
import {
  HiHome,
  HiLocationMarker,
  HiMail,
  HiPencilAlt,
  HiOutlinePencilAlt,
  HiPhone,
  HiOutlineHeart,
  HiOutlineReceiptRefund,
  HiOutlineShoppingCart,
  HiOutlineStar,
} from "react-icons/hi";
import { Link } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

function Profile() {
  const { user } = useAuth();

  return (
    <>
      <section className="bg-white py-8 antialiased dark:bg-gray-900 md:py-8">
        <div className="mx-auto max-w-screen-lg px-4 2xl:px-0">
          <Breadcrumb aria-label="Profile breadcrumb" className="mb-4">
            <Breadcrumb.Item href="#" icon={HiHome}>
              Home
            </Breadcrumb.Item>
            <Breadcrumb.Item href="#">Account</Breadcrumb.Item>
            <Breadcrumb.Item>Profile</Breadcrumb.Item>
          </Breadcrumb>

          <h2 className="mb-4 text-xl font-semibold text-gray-900 dark:text-white sm:text-2xl md:mb-6">
            General overview
          </h2>
          <div className="grid grid-cols-2 gap-6 border-b border-t border-gray-200 py-4 dark:border-gray-700 md:py-8 lg:grid-cols-4 xl:gap-16">
            <div>
              <HiOutlineShoppingCart className="mb-2 h-8 w-8 text-gray-400 dark:text-gray-500" />
              <h3 className="mb-2 text-gray-500 dark:text-gray-400">Orders</h3>
              <span className="flex items-center text-2xl font-bold text-gray-900 dark:text-white">
                24
              </span>
            </div>
            <div>
              <HiOutlineStar className="mb-2 h-8 w-8 text-gray-400 dark:text-gray-500" />
              <Link to="/users/reviews">
                <h3 className="mb-2 text-gray-500 dark:text-gray-400 hover:text-blue-600">
                  Reviews
                </h3>
              </Link>
              <span className="flex items-center text-2xl font-bold text-gray-900 dark:text-white">
                16
              </span>
            </div>
            <div>
              <HiOutlineHeart className="mb-2 h-8 w-8 text-gray-400 dark:text-gray-500" />
              <h3 className="mb-2 text-gray-500 dark:text-gray-400">
                Favorite products
              </h3>
              <span className="flex items-center text-2xl font-bold text-gray-900 dark:text-white">
                8
              </span>
            </div>
            <div>
              <HiOutlineReceiptRefund className="mb-2 h-8 w-8 text-gray-400 dark:text-gray-500" />
              <h3 className="mb-2 text-gray-500 dark:text-gray-400">
                Product returns
              </h3>
              <span className="flex items-center text-2xl font-bold text-gray-900 dark:text-white">
                2
              </span>
            </div>
          </div>
          <div className="py-4 md:py-8">
            <div className="mb-4 grid gap-4 sm:grid-cols-2 sm:gap-8 lg:gap-16">
              <div className="space-y-4">
                <div className="flex space-x-4">
                  <img
                    className="h-16 w-16 rounded-lg"
                    src={user.avatar}
                    alt={`${user.username} avatar`}
                  />
                  <div>
                    <h2 className="flex items-center text-xl font-bold leading-none text-gray-900 dark:text-white sm:text-2xl">
                      {user.firstName} {user.lastName}
                    </h2>
                  </div>
                </div>
                <dl className="">
                  <dt className="font-semibold text-gray-900 dark:text-white">
                    Email Address
                  </dt>
                  <dd className="flex items-center gap-1 text-gray-500 dark:text-gray-400">
                    <HiMail className="hidden h-5 w-5 shrink-0 text-gray-400 dark:text-gray-500 lg:inline" />
                    {user.email}
                  </dd>
                </dl>
                <dl>
                  <dt className="font-semibold text-gray-900 dark:text-white">
                    Home Address
                  </dt>
                  <dd className="flex items-center gap-1 text-gray-500 dark:text-gray-400">
                    <HiHome className="hidden h-5 w-5 shrink-0 text-gray-400 dark:text-gray-500 lg:inline" />
                    2 Miles Drive, NJ 071, New York, United States of America
                  </dd>
                </dl>
                <dl>
                  <dt className="font-semibold text-gray-900 dark:text-white">
                    Delivery Address
                  </dt>
                  <dd className="flex items-center gap-1 text-gray-500 dark:text-gray-400">
                    <HiLocationMarker className="hidden h-5 w-5 shrink-0 text-gray-400 dark:text-gray-500 lg:inline" />
                    9th St. PATH Station, New York, United States of America
                  </dd>
                </dl>
              </div>
              <div className="space-y-4">
                <dl>
                  <dt className="font-semibold text-gray-900 dark:text-white">
                    Phone Number
                  </dt>
                  <dd className="flex items-center gap-1 text-gray-500 dark:text-gray-400">
                    <HiPhone className="hidden h-5 w-5 shrink-0 text-gray-400 dark:text-gray-500 lg:inline" />
                    +1234 567 890 / +12 345 678
                  </dd>
                </dl>
              </div>
            </div>
            <button
              type="button"
              data-modal-target="accountInformationModal2"
              data-modal-toggle="accountInformationModal2"
              className="inline-flex w-full items-center justify-center rounded-lg bg-blue-700 px-5 py-2.5 text-sm font-medium text-white hover:bg-primary-800 focus:outline-none focus:ring-4 focus:ring-primary-300 dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800 sm:w-auto"
            >
              <HiOutlinePencilAlt className="-ms-0.5 me-1.5 h-4 w-4" />
              Edit profile
            </button>
          </div>
        </div>
      </section>
    </>
  );
}

export default Profile;
