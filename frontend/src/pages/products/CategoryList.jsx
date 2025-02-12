import React, { useEffect, useState } from "react";
import { Table } from "flowbite-react";
import { HiPencil, HiPlus, HiTrash } from "react-icons/hi";
import { Link, useSearchParams } from "react-router-dom";
import DashboardTableSearchForm from "../../components/DashboardTableSearchForm";
import DashboardTableNoDataRow from "../../components/DashboardTableNoDataRow";
import DeleteConfirmModal from "../../components/DeleteConfirmModal";
import Loading from "../../components/Loading";
import DashboardMainLayout from "../../layouts/DashboardMainLayout";
import {
  deleteCategory,
  fetchCategories,
} from "../../services/api/categoryApi";
import { formatDate } from "../../utils/formatting";

function CategoryList() {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [loading, setLoading] = useState(true);
  // URL Search Parameters
  const [searchParams, setSearchParams] = useSearchParams();
  // category table search
  const [searchQuery, setSearchQuery] = useState(searchParams.get("q") || "");

  const openDeleteModal = (categorySlug) => {
    setSelectedCategory(categorySlug);
    setOpenModal(true);
  };

  const getCategories = async (searchQuery) => {
    try {
      const data = await fetchCategories(searchQuery);
      setCategories(data);
    } catch (error) {
      console.error("Error loading categories data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setSearchParams(searchQuery ? { q: searchQuery } : {});
    if (searchQuery.trim()) {
      // fetch categories based on user submitted query
      getCategories(searchQuery);
    }
  };

  const handleDelete = async (categorySlug) => {
    try {
      await deleteCategory(categorySlug);
      setCategories((c) =>
        c.filter((category) => category.slug !== categorySlug)
      );
    } catch (error) {
      console.error("Error deleting category:", error);
    }
    setOpenModal(false);
  };

  useEffect(() => {
    // fetch initial categories with an empty query
    getCategories(searchQuery);
  }, []);

  return (
    <DashboardMainLayout>
      <section className="bg-gray-50 dark:bg-gray-900 p-3 sm:p-5">
        <div className="mx-auto max-w-screen-full px-4 lg:px-12">
          <div className="bg-white dark:bg-gray-800 relative shadow-md sm:rounded-lg overflow-hidden">
            {loading ? (
              <Loading />
            ) : (
              <>
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
                      className="flex items-center justify-center text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
                    >
                      <HiPlus className="h-4 w-4 mr-2" />
                      Add category
                    </Link>
                  </div>
                </div>
                <div className="overflow-x-auto">
                  <Table>
                    <Table.Head>
                      <Table.HeadCell>Category name</Table.HeadCell>
                      <Table.HeadCell>Slug</Table.HeadCell>
                      <Table.HeadCell>Created at</Table.HeadCell>
                      <Table.HeadCell>Updated at</Table.HeadCell>
                      <Table.HeadCell>
                        <span className="sr-only">Actions</span>
                      </Table.HeadCell>
                    </Table.Head>
                    <Table.Body className="divide-y">
                      {categories.length > 0 ? (
                        categories.map((category) => (
                          <Table.Row
                            key={category.id}
                            className="bg-white dark:border-gray-700 dark:bg-gray-800"
                          >
                            <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                              {category.name}
                            </Table.Cell>
                            <Table.Cell>{category.slug}</Table.Cell>
                            <Table.Cell>
                              {formatDate(category.createdAt)}
                            </Table.Cell>
                            <Table.Cell>
                              {formatDate(category.updatedAt)}
                            </Table.Cell>
                            <Table.Cell className="px-4 py-3 flex gap-2 items-center justify-end">
                              <Link
                                to={`/admin/categories/${category.slug}/edit`}
                                type="button"
                                className="flex items-center justify-center text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
                              >
                                <HiPencil className="h-4 w-4 mr-2" />
                                Edit
                              </Link>
                              <button
                                type="button"
                                className="flex items-center justify-center focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900"
                                onClick={() => {
                                  openDeleteModal(category.slug);
                                }}
                              >
                                <HiTrash className="h-4 w-4 mr-2" />
                                Delete
                              </button>
                            </Table.Cell>
                          </Table.Row>
                        ))
                      ) : categories.length === 0 && searchQuery ? (
                        <DashboardTableNoDataRow
                          columns={5}
                          message="No results found"
                          message2="Try different keywords or remove search filters"
                        />
                      ) : (
                        <DashboardTableNoDataRow
                          columns={5}
                          message="No categories available."
                        />
                      )}
                    </Table.Body>
                  </Table>

                  {/* Category delete modal */}
                  <DeleteConfirmModal
                    isOpen={openModal}
                    onClose={() => setOpenModal(false)}
                    onConfirm={() => handleDelete(selectedCategory)}
                  />
                </div>
              </>
            )}
          </div>
        </div>
      </section>
    </DashboardMainLayout>
  );
}

export default CategoryList;
