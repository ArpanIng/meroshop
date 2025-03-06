import React, { useEffect, useState } from "react";
import { Table } from "flowbite-react";
import humps from "humps";
import { useSearchParams } from "react-router-dom";
import { HiPencil, HiPlus, HiTrash } from "react-icons/hi";
import Badge from "../../components/Badge";
import DashboardTableSearchForm from "../../components/DashboardTableSearchForm";
import DashboardTableNoDataRow from "../../components/DashboardTableNoDataRow";
import Loading from "../../components/Loading";
import Pagination from "../../components/Pagination";
import StarRating from "../../components/StarRating";
import DashboardMainLayout from "../../components/layouts/DashboardMainLayout";
import DeletePopupModal from "../../components/modals/DeletePopupModal";
import ProductFormModal from "../../components/modals/ProductFormModal";
import DashboardButton from "../../components/ui/DashboardButton";
import { useChoices } from "../../contexts/ChoicesContext";
import { fetchCategories } from "../../services/api/categoryApi";
import {
  createProduct,
  deleteProduct,
  fetchProduct,
  fetchProducts,
  updateProduct,
} from "../../services/api/productApi";
import { fetchVendors } from "../../services/api/vendorApi";
import { formatDate } from "../../utils/formatting";

function ProductList() {
  const [products, setProducts] = useState([]);
  const [product, setProduct] = useState(null);
  const [categories, setCategories] = useState([]);
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);
  const { productStatusChoices } = useChoices();

  // modals
  const [openModal, setOpenModal] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  // URL Search Parameters
  const [searchParams, setSearchParams] = useSearchParams();
  // product table search
  const search = searchParams.get("q");
  const [searchQuery, setSearchQuery] = useState(search || "");

  // filters
  const categoryFilterParam = searchParams.get("category");
  const [category, setCategory] = useState(categoryFilterParam || "");

  console.log("category", category);

  // product table pagination
  const PRODUCTS_PER_PAGE = 50;
  const page = searchParams.get("page");
  const currentPage = page ? parseInt(page, 10) : 1;
  // offset based on the current page (0 for first page)
  const offset = PRODUCTS_PER_PAGE * (currentPage - 1);
  const [productsCount, setProductsCount] = useState(0);

  // find value of the selected status option based on the label
  const selectedStatusOption = productStatusChoices.find(
    (choice) => choice.label === product?.status
  );
  const selectedStatusOptionValue = selectedStatusOption
    ? selectedStatusOption.value
    : "";

  const initialValues = {
    name: product?.name || "",
    description: product?.description || "",
    price: product?.price || "",
    discountPrice: product?.discountPrice || "",
    stock: product?.stock || "",
    image: product?.image || "",
    categoryId: product?.category?.id || "",
    vendorId: product?.vendor?.id || "",
    status: selectedStatusOptionValue,
  };

  const getProducts = async () => {
    try {
      const data = await fetchProducts(
        searchQuery,
        PRODUCTS_PER_PAGE,
        offset,
        category
      );
      setProducts(data.results);
      setProductsCount(data.count);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  const getCategories = async () => {
    try {
      const data = await fetchCategories();
      setCategories(data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const getVendors = async () => {
    try {
      const data = await fetchVendors();
      setVendors(data.results);
    } catch (error) {
      console.error("Error fetching vendors:", error);
    }
  };

  const openProductAddModal = () => {
    setProduct(null);
    setOpenModal(true);
  };

  const openProductEditModal = async (productSlug) => {
    setLoading(true);
    try {
      const data = await fetchProduct(productSlug);
      setProduct(data);
      setOpenModal(true);
    } catch (error) {
      console.error("Error fetching product:", error);
    } finally {
      setLoading(false);
    }
  };

  const openProductDeleteModal = (productSlug) => {
    setSelectedProduct(productSlug);
    setOpenDeleteModal(true);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setSearchParams({ q: searchQuery });
      // fetch products filtered by the search query
      getProducts();
    }
  };

  const handleSubmit = async (data, actions) => {
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("description", data.description);
    formData.append("price", data.price);
    formData.append("discount_price", data.discountPrice);
    formData.append("stock", data.stock);
    // append the image data only if it is a valid File object
    if (data.image instanceof File) {
      formData.append("image", data.image);
    }
    formData.append("category_id", data.categoryId);
    formData.append("vendor_id", data.vendorId);
    formData.append("status", data.status);

    try {
      let response;
      if (product) {
        response = await updateProduct(product.slug, formData);
      } else {
        response = await createProduct(formData);
      }
      if (response.status === 200 || response.status === 201) {
        setOpenModal(false);
        actions.resetForm();
        getProducts();
      }
    } catch (error) {
      console.error("Error submiting product data:", error);
      if (error.response && error.response.data) {
        const errorData = error.response.data;
        // map backend errors to formik
        const errors = {};
        Object.keys(errorData).forEach((field) => {
          // handle non-field errors
          if (field === "non_field_errors") {
            errors.nonFieldErrors = errorData[field].join("");
          } else {
            // convert error field to camelCase to match formik initialValues
            const camelCaseField = humps.camelize(field);
            console.log("camelCaseField", camelCaseField);
            errors[field] = errorData[field].join("");
          }
        });
        actions.setErrors(errors); // Set backend errors in Formik
      } else {
        console.error("An error occured. Please try again.");
      }
    } finally {
      actions.setSubmitting(false);
    }
  };

  const handleProductDelete = async (productSlug) => {
    try {
      await deleteProduct(productSlug);
      setProducts((p) => p.filter((product) => product.slug !== productSlug));
    } catch (error) {
      console.error("Error deleting product:", error);
    }
    setOpenDeleteModal(false);
  };

  const fetchData = async () => {
    setLoading(true);
    await Promise.all([getProducts(), getCategories(), getVendors()]);
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, [currentPage, category]);

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
                  {/* Table search form and Add Button */}
                  <div className="flex flex-col md:flex-row border-b-2 items-center justify-between space-y-3 md:space-y-0 md:space-x-4 p-4">
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
                        label="Add product"
                        onClick={openProductAddModal}
                        data-modal-target="product-modal"
                        data-modal-toggle="product-modal"
                      />
                    </div>
                  </div>
                  {/* Table filters */}
                  <div className="flex flex-col md:flex-row border-b-2 items-center justify-end space-y-3 md:space-y-0 md:space-x-4 p-4">
                    <div className="w-full md:w-auto flex flex-col md:flex-row space-y-2 md:space-y-0 items-stretch md:items-center justify-end md:space-x-3 flex-shrink-0">
                      <label
                        htmlFor="product-category-filter"
                        className="sr-only"
                      >
                        Category
                      </label>
                      <select
                        id="product-category-filter"
                        className="block py-2.5 px-0 w-full text-sm text-gray-500 bg-transparent border-0 border-b-2 border-gray-200 appearance-none dark:text-gray-400 dark:border-gray-700 focus:outline-none focus:ring-0 focus:border-gray-200 peer"
                        onChange={(e) => {
                          const categoryValue = e.target.value;
                          setCategory(categoryValue);
                          setSearchParams({ category: categoryValue });
                        }}
                        value={category}
                      >
                        <option value="">Category</option>
                        {categories.map((category) => (
                          <option key={category.id} value={category.slug}>
                            {category.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="w-full md:w-auto flex flex-col md:flex-row space-y-2 md:space-y-0 items-stretch md:items-center justify-end md:space-x-3 flex-shrink-0">
                      <label
                        htmlFor="product-status-filter"
                        className="sr-only"
                      >
                        Status
                      </label>
                      <select
                        id="product-status-filter"
                        className="block py-2.5 px-0 w-full text-sm text-gray-500 bg-transparent border-0 border-b-2 border-gray-200 appearance-none dark:text-gray-400 dark:border-gray-700 focus:outline-none focus:ring-0 focus:border-gray-200 peer"
                      >
                        <option value="">Status</option>
                        {productStatusChoices.map((status) => (
                          <option key={status.value} value={status.value}>
                            {status.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  {/* Table data */}
                  <div className="overflow-x-auto">
                    <Table>
                      <caption className="p-5 text-sm font-normal text-left rtl:text-right text-gray-900 bg-white dark:text-white dark:bg-gray-800">
                        {productsCount}{" "}
                        {productsCount === 1 ? "result" : "results"}
                      </caption>
                      <Table.Head>
                        <Table.HeadCell>Product</Table.HeadCell>
                        <Table.HeadCell>Category</Table.HeadCell>
                        <Table.HeadCell>Rating</Table.HeadCell>
                        <Table.HeadCell>Price</Table.HeadCell>
                        <Table.HeadCell>Discount price</Table.HeadCell>
                        <Table.HeadCell>Stock</Table.HeadCell>
                        <Table.HeadCell>Vendor</Table.HeadCell>
                        <Table.HeadCell>Status</Table.HeadCell>
                        <Table.HeadCell>Created at</Table.HeadCell>
                        <Table.HeadCell>Updated at</Table.HeadCell>
                        <Table.HeadCell>
                          <span className="sr-only">Actions</span>
                        </Table.HeadCell>
                      </Table.Head>
                      <Table.Body className="divide-y">
                        {products.length > 0 ? (
                          products.map((product) => (
                            <Table.Row
                              key={product.id}
                              className="bg-white dark:border-gray-700 dark:bg-gray-800"
                            >
                              <Table.Cell className="flex items-center whitespace-nowrap font-medium text-gray-900 dark:text-white">
                                <img
                                  src={product.image}
                                  alt={`${product.name} Image`}
                                  className="w-auto h-8 mr-3"
                                />
                                {product.name}
                              </Table.Cell>
                              <Table.Cell>
                                <Badge color="blue">
                                  {product.category.name}
                                </Badge>
                              </Table.Cell>
                              <Table.Cell>
                                <StarRating
                                  ratingValue={product.rating}
                                  ratingValueDisplay={true}
                                />
                              </Table.Cell>
                              <Table.Cell>रु{product.price}</Table.Cell>
                              <Table.Cell>रु{product.discountPrice}</Table.Cell>
                              <Table.Cell>{product.stock}</Table.Cell>
                              <Table.Cell>
                                <Badge color="gray">
                                  {product.vendor.name}
                                </Badge>
                              </Table.Cell>
                              <Table.Cell>
                                <Badge status={product.status}>
                                  {product.status}
                                </Badge>
                              </Table.Cell>
                              <Table.Cell>
                                {formatDate(product.createdAt)}
                              </Table.Cell>
                              <Table.Cell>
                                {formatDate(product.updatedAt)}
                              </Table.Cell>
                              <Table.Cell className="px-4 py-3 flex gap-2 items-center justify-end">
                                <DashboardButton
                                  icon={HiPencil}
                                  onClick={() => {
                                    openProductEditModal(product.slug);
                                  }}
                                  data-modal-target="product-modal"
                                  data-modal-toggle="product-modal"
                                />
                                <DashboardButton
                                  icon={HiTrash}
                                  color="red"
                                  onClick={() => {
                                    openProductDeleteModal(product.slug);
                                  }}
                                  data-modal-target="delete-product-modal"
                                  data-modal-toggle="delete-product-modal"
                                />
                              </Table.Cell>
                            </Table.Row>
                          ))
                        ) : products.length === 0 && searchQuery ? (
                          <DashboardTableNoDataRow
                            columns={11}
                            message="No results found"
                            message2="Try different keywords or remove search filters"
                          />
                        ) : (
                          <DashboardTableNoDataRow
                            columns={11}
                            message="No products available."
                          />
                        )}
                      </Table.Body>
                    </Table>
                  </div>
                </>
              )}
              {/* Table pagination */}
              <Pagination
                currentPage={currentPage}
                count={productsCount}
                limit={PRODUCTS_PER_PAGE}
                offset={offset}
                pathName="/admin/products"
              />
            </div>
          </div>
        </section>
      </DashboardMainLayout>

      {/* product modal */}
      <ProductFormModal
        openModal={openModal}
        initialData={initialValues}
        setOpenModal={setOpenModal}
        onSubmit={handleSubmit}
        categories={categories}
        vendors={vendors}
        productStatusChoices={productStatusChoices}
        modalID="product-modal"
        isEditMode={!!product}
      />

      {/* product delete modal */}
      <DeletePopupModal
        openModal={openDeleteModal}
        setOpenModal={setOpenDeleteModal}
        onConfirm={() => handleProductDelete(selectedProduct)}
        confirmationText="Are you sure you want to delete the selected product?"
        modalID="delete-product-modal"
      />
    </>
  );
}

export default ProductList;
