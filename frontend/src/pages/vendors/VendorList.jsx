import React, { useEffect, useState } from "react";
import { Table } from "flowbite-react";
import humps from "humps";
import { HiPencil, HiPlus, HiTrash } from "react-icons/hi";
import { useSearchParams } from "react-router-dom";
import Badge from "../../components/Badge";
import DashboardTableSearchForm from "../../components/DashboardTableSearchForm";
import DashboardTableNoDataRow from "../../components/DashboardTableNoDataRow";
import Loading from "../../components/Loading";
import Pagination from "../../components/Pagination";
import DashboardMainLayout from "../../components/layouts/DashboardMainLayout";
import DeletePopupModal from "../../components/modals/DeletePopupModal";
import VendorFormModal from "../../components/modals/VendorFormModal";
import DashboardButton from "../../components/ui/DashboardButton";
import { useChoices } from "../../contexts/ChoicesContext";
import { fetchVendorUsers } from "../../services/api/userApi";
import {
  createVendor,
  deleteVendor,
  fetchVendor,
  fetchVendors,
  updateVendor,
} from "../../services/api/vendorApi";
import { formatDate } from "../../utils/formatting";

function VendorList() {
  const [vendors, setVendors] = useState([]);
  const [vendor, setVendor] = useState(null);
  const [vendorUsers, setVendorUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const { vendorStatusChoices } = useChoices();

  // modals
  const [openModal, setOpenModal] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [selectedVendor, setSelectedVendor] = useState(null);

  // URL Search Parameters
  const [searchParams, setSearchParams] = useSearchParams();
  // vendor table search
  const search = searchParams.get("q");
  const [searchQuery, setSearchQuery] = useState(search || "");

  // vendor table pagination
  const VENDORS_PER_PAGE = 50;
  const page = searchParams.get("page");
  const currentPage = page ? parseInt(page, 10) : 1;
  // offset based on the current page (0 for first page)
  const offset = VENDORS_PER_PAGE * (currentPage - 1);
  const [vendorsCount, setVendorsCount] = useState(0);

  // find value of the selected status option based on the label
  const selectedStatusOption = vendorStatusChoices.find(
    (choice) => choice.label === vendor?.status
  );
  const selectedStatusOptionValue = selectedStatusOption
    ? selectedStatusOption.value
    : "";

  const initialValues = {
    name: vendor?.name || "",
    description: vendor?.description || "",
    userId: vendor?.user?.id || "",
    email: vendor?.email || "",
    address: vendor?.address || "",
    phoneNumber: vendor?.phoneNumber || "",
    status: selectedStatusOptionValue,
  };

  const getVendors = async (searchQuery) => {
    try {
      const data = await fetchVendors(searchQuery, VENDORS_PER_PAGE, offset);
      setVendors(data.results);
      setVendorsCount(data.count);
    } catch (error) {
      console.error("Error fetching vendors:", error);
    }
  };

  const getVendorUsers = async () => {
    try {
      const data = await fetchVendorUsers();
      setVendorUsers(data);
    } catch (error) {
      console.error("Error fetching vendor users:", error);
    }
  };

  const openVendorAddModal = () => {
    setVendor(null);
    setOpenModal(true);
  };

  const openVendorEditModal = async (vendorId) => {
    setLoading(true);
    try {
      const data = await fetchVendor(vendorId);
      setVendor(data);
      setOpenModal(true);
    } catch (error) {
      console.error("Error fetching vendor:", error);
    } finally {
      setLoading(false);
    }
  };

  const openVendorDeleteModal = (vendorId) => {
    setSelectedVendor(vendorId);
    setOpenDeleteModal(true);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setSearchParams(searchQuery ? { q: searchQuery } : {});
    if (searchQuery.trim()) {
      // fetch vendors filtered by the search query
      getVendors(searchQuery);
    }
  };

  const handleSubmit = async (data, actions) => {
    // convert values to snake_case
    const formData = humps.decamelizeKeys(data);
    try {
      let response;
      if (vendor) {
        response = await updateVendor(vendor.id, formData);
      } else {
        response = await createVendor(formData);
      }
      if (response.status === 200 || response.status === 201) {
        setOpenModal(false);
        actions.resetForm();
        getVendors();
      }
    } catch (error) {
      console.error("Error submiting vendor data:", error);
      if (error.response && error.response.data) {
        const errorData = error.response.data;
        // map backend errors to formik
        const errors = {};
        Object.keys(errorData).forEach((field) => {
          // handle non-field errors
          if (field === "non_field_errors") {
            errors.nonFieldErrors = errorData[field].join("");
          } else {
            // handle field errors
            // convert the error field to match formik initialValues
            const camelCaseField = humps.camelize(field);
            errors[camelCaseField] = errorData[field].join("");
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

  const handleVendorDelete = async (vendorId) => {
    try {
      await deleteVendor(vendorId);
      setVendors((v) => v.filter((vendor) => vendor.id !== vendorId));
    } catch (error) {
      console.error("Error deleting vendor:", error);
    }
    setOpenDeleteModal(false);
  };

  const fetchData = async () => {
    setLoading(true);
    await Promise.all([getVendors(searchQuery), getVendorUsers()]);
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, [currentPage]);

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
                        label="Add vendor"
                        onClick={openVendorAddModal}
                        data-modal-target="vendor-modal"
                        data-modal-toggle="vendor-modal"
                      />
                    </div>
                  </div>
                  <div className="overflow-x-auto">
                    <Table>
                      <caption class="p-5 text-sm font-normal text-left rtl:text-right text-gray-900 bg-white dark:text-white dark:bg-gray-800">
                        {vendorsCount}{" "}
                        {vendorsCount === 1 ? "result" : "results"}
                      </caption>
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
                                <DashboardButton
                                  icon={HiPencil}
                                  onClick={() => {
                                    openVendorEditModal(vendor.id);
                                  }}
                                  data-modal-target="vendor-modal"
                                  data-modal-toggle="vendor-modal"
                                />
                                <DashboardButton
                                  icon={HiTrash}
                                  color="red"
                                  onClick={() => {
                                    openVendorDeleteModal(vendor.id);
                                  }}
                                  data-modal-target="delete-vendor-modal"
                                  data-modal-toggle="delete-vendor-modal"
                                />
                              </Table.Cell>
                            </Table.Row>
                          ))
                        ) : vendors.length === 0 && searchQuery ? (
                          <DashboardTableNoDataRow
                            columns={9}
                            message="No results found"
                            message2="Try different keywords or remove search filters"
                          />
                        ) : (
                          <DashboardTableNoDataRow
                            columns={9}
                            message="No vendors available."
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
                count={vendorsCount}
                limit={VENDORS_PER_PAGE}
                offset={offset}
                pathName="/admin/vendors"
              />
            </div>
          </div>
        </section>
      </DashboardMainLayout>

      {/* vendor modal */}
      <VendorFormModal
        openModal={openModal}
        initialData={initialValues}
        setOpenModal={setOpenModal}
        onSubmit={handleSubmit}
        vendorUsers={vendorUsers}
        statusChoices={vendorStatusChoices}
        modalID="vendor-modal"
        isEditMode={!!vendor}
      />

      {/* vendor delete modal */}
      <DeletePopupModal
        openModal={openDeleteModal}
        setOpenModal={setOpenDeleteModal}
        onConfirm={() => handleVendorDelete(selectedVendor)}
        confirmationText="Are you sure you want to delete the selected vendor?"
        modalID="delete-vendor-modal"
      />
    </>
  );
}

export default VendorList;
