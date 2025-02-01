import React from "react";
import humps from "humps";
import { useNavigate } from "react-router-dom";
import ProductForm from "./ProductForm";
import DashboardMainLayout from "../../layouts/DashboardMainLayout";
import DashboardFormLayout from "../../layouts/DashboardFormLayout";
import { createProduct } from "../../services/api/productApi";

function ProductCreate() {
  const navigate = useNavigate();

  const initialValues = {
    name: "",
    description: "",
    price: "",
    discountPrice: "",
    stock: "",
    image: "",
    categoryId: "",
    vendorId: "",
    status: "",
  };

  const handleSubmit = async (values, actions) => {
    const formData = new FormData();
    formData.append("name", values.name);
    formData.append("description", values.description);
    formData.append("price", values.price);
    formData.append("discount_price", values.discountPrice);
    formData.append("stock", values.stock);
    formData.append("image", values.image);
    formData.append("category_id", values.categoryId);
    formData.append("vendor_id", values.vendorId);
    formData.append("status", values.status);

    try {
      const response = await createProduct(formData);
      if (response.status === 201) {
        navigate("/admin/products");
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
      <DashboardFormLayout formTitle="Add a new product">
        <ProductForm
          initialValues={initialValues}
          onSubmit={handleSubmit}
          isEditMode={false}
        />
      </DashboardFormLayout>
    </DashboardMainLayout>
  );
}

export default ProductCreate;
