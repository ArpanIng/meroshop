import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import CategoryForm from "./CategoryForm";
import Loading from "../../components/Loading";
import DashboardMainLayout from "../../layouts/DashboardMainLayout";
import DashboardFormLayout from "../../layouts/DashboardFormLayout";
import { fetchCategory, updateCategory } from "../../services/api/categoryApi";

function CategoryUpdate() {
  const [category, setCategory] = useState({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  let { categorySlug } = useParams();

  const initialValues = {
    name: category.name || "",
  };

  const getCategory = async () => {
    setLoading(true);
    try {
      const data = await fetchCategory(categorySlug);
      setCategory(data);
    } catch (error) {
      if (error.response && error.response.status === 404) {
        // redirect user to notFound page if id does not exist on the backend
        // navigate("");
      }
      console.error("Error loading category data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (values) => {
    try {
      const response = await updateCategory(categorySlug, values);
      console.log("updare response", response);
      if (response.status === 200) {
        navigate("/admin/categories");
      }
    } catch (error) {
      throw error;
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
