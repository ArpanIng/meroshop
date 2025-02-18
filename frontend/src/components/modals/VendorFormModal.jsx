import React from "react";
import { Label, Modal, Select, TextInput, Textarea } from "flowbite-react";
import { useFormik } from "formik";
import PropTypes from "prop-types";
import { vendorValidationSchema } from "../../schemas/vendorValidationSchema";

function VendorFormModal({
  openModal,
  setOpenModal,
  initialData,
  onSubmit,
  modalID,
  vendorUsers,
  statusChoices,
  isEditMode = false,
}) {
  const {
    values,
    errors,
    touched,
    handleBlur,
    handleChange,
    handleSubmit,
    resetForm,
    isSubmitting,
  } = useFormik({
    initialValues: initialData,
    validationSchema: vendorValidationSchema,
    enableReinitialize: true, // Reinitializes form values when initialValues change
    onSubmit: (values, actions) => {
      onSubmit(values, actions);
    },
  });

  const hideModal = () => {
    setOpenModal(false);
    resetForm();
  };

  return (
    <Modal id={modalID} show={openModal} onClose={hideModal}>
      <Modal.Header>
        {isEditMode ? "Edit vendor" : "Add a new vendor"}
      </Modal.Header>
      <Modal.Body>
        <form class="space-y-4" onSubmit={handleSubmit}>
          <div className="grid gap-4 sm:grid-cols-2 sm:gap-6">
            {/* Name field */}
            <div className="sm:col-span-2">
              <Label
                htmlFor="name"
                value="Vendor name"
                className="block mb-2"
              />
              <TextInput
                type="text"
                id="name"
                name="name"
                value={values.name}
                onChange={handleChange}
                color={touched.name && errors.name ? "failure" : "gray"}
                onBlur={handleBlur}
                helperText={
                  <>
                    {touched.name && errors.name ? (
                      <span>{errors.name}</span>
                    ) : null}
                  </>
                }
              />
            </div>
            {/* User field */}
            <div className="sm:col-span-2">
              <Label htmlFor="user" value="User" className="block mb-2" />
              <Select
                id="user"
                name="userId"
                value={values.userId}
                onChange={handleChange}
                color={touched.userId && errors.userId ? "failure" : "gray"}
                onBlur={handleBlur}
                helperText={
                  <>
                    {touched.userId && errors.userId ? (
                      <span>{errors.userId}</span>
                    ) : null}
                  </>
                }
              >
                <option value="" disabled>
                  ------
                </option>
                {vendorUsers.map((user) => (
                  <option key={user.id} value={user.id}>
                    {user.email}
                  </option>
                ))}
              </Select>
            </div>
            {/* Email field */}
            <div>
              <Label htmlFor="email" value="Email" className="block mb-2" />
              <TextInput
                type="email"
                id="email"
                name="email"
                value={values.email}
                onChange={handleChange}
                color={touched.email && errors.email ? "failure" : "gray"}
                onBlur={handleBlur}
                helperText={
                  <>
                    {touched.email && errors.email ? (
                      <span>{errors.email}</span>
                    ) : null}
                  </>
                }
              />
            </div>
            {/* Address field */}
            <div>
              <Label htmlFor="address" value="Address" className="block mb-2" />
              <TextInput
                type="text"
                id="address"
                name="address"
                value={values.address}
                onChange={handleChange}
                color={touched.address && errors.address ? "failure" : "gray"}
                onBlur={handleBlur}
                helperText={
                  <>
                    {touched.address && errors.address ? (
                      <span>{errors.address}</span>
                    ) : null}
                  </>
                }
              />
            </div>
            {/* Phone number field */}
            <div>
              <Label
                htmlFor="phone-number"
                value="Phone number"
                className="block mb-2"
              />
              <TextInput
                type="text"
                id="phone-number"
                name="phoneNumber"
                value={values.phoneNumber}
                onChange={handleChange}
                color={
                  touched.phoneNumber && errors.phoneNumber ? "failure" : "gray"
                }
                onBlur={handleBlur}
                helperText={
                  <>
                    {touched.phoneNumber && errors.phoneNumber ? (
                      <span>{errors.phoneNumber}</span>
                    ) : null}
                  </>
                }
              />
            </div>
            {/* Status field */}
            <div>
              <Label
                htmlFor="status"
                value="Select status"
                className="block mb-2"
              />
              <Select
                id="status"
                name="status"
                value={values.status}
                onChange={handleChange}
                color={touched.status && errors.status ? "failure" : "gray"}
                onBlur={handleBlur}
                helperText={
                  <>
                    {touched.status && errors.status ? (
                      <span>{errors.status}</span>
                    ) : null}
                  </>
                }
              >
                <option value="" disabled>
                  Select status
                </option>
                {statusChoices.map((choice) => (
                  <option key={choice.value} value={choice.value}>
                    {choice.label}
                  </option>
                ))}
              </Select>
            </div>
            {/* Description field */}
            <div className="sm:col-span-2">
              <Label
                htmlFor="description"
                value="Description"
                className="block mb-2"
              />
              <Textarea
                id="description"
                name="description"
                rows={8}
                value={values.description}
                onChange={handleChange}
                color={
                  touched.description && errors.description ? "failure" : "gray"
                }
                onBlur={handleBlur}
                helperText={
                  <>
                    {touched.description && errors.description ? (
                      <span>{errors.description}</span>
                    ) : null}
                  </>
                }
              />
            </div>
          </div>
          {/* button fields */}
          <div className="border-t border-gray-200 pt-4 dark:border-gray-700 md:pt-5">
            <button
              type="button"
              className="me-2 rounded-lg border border-gray-200 bg-white px-5 py-2.5 text-sm font-medium text-gray-900 hover:bg-gray-100 hover:text-primary-700 focus:z-10 focus:outline-none focus:ring-4 focus:ring-gray-100 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white dark:focus:ring-gray-700"
              data-modal-hide={modalID}
              onClick={hideModal}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="me-2 inline-flex items-center rounded-lg bg-blue-700 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-primary-300 dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
              data-modal-hide={modalID}
              disabled={isSubmitting}
            >
              {isEditMode ? "Edit vendor" : "Add vendor"}
            </button>
          </div>
        </form>
      </Modal.Body>
    </Modal>
  );
}

VendorFormModal.propTypes = {
  openModal: PropTypes.bool.isRequired,
  initialData: PropTypes.object.isRequired,
  setOpenModal: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  vendorUsers: PropTypes.array.isRequired,
  statusChoices: PropTypes.array.isRequired,
  modalID: PropTypes.string.isRequired,
};

export default VendorFormModal;
