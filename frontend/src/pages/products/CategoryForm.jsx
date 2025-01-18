import React from "react";
import { Button, Label, TextInput } from "flowbite-react";
import { useFormik } from "formik";
import PropTypes from "prop-types";
import { categoryValidationSchema } from "../../schemas/categoryValidationSchema";

function CategoryForm({ initialValues, onSubmit, isEditMode = false }) {
  const {
    values,
    errors,
    touched,
    handleBlur,
    handleChange,
    handleSubmit,
    isSubmitting,
  } = useFormik({
    initialValues,
    validationSchema: categoryValidationSchema,
    enableReinitialize: true, // Reinitializes form values when initialValues change
    onSubmit: async (values, actions) => {
      try {
        await onSubmit(values, actions);
      } catch (error) {
        if (error.response && error.response.data) {
          const errorData = error.response.data;
          // map backend errors to formik
          const errors = {};
          Object.keys(errorData).forEach((field) => {
            errors[field] = errorData[field].join("");
          });
          actions.setErrors(errors); // Set backend errors in Formik
        } else {
          console.error("An error occured. Please try again.");
        }
        console.error("Error submitting form:", error);
      } finally {
        actions.setSubmitting(false);
      }
    },
  });

  return (
    <form onSubmit={handleSubmit}>
      <div className="grid gap-4 sm:grid-cols-2 sm:gap-6">
        <div className="sm:col-span-2">
          <Label htmlFor="name" value="Category name" className="block mb-2" />
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
      </div>
      <Button
        type="submit"
        color="blue"
        className="mt-4"
        disabled={isSubmitting}
      >
        {isEditMode ? "Edit category" : "Add category"}
      </Button>
    </form>
  );
}

CategoryForm.proTypes = {
  initialValues: PropTypes.object.isRequired,
  onSubmit: PropTypes.func.isRequired,
  isEditMode: PropTypes.bool,
};

export default CategoryForm;
