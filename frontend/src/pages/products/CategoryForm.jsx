import React, { useState } from "react";
import { Button, Label, TextInput } from "flowbite-react";
import { useFormik } from "formik";
import PropTypes from "prop-types";
import * as Yup from "yup";

function CategoryForm({ initialValues, onSubmit, isEditMode = false }) {
  const [errorMessage, setErrorMessage] = useState("");

  const validationSchema = Yup.object({
    name: Yup.string()
      .min(3, "Too Short!")
      .max(30, "Too Long!")
      .required("Category name is required"),
  });

  const formik = useFormik({
    initialValues,
    validationSchema,
    enableReinitialize: true, // Reinitializes form values when initialValues change
    onSubmit: async (values, actions) => {
      try {
        setErrorMessage("");
        await onSubmit(values, actions);
      } catch (error) {
        if (error.response && error.response.data && error.response.data.name) {
          setErrorMessage(error.response.data.name[0]);
        } else {
          setErrorMessage("An error occured. Please try again.");
        }
        console.error("Error submitting form:", error);
      }
    },
  });

  return (
    <form onSubmit={formik.handleSubmit}>
      <div className="grid gap-4 sm:grid-cols-2 sm:gap-6">
        {errorMessage && <div className="text-red-600">{errorMessage}</div>}
        <div className="sm:col-span-2">
          <Label htmlFor="name" value="Category name" className="block mb-2" />
          <TextInput
            type="text"
            id="name"
            name="name"
            value={formik.values.name}
            onChange={formik.handleChange}
            color={formik.errors.name ? "failure" : "gray"}
            helperText={
              <>{formik.errors.name ? <span>{formik.errors.name}</span> : ""}</>
            }
          />
        </div>
      </div>
      <Button
        type="submit"
        color="blue"
        className="mt-4"
        disabled={formik.isSubmitting}
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
