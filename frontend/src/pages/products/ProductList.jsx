import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button, Spinner } from "flowbite-react";
import { HiPencil, HiPlus, HiSearch, HiTrash } from "react-icons/hi";
import { Table } from "flowbite-react";
import api from "../../api/endpoint";
import Badge from "../../components/Badge";
import DashboardTableSearchForm from "../../components/DashboardTableSearchForm";
import DashboardTableNoDataRow from "../../components/DashboardTableNoDataRow";
import Loading from "../../components/Loading";
import DashboardMainLayout from "../../layouts/DashboardMainLayout";
import { formatDate } from "../../utils/formatting";

function ProductList() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await api.get("/api/products/");
      setProducts(response.data);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
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
              {/* display loading indicator */}
              {loading ? (
                <Loading />
              ) : (
                <Table>
                  <Table.Head>
                    <Table.HeadCell>Product name</Table.HeadCell>
                    <Table.HeadCell>Slug</Table.HeadCell>
                    <Table.HeadCell>Category</Table.HeadCell>
                    <Table.HeadCell>Price</Table.HeadCell>
                    <Table.HeadCell>Discount price</Table.HeadCell>
                    <Table.HeadCell>Stock</Table.HeadCell>
                    <Table.HeadCell>Image</Table.HeadCell>
                    <Table.HeadCell>Status</Table.HeadCell>
                    <Table.HeadCell>Vendor</Table.HeadCell>
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
                          <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                            {product.name}
                          </Table.Cell>
                          <Table.Cell>{product.slug}</Table.Cell>
                          <Table.Cell>{product.category}</Table.Cell>
                          <Table.Cell>रु{product.price}</Table.Cell>
                          <Table.Cell>रु{product.discount_price}</Table.Cell>
                          <Table.Cell>{product.stock}</Table.Cell>
                          <Table.Cell>
                            <img
                              className="w-10 h-10 rounded-full"
                              src={product.image}
                              alt={`${product.name} image`}
                            />
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
                          <Table.Cell>{product.vendor}</Table.Cell>
                          <Table.Cell>
                            {formatDate(product.created_at)}
                          </Table.Cell>
                          <Table.Cell>
                            {formatDate(product.updated_at)}
                          </Table.Cell>
                          <Table.Cell className="px-4 py-3 flex gap-2 items-center justify-end">
                            <Link
                              to={`/admin/products/${product.id}/edit`}
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
                            >
                              <HiTrash className="h-4 w-4 mr-2" />
                              Delete
                            </Link>
                          </Table.Cell>
                        </Table.Row>
                      ))
                    ) : (
                      <DashboardTableNoDataRow columns={12} />
                    )}
                  </Table.Body>
                </Table>
              )}
            </div>
          </div>
        </div>
      </section>
    </DashboardMainLayout>
  );
}

export default ProductList;
