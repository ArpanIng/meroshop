import React from "react";
import { useFormik } from "formik";
import { Checkbox, Label, Modal, Select, Textarea } from "flowbite-react";
import PropTypes from "prop-types";
import { adminReviewValidationSchema } from "../../schemas/reviewValidationSchema";

function ReviewFormModal({
  openModal,
  setOpenModal,
  initialData,
  onSubmit,
  modalID,
  products,
  users,
  isEditMode = false,
}) {
  const checkboxCustomTheme = {
    root: {
      base: "w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded-sm focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600",
      color: {
        default:
          "text-blue-700 focus:ring-blue-600 dark:ring-offset-blue-700 dark:focus:ring-blue-700",
      },
    },
  };

  const {
    values,
    errors,
    touched,
    handleBlur,
    handleChange,
    handleSubmit,
    resetForm,
  } = useFormik({
    initialValues: initialData,
    validationSchema: adminReviewValidationSchema,
    enableReinitialize: true,
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
        {isEditMode ? "Edit review" : "Add a new review"}
      </Modal.Header>
      <Modal.Body>
        <form className="space-y-4" onSubmit={handleSubmit}>
          {errors.nonFieldErrors && (
            <p className="text-sm text-red-600 dark:text-red-500">
              {errors.nonFieldErrors}
            </p>
          )}
          {/* product field */}
          <div>
            <Label htmlFor="product" value="Product" className="mb-2 block" />
            <Select
              id="product"
              name="productId"
              value={values.productId}
              onBlur={handleBlur}
              onChange={handleChange}
              color={touched.productId && errors.productId ? "failure" : "gray"}
              helperText={
                <>
                  {touched.productId && errors.productId ? (
                    <span>{errors.productId}</span>
                  ) : null}
                </>
              }
            >
              <option value="" disabled>
                ------
              </option>
              {products.map((product) => (
                <option key={product.id} value={product.id}>
                  {product.name}
                </option>
              ))}
            </Select>
          </div>
          {/* user field */}
          <div>
            <Label htmlFor="user" value="User" className="mb-2 block" />
            <Select
              id="user"
              name="userId"
              value={values.userId}
              onBlur={handleBlur}
              onChange={handleChange}
              color={touched.userId && errors.userId ? "failure" : "gray"}
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
              {users.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.email}
                </option>
              ))}
            </Select>
          </div>
          {/* rating field */}
          <div>
            <Label htmlFor="rating" className="mb-2 block" value="Rating" />
            <Select
              id="rating"
              value={values.rating}
              onBlur={handleBlur}
              onChange={handleChange}
              color={touched.rating && errors.rating ? "failure" : "gray"}
              helperText={
                <>
                  {touched.rating && errors.rating ? (
                    <span>{errors.rating}</span>
                  ) : null}
                </>
              }
              required
            >
              <option value="" disabled>
                All stars
              </option>
              <option value="5">5 stars</option>
              <option value="4">4 stars</option>
              <option value="3">3 stars</option>
              <option value="2">2 stars</option>
              <option value="1">1 star</option>
            </Select>
          </div>
          {/* comment field */}
          <div>
            <Label
              htmlFor="comment"
              value="Review comment"
              className="mb-2 block"
            />
            <Textarea
              id="comment"
              name="comment"
              className="mb-2"
              rows={6}
              value={values.comment}
              onBlur={handleBlur}
              onChange={handleChange}
              color={touched.comment && errors.comment ? "failure" : "gray"}
              helperText={
                <>
                  {touched.comment && errors.comment ? (
                    <span>{errors.comment}</span>
                  ) : null}
                </>
              }
            />
          </div>
          {/* is active field */}
          <div>
            <Label
              htmlFor="active"
              value="Active status"
              className="mb-2 block"
            />
            <div className="flex items-center gap-2 mb-4">
              <Checkbox
                theme={checkboxCustomTheme}
                id="active-status-checkbox"
                type="checkbox"
                name="isActive"
                checked={values.isActive}
                onChange={handleChange}
              />
              <Label
                htmlFor="active-status-checkbox"
                className="flex"
                value="Is active"
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
            >
              {isEditMode ? "Edit review" : "Add review"}
            </button>
          </div>
        </form>
      </Modal.Body>
    </Modal>
  );
}

ReviewFormModal.propTypes = {
  openModal: PropTypes.bool.isRequired,
  initialData: PropTypes.object.isRequired,
  setOpenModal: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  modalID: PropTypes.string.isRequired,
  products: PropTypes.array.isRequired,
  users: PropTypes.array.isRequired,
};

export default ReviewFormModal;
