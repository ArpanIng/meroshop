import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { HiPencil, HiPlus, HiTrash } from "react-icons/hi";
import api from "../../api/endpoint";
import DashboardTableSearchForm from "../../components/DashboardTableSearchForm";
import DashboardTableNoDataRow from "../../components/DashboardTableNoDataRow";
import DashboardMainLayout from "../../layouts/DashboardMainLayout";
import { formatDate } from "../../utils";

function CategoryList() {
  const [categories, setCategories] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchCategories = async (searchQuery) => {
    setLoading(true);
    try {
      const response = await api.get("/api/categories/", {
        params: { q: searchQuery },
      });
      setCategories(response.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    // fetch categories based on the current search
    fetchCategories(searchQuery);
  };

  useEffect(() => {
    // fetch initial category with an empty query
    fetchCategories(searchQuery);
  }, []);

  return (
    <DashboardMainLayout>
      <section className="bg-gray-50 dark:bg-gray-900 p-3 sm:p-5">
        <div className="mx-auto max-w-screen-full px-4 lg:px-12">
          <div className="bg-white dark:bg-gray-800 relative shadow-md sm:rounded-lg overflow-hidden">
            <div className="flex flex-col md:flex-row items-center justify-between space-y-3 md:space-y-0 md:space-x-4 p-4">
              <div className="w-full md:w-1/2">
                <DashboardTableSearchForm
                  searchQuery={searchQuery}
                  setSearchQuery={setSearchQuery}
                  handleSearchSubmit={handleSearchSubmit}
                />
              </div>
              <div className="w-full md:w-auto flex flex-col md:flex-row space-y-2 md:space-y-0 items-stretch md:items-center justify-end md:space-x-3 flex-shrink-0">
                <Link
                  to="/admin/categories/add"
                  type="button"
                  class="flex items-center justify-center text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
                >
                  <HiPlus className="h-4 w-4 mr-2" />
                  Add category
                </Link>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                  <tr>
                    <th scope="col" className="px-4 py-3">
                      Category name
                    </th>
                    <th scope="col" className="px-4 py-3">
                      Slug
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
                  {categories.length > 0 ? (
                    categories.map((category) => (
                      <tr
                        key={category.id}
                        className="border-b dark:border-gray-700"
                      >
                        <th
                          scope="row"
                          className="px-4 py-3 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                        >
                          {category.name}
                        </th>
                        <td className="px-4 py-3">{category.slug}</td>
                        <td className="px-4 py-3">
                          {formatDate(category.created_at)}
                        </td>
                        <td className="px-4 py-3">
                          {formatDate(category.updated_at)}
                        </td>
                        <td className="px-4 py-3 flex gap-2 items-center justify-end">
                          <Link
                            to={`/admin/categories/${category.slug}/edit`}
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
                    <DashboardTableNoDataRow columns={5} />
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

export default CategoryList;
