import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { HiPencil, HiPlus, HiSearch, HiTrash } from "react-icons/hi";
import api from "../../api/endpoint";
import DashboardTableSearchForm from "../../components/DashboardTableSearchForm";
import DashboardTableNoDataRow from "../../components/DashboardTableNoDataRow";
import DashboardMainLayout from "../../layouts/DashboardMainLayout";
import { formatDate } from "../../utils";

function VendorList() {
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchVendors = async () => {
    try {
      const response = await api.get("/api/vendors/");
      setVendors(response.data);
    } catch (error) {
      console.error("Error fetching vendors:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVendors();
  }, []);

  return (
    <DashboardMainLayout>
      <section className="bg-gray-50 dark:bg-gray-900 p-3 sm:p-5">
        <div className="mx-auto max-w-screen-full px-4 lg:px-12">
          <div className="bg-white dark:bg-gray-800 relative shadow-md sm:rounded-lg overflow-hidden">
            <div className="flex flex-col md:flex-row items-center justify-between space-y-3 md:space-y-0 md:space-x-4 p-4">
              <div className="w-full md:w-1/2">
                <form className="flex items-center">
                  <label htmlFor="simple-search" className="sr-only">
                    Search
                  </label>
                  <div className="relative w-full">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                      <HiSearch className="w-5 h-5 text-gray-500" />
                    </div>
                    <input
                      type="text"
                      id="simple-search"
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full pl-10 p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                      placeholder="Search"
                      required=""
                    />
                  </div>
                </form>
              </div>
              <div className="w-full md:w-auto flex flex-col md:flex-row space-y-2 md:space-y-0 items-stretch md:items-center justify-end md:space-x-3 flex-shrink-0">
                <Link
                  to="/admin/vendors/add"
                  type="button"
                  class="flex items-center justify-center text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
                >
                  <HiPlus className="h-4 w-4 mr-2" />
                  Add vendor
                </Link>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                  <tr>
                    <th scope="col" className="px-4 py-3">
                      Vendor name
                    </th>
                    <th scope="col" className="px-4 py-3">
                      Description
                    </th>
                    <th scope="col" className="px-4 py-3">
                      Email
                    </th>
                    <th scope="col" className="px-4 py-3">
                      Address
                    </th>
                    <th scope="col" className="px-4 py-3">
                      Phone number
                    </th>
                    <th scope="col" className="px-4 py-3">
                      Status
                    </th>
                    <th scope="col" className="px-4 py-3">
                      Created at
                    </th>
                    <th scope="col" className="px-4 py-3">
                      Updated at
                    </th>
                    <th scope="col" className="px-4 py-3">
                      <span className="sr-only">Actions</span>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {vendors.length > 0 ? (
                    vendors.map((vendor) => (
                      <tr
                        key={vendor.id}
                        className="border-b dark:border-gray-700"
                      >
                        <th
                          scope="row"
                          className="px-4 py-3 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                        >
                          {vendor.name}
                        </th>
                        <td className="px-4 py-3">{vendor.description}</td>
                        <td className="px-4 py-3">{vendor.email}</td>
                        <td className="px-4 py-3">{vendor.address}</td>
                        <td className="px-4 py-3">{vendor.phone_number}</td>
                        <td className="px-4 py-3">{vendor.status}</td>

                        <td className="px-4 py-3">
                          {formatDate(vendor.created_at)}
                        </td>
                        <td className="px-4 py-3">
                          {formatDate(vendor.updated_at)}
                        </td>
                        <td className="px-4 py-3 flex gap-2 items-center justify-end">
                          <Link
                            to={`/admin/vendors/${vendor.id}/edit`}
                            type="button"
                            class="flex items-center justify-center text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
                          >
                            <HiPencil className="h-4 w-4 mr-2" />
                            Edit
                          </Link>
                          <button
                            type="button"
                            class="flex items-center justify-center focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900"
                          >
                            <HiTrash className="h-4 w-4 mr-2" />
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <DashboardTableNoDataRow columns={9} />
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>
    </DashboardMainLayout>
  );
}

export default VendorList;
