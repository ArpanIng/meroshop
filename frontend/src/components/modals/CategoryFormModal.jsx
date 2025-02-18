import React from "react";
import { Label, Modal, TextInput } from "flowbite-react";
import { useFormik } from "formik";
import PropTypes from "prop-types";
import { categoryValidationSchema } from "../../schemas/categoryValidationSchema";

function CategoryFormModal({
  openModal,
  setOpenModal,
  initialData,
  onSubmit,
  modalID,
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
    validationSchema: categoryValidationSchema,
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
        {isEditMode ? "Edit category" : "Add a new category"}
      </Modal.Header>
      <Modal.Body>
        <form class="space-y-4" onSubmit={handleSubmit}>
          {/* name field */}
          <div>
            <Label
              htmlFor="name"
              value="Category name"
              className="block mb-2"
            />
            <TextInput
              type="text"
              id="name"
              name="name"
              value={values.name}
              onBlur={handleBlur}
              onChange={handleChange}
              color={touched.name && errors.name ? "failure" : "gray"}
              helperText={
                <>
                  {touched.name && errors.name ? (
                    <span>{errors.name}</span>
                  ) : null}
                </>
              }
            />
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
              {isEditMode ? "Edit category" : "Add category"}
            </button>
          </div>
        </form>
      </Modal.Body>
    </Modal>
  );
}

CategoryFormModal.propTypes = {
  openModal: PropTypes.bool.isRequired,
  initialData: PropTypes.object.isRequired,
  setOpenModal: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  modalID: PropTypes.string.isRequired,
};

export default CategoryFormModal;
