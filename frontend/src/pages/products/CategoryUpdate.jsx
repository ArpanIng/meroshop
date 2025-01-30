import React, { useEffect, useState } from "react";
import humps from "humps";
import { useNavigate, useParams } from "react-router-dom";
import CategoryForm from "./CategoryForm";
import Loading from "../../components/Loading";
import DashboardMainLayout from "../../layouts/DashboardMainLayout";
import DashboardFormLayout from "../../layouts/DashboardFormLayout";
import { fetchCategory, updateCategory } from "../../services/api/categoryApi";

function CategoryUpdate() {
  const [category, setCategory] = useState({});
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  let { categorySlug } = useParams();

  const initialValues = {
    name: category.name || "",
  };

  const getCategory = async () => {
    try {
      const data = await fetchCategory(categorySlug);
      setCategory(data);
    } catch (error) {
      if (error.response && error.response.status === 404) {
        // Handle error (404 not found) if data does not exist on the backend
        navigate("/notFound", {
          state: { fromApiRequest: true },
          replace: true,
        });
        console.error("Error loading category data:", error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (values, actions) => {
    try {
      const response = await updateCategory(categorySlug, values);
      if (response.status === 200) {
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

  useEffect(() => {
    if (categorySlug) {
      getCategory();
    }
  }, [categorySlug]);

  return (
    <DashboardMainLayout>
      <DashboardFormLayout formTitle="Edit category">
        {loading ? (
          <Loading />
        ) : (
          <CategoryForm
            initialValues={initialValues}
            onSubmit={handleSubmit}
            isEditMode={true}
          />
        )}
      </DashboardFormLayout>
    </DashboardMainLayout>
  );
}

export default CategoryUpdate;
