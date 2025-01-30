import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { HiPencil, HiPlus, HiSearch, HiTrash } from "react-icons/hi";
import { Table } from "flowbite-react";
import Badge from "../../components/Badge";
import DashboardTableSearchForm from "../../components/DashboardTableSearchForm";
import DashboardTableNoDataRow from "../../components/DashboardTableNoDataRow";
import DeleteConfirmModal from "../../components/DeleteConfirmModal";
import Loading from "../../components/Loading";
import DashboardMainLayout from "../../layouts/DashboardMainLayout";
import { deleteVendor, fetchVendors } from "../../services/api/vendorApi";
import { formatDate } from "../../utils/formatting";

function VendorList() {
  const [vendors, setVendors] = useState([]);
  const [selectedVendor, setSelectedVendor] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [loading, setLoading] = useState(true);

  const openVendorDeleteModal = (vendorId) => {
    setSelectedVendor(vendorId);
    setOpenModal(true);
  };

  const getVendors = async () => {
    try {
      const data = await fetchVendors();
      setVendors(data);
    } catch (error) {
      console.error("Error loading vendor data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (vendorId) => {
    try {
      await deleteVendor(vendorId);
      setVendors((v) => v.filter((vendor) => vendor.id !== vendorId));
    } catch (error) {
      console.error("Error deleting vendor:", error);
    }
    setOpenModal(false);
  };

  useEffect(() => {
    getVendors();
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
                      className="flex items-center justify-center text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
                    >
                      <HiPlus className="h-4 w-4 mr-2" />
                      Add vendor
                    </Link>
                  </div>
                </div>
                <div className="overflow-x-auto">
                  <Table>
                    <Table.Head>
                      <Table.HeadCell>Vendor name</Table.HeadCell>
                      <Table.HeadCell>User</Table.HeadCell>
                      <Table.HeadCell>Email</Table.HeadCell>
                      <Table.HeadCell>Address</Table.HeadCell>
                      <Table.HeadCell>Phone number</Table.HeadCell>
                      <Table.HeadCell>Status</Table.HeadCell>
                      <Table.HeadCell>Created at</Table.HeadCell>
                      <Table.HeadCell>Updated at</Table.HeadCell>
                      <Table.HeadCell>
                        <span className="sr-only">Actions</span>
                      </Table.HeadCell>
                    </Table.Head>
                    <Table.Body className="divide-y">
                      {vendors.length > 0 ? (
                        vendors.map((vendor) => (
                          <Table.Row
                            key={vendor.id}
                            className="bg-white dark:border-gray-700 dark:bg-gray-800"
                          >
                            <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                              {vendor.name}
                            </Table.Cell>
                            <Table.Cell>{vendor.user.email}</Table.Cell>
                            <Table.Cell>{vendor.email}</Table.Cell>
                            <Table.Cell>{vendor.address}</Table.Cell>
                            <Table.Cell>{vendor.phoneNumber}</Table.Cell>
                            <Table.Cell>
                              <Badge
                                color={
                                  vendor.status === "Active" ? "green" : "red"
                                }
                              >
                                {vendor.status}
                              </Badge>
                            </Table.Cell>
                            <Table.Cell>
                              {formatDate(vendor.createdAt)}
                            </Table.Cell>
                            <Table.Cell>
                              {formatDate(vendor.updatedAt)}
                            </Table.Cell>
                            <Table.Cell className="px-4 py-3 flex gap-2 items-center justify-end">
                              <Link
                                to={`/admin/vendors/${vendor.id}/edit`}
                                type="button"
                                className="flex items-center justify-center text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
                              >
                                <HiPencil className="h-4 w-4 mr-2" />
                                Edit
                              </Link>
                              <button
                                type="button"
                                className="flex items-center justify-center focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900"
                                onClick={() => openVendorDeleteModal(vendor.id)}
                              >
                                <HiTrash className="h-4 w-4 mr-2" />
                                Delete
                              </button>
                            </Table.Cell>
                          </Table.Row>
                        ))
                      ) : (
                        <DashboardTableNoDataRow columns={9} />
                      )}
                    </Table.Body>
                  </Table>

                  <DeleteConfirmModal
                    isOpen={openModal}
                    onClose={() => setOpenModal(false)}
                    onConfirm={() => handleDelete(selectedVendor)}
                    modalHeader="Are you sure you want to delete this vendor?"
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

export default VendorList;
