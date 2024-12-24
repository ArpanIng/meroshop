import React from "react";
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

  const handleSubmit = async (values, { resetForm }) => {
    try {
      const response = await createCategory(values);
      resetForm();
      if (response.status === 201) {
        navigate("/admin/categories");
      }
    } catch (error) {
      throw error;
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
