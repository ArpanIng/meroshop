import React from "react";
import {
  FileInput,
  Modal,
  Label,
  Select,
  Textarea,
  TextInput,
} from "flowbite-react";
import { useFormik } from "formik";
import PropTypes from "prop-types";
import { productValidationSchema } from "../../schemas/productValidationSchema";

function ProductFormModal({
  openModal,
  setOpenModal,
  initialData,
  onSubmit,
  modalID,
  categories,
  vendors,
  productStatusChoices,
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
    validationSchema: productValidationSchema,
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
        {isEditMode ? "Edit product" : "Add a new product"}
      </Modal.Header>
      <Modal.Body>
        <form class="space-y-4" onSubmit={handleSubmit}>
          <div className="grid gap-4 sm:grid-cols-2 sm:gap-6">
            {/* Name field */}
            <div className="sm:col-span-2">
              <Label
                htmlFor="name"
                value="Product name"
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
            {/* Price field */}
            <div className="w-full">
              <Label htmlFor="price" value="Price" className="block mb-2" />
              <TextInput
                type="number"
                id="price"
                name="price"
                value={values.price}
                onChange={handleChange}
                color={touched.price && errors.price ? "failure" : "gray"}
                onBlur={handleBlur}
                helperText={
                  <>
                    {touched.price && errors.price ? (
                      <span>{errors.price}</span>
                    ) : (
                      "Original price of the product."
                    )}
                  </>
                }
              />
            </div>
            {/* Discount price field */}
            <div className="w-full">
              <Label
                htmlFor="discount-price"
                value="Discount price"
                className="block mb-2"
              />
              <TextInput
                type="number"
                id="discount-price"
                name="discountPrice"
                value={values.discountPrice}
                onChange={handleChange}
                color={
                  touched.discountPrice && errors.discountPrice
                    ? "failure"
                    : "gray"
                }
                onBlur={handleBlur}
                helperText={
                  <>
                    {touched.discountPrice && errors.discountPrice ? (
                      <span>{errors.discountPrice}</span>
                    ) : (
                      "Discounted price of the product."
                    )}
                  </>
                }
              />
            </div>
            {/* Stock field */}
            <div className="w-full">
              <Label htmlFor="stock" value="Stock" className="block mb-2" />
              <TextInput
                type="number"
                id="stock"
                name="stock"
                value={values.stock}
                onChange={handleChange}
                color={touched.stock && errors.stock ? "failure" : "gray"}
                onBlur={handleBlur}
                helperText={
                  <>
                    {touched.stock && errors.stock ? (
                      <span>{errors.stock}</span>
                    ) : null}
                  </>
                }
              />
            </div>
            {/* Status field */}
            <div className="w-full">
              <Label htmlFor="status" value="Status" className="block mb-2" />
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
                {productStatusChoices.map((choice) => (
                  <option key={choice.value} value={choice.value}>
                    {choice.label}
                  </option>
                ))}
              </Select>
            </div>
            {/* Image preview */}
            {/* {values.image && (
              <div className="sm:col-span-2">
                <Label
                  htmlFor="previewImage"
                  value="Preview image"
                  className="block mb-2"
                />
                <img
                  class="h-auto max-w-xs mx-auto"
                  src={URL.createObjectURL(values.image)}
                  alt={`${values.name} image`}
                />
              </div>
            )} */}
            {/* Image field */}
            <div className="sm:col-span-2">
              <Label
                htmlFor="productImageFile"
                value="Upload image"
                className="block mb-2"
              />
              <FileInput
                id="productImageFile"
                accept="image/*"
                name="image"
                onChange={(e) => {
                  setFieldValue("image", e.currentTarget.files[0]);
                }}
                color={touched.image && errors.image ? "failure" : "gray"}
                onBlur={handleBlur}
                helperText={
                  <>
                    {touched.image && errors.image ? (
                      <span>{errors.image}</span>
                    ) : null}
                  </>
                }
              />
            </div>
            {/* Category field */}
            <div className="w-full">
              <Label
                htmlFor="category"
                value="Category"
                className="block mb-2"
              />
              <Select
                id="category"
                name="categoryId"
                value={values.categoryId}
                onChange={handleChange}
                color={
                  touched.categoryId && errors.categoryId ? "failure" : "gray"
                }
                onBlur={handleBlur}
                helperText={
                  <>
                    {touched.categoryId && errors.categoryId ? (
                      <span>{errors.categoryId}</span>
                    ) : null}
                  </>
                }
              >
                <option value="" disabled>
                  Select category
                </option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </Select>
            </div>
            {/* Vendor field */}
            <div className="w-full">
              <Label htmlFor="vendor" value="Vendor" className="block mb-2" />
              <Select
                id="vendor"
                name="vendorId"
                value={values.vendorId}
                onChange={handleChange}
                color={touched.vendorId && errors.vendorId ? "failure" : "gray"}
                onBlur={handleBlur}
                helperText={
                  <>
                    {touched.vendorId && errors.vendorId ? (
                      <span>{errors.vendorId}</span>
                    ) : null}
                  </>
                }
              >
                <option value="" disabled>
                  Select vendor
                </option>
                {vendors.map((vendor) => (
                  <option key={vendor.id} value={vendor.id}>
                    {vendor.name}
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
              {isEditMode ? "Edit product" : "Add product"}
            </button>
          </div>
        </form>
      </Modal.Body>
    </Modal>
  );
}

ProductFormModal.propTypes = {
  openModal: PropTypes.bool.isRequired,
  initialData: PropTypes.object.isRequired,
  setOpenModal: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  categories: PropTypes.array.isRequired,
  vendors: PropTypes.array.isRequired,
  productStatusChoices: PropTypes.array.isRequired,
  modalID: PropTypes.string.isRequired,
};

export default ProductFormModal;
