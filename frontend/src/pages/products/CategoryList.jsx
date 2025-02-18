import React, { useEffect, useState } from "react";
import { Table } from "flowbite-react";
import humps from "humps";
import { HiPencil, HiPlus, HiTrash } from "react-icons/hi";
import { useSearchParams } from "react-router-dom";
import DashboardTableSearchForm from "../../components/DashboardTableSearchForm";
import DashboardTableNoDataRow from "../../components/DashboardTableNoDataRow";
import Loading from "../../components/Loading";
import DeletePopupModal from "../../components/modals/DeletePopupModal";
import CategoryFormModal from "../../components/modals/CategoryFormModal";
import DashboardButton from "../../components/ui/DashboardButton";
import DashboardMainLayout from "../../layouts/DashboardMainLayout";
import {
  createCategory,
  deleteCategory,
  fetchCategories,
  fetchCategory,
  updateCategory,
} from "../../services/api/categoryApi";
import { formatDate } from "../../utils/formatting";

function CategoryList() {
  const [categories, setCategories] = useState([]);
  const [category, setCategory] = useState(null);
  const [loading, setLoading] = useState(true);

  // modals
  const [openModal, setOpenModal] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);

  // URL Search Parameters
  const [searchParams, setSearchParams] = useSearchParams();
  // category table search
  const [searchQuery, setSearchQuery] = useState(searchParams.get("q") || "");

  const initialValues = {
    name: category?.name || "",
  };

  const getCategories = async (searchQuery) => {
    try {
      const data = await fetchCategories(searchQuery);
      setCategories(data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    } finally {
      setLoading(false);
    }
  };

  const openCategoryAddModal = () => {
    setCategory(null);
    setOpenModal(true);
  };

  const openCategoryEditModal = async (categorySlug) => {
    try {
      const data = await fetchCategory(categorySlug);
      setCategory(data);
      setOpenModal(true);
    } catch (error) {
      console.error("Error fetching category:", error);
    } finally {
      setLoading(false);
    }
  };

  const openCategoryDeleteModal = (categorySlug) => {
    setSelectedCategory(categorySlug);
    setOpenDeleteModal(true);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setSearchParams(searchQuery ? { q: searchQuery } : {});
    if (searchQuery.trim()) {
      // fetch categories based on user submitted query
      getCategories(searchQuery);
    }
  };

  const handleSubmit = async (data, actions) => {
    try {
      if (category) {
        const response = await updateCategory(category.slug, data);
        if (response.status === 200) {
          setOpenModal(false);
          actions.resetForm();
          getCategories();
        }
      } else {
        const response = await createCategory(data);
        if (response.status === 201) {
          setOpenModal(false);
          getCategories();
          actions.resetForm();
        }
      }
    } catch (error) {
      console.error("Error submiting category data:", error);
      if (error.response && error.response.data) {
        const errorData = error.response.data;
        // map backend errors to formik
        const errors = {};
        Object.keys(errorData).forEach((field) => {
          // convert the error data field into camelcase
          const camelCaseField = humps.camelize(field);
          errors[camelCaseField] = errorData[field].join("");
        });
        actions.setErrors(errors); // Set backend errors in Formik
      } else {
        console.error("An error occured. Please try again.");
      }
    } finally {
      actions.setSubmitting(false);
    }
  };

  const handleCategoryDelete = async (categorySlug) => {
    try {
      await deleteCategory(categorySlug);
      setCategories((c) =>
        c.filter((category) => category.slug !== categorySlug)
      );
    } catch (error) {
      console.error("Error deleting category:", error);
    }
    setOpenDeleteModal(false);
  };

  useEffect(() => {
    // fetch initial categories with an empty query
    getCategories(searchQuery);
  }, []);

  return (
    <>
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
                      <DashboardButton
                        icon={HiPlus}
                        label="Add category"
                        onClick={openCategoryAddModal}
                        data-modal-target="category-modal"
                        data-modal-toggle="category-modal"
                      />
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
                                <DashboardButton
                                  icon={HiPencil}
                                  label="Edit"
                                  onClick={() => {
                                    openCategoryEditModal(category.slug);
                                  }}
                                  data-modal-target="category-modal"
                                  data-modal-toggle="category-modal"
                                />
                                <DashboardButton
                                  icon={HiTrash}
                                  color="red"
                                  label="Delete"
                                  onClick={() => {
                                    openCategoryDeleteModal(category.slug);
                                  }}
                                  data-modal-target="delete-category-modal"
                                  data-modal-toggle="delete-category-modal"
                                />
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
                  </div>
                </>
              )}
            </div>
          </div>
        </section>
      </DashboardMainLayout>

      {/* category modal */}
      <CategoryFormModal
        openModal={openModal}
        initialData={initialValues}
        setOpenModal={setOpenModal}
        onSubmit={handleSubmit}
        modalID="category-modal"
        isEditMode={!!category}
      />

      {/* category delete modal */}
      <DeletePopupModal
        openModal={openDeleteModal}
        setOpenModal={setOpenDeleteModal}
        onConfirm={() => handleCategoryDelete(selectedCategory)}
        confirmationText="Are you sure you want to delete the selected category?"
        modalID="delete-category-modal"
      />
    </>
  );
}

export default CategoryList;
