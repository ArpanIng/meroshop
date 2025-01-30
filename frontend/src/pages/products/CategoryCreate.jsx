import React from "react";
import humps from "humps";
import { useNavigate } from "react-router-dom";
import CategoryForm from "./CategoryForm";
import DashboardMainLayout from "../../layouts/DashboardMainLayout";
import DashboardFormLayout from "../../layouts/DashboardFormLayout";
import { createCategory } from "../../services/api/categoryApi";

function CategoryCreate() {
  const navigate = useNavigate();

  const initialValues = {
    name: "",
  };

  const handleSubmit = async (values, actions) => {
    try {
      const response = await createCategory(values);
      if (response.status === 201) {
        navigate("/admin/categories");
      }
    } catch (error) {
      if (error.response && error.response.data) {
        const errorData = error.response.data;
        // map backend errors to formik
        const errors = {};
        Object.keys(errorData).forEach((field) => {
          // convert the error data field into camelcase
          const camelCaseField = humps.camelize(field);
          errors[camelCaseField] = errorData[field].join("");
        });
        actions.setErrors(errors); // Set backend errors in Formik
      } else {
        console.error("An error occured. Please try again.");
      }
    } finally {
      actions.setSubmitting(false);
    }
  };

  return (
    <DashboardMainLayout>
      <DashboardFormLayout formTitle="Add a new category">
        <CategoryForm
          initialValues={initialValues}
          onSubmit={handleSubmit}
          isEditMode={false}
        />
      </DashboardFormLayout>
    </DashboardMainLayout>
  );
}

export default CategoryCreate;
