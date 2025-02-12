import React, { useEffect, useState } from "react";
import { Table } from "flowbite-react";
import { Link, useSearchParams } from "react-router-dom";
import { HiPencil, HiPlus, HiTrash } from "react-icons/hi";
import Badge from "../../components/Badge";
import DashboardTableSearchForm from "../../components/DashboardTableSearchForm";
import DashboardTableNoDataRow from "../../components/DashboardTableNoDataRow";
import DeleteConfirmModal from "../../components/DeleteConfirmModal";
import Loading from "../../components/Loading";
import DashboardMainLayout from "../../layouts/DashboardMainLayout";
import { deleteProduct, fetchProducts } from "../../services/api/productApi";
import { formatDate } from "../../utils/formatting";

function ProductList() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  // URL Search Parameters
  const [searchParams, setSearchParams] = useSearchParams();
  // product table search
  const [searchQuery, setSearchQuery] = useState(searchParams.get("q") || "");

  const openProductDeleteModal = (productSlug) => {
    setSelectedProduct(productSlug);
    setOpenModal(true);
  };

  const getProducts = async (searchQuery) => {
    try {
      const data = await fetchProducts(searchQuery);
      setProducts(data);
    } catch (error) {
      console.error("Error loading products data:", error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setSearchParams(searchQuery ? { q: searchQuery } : {});
    if (searchQuery.trim()) {
      // fetch products based on user submitted query
      getProducts(searchQuery);
    }
  };

  const handleDelete = async (productSlug) => {
    try {
      await deleteProduct(productSlug);
      setProducts((p) => p.filter((product) => product.slug !== productSlug));
    } catch (error) {
      console.error("Error deleting product:", error);
    }
    setOpenModal(false);
  };

  useEffect(() => {
    // fetch initial products with an empty query
    getProducts(searchQuery);
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
                      to="/admin/products/add"
                      type="button"
                      className="flex items-center justify-center text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
                    >
                      <HiPlus className="h-4 w-4 mr-2" />
                      Add product
                    </Link>
                  </div>
                </div>
                <div className="overflow-x-auto">
                  <Table>
                    <Table.Head>
                      <Table.HeadCell>Product</Table.HeadCell>
                      <Table.HeadCell>Slug</Table.HeadCell>
                      <Table.HeadCell>Category</Table.HeadCell>
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
                            <Table.Cell>{product.slug}</Table.Cell>
                            <Table.Cell>
                              <Badge color="blue">
                                {product.category.name}
                              </Badge>
                            </Table.Cell>
                            <Table.Cell>रु{product.price}</Table.Cell>
                            <Table.Cell>रु{product.discountPrice}</Table.Cell>
                            <Table.Cell>{product.stock}</Table.Cell>
                            <Table.Cell>
                              <Badge color="gray">{product.vendor.name}</Badge>
                            </Table.Cell>
                            <Table.Cell>
                              <Badge
                                color={
                                  product.status === "Active" ? "green" : "red"
                                }
                              >
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
                              <Link
                                to={`/admin/products/${product.slug}/edit`}
                                type="button"
                                className="flex items-center justify-center text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
                              >
                                <HiPencil className="h-4 w-4 mr-2" />
                                Edit
                              </Link>
                              <Link
                                to={`/admin/products`}
                                type="button"
                                className="flex items-center justify-center focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900"
                                onClick={() => {
                                  openProductDeleteModal(product.slug);
                                }}
                              >
                                <HiTrash className="h-4 w-4 mr-2" />
                                Delete
                              </Link>
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

                  {/* Product delete modal */}
                  <DeleteConfirmModal
                    isOpen={openModal}
                    onClose={() => setOpenModal(false)}
                    onConfirm={() => handleDelete(selectedProduct)}
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

export default ProductList;
