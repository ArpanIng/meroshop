import React from "react";
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
    category: "",
    vendor: "",
    status: "",
  };

  const handleSubmit = async (values) => {
    // Multipart Bodies
    const formData = new FormData();
    // Append the fields to formData
    formData.append("name", values.name);
    formData.append("description", values.description);
    formData.append("price", values.price);
    formData.append("discount_price", values.discountPrice);
    formData.append("stock", values.stock);
    formData.append("image", values.image);
    formData.append("category", values.category);
    formData.append("vendor", values.vendor);
    formData.append("status", values.status);
    try {
      const response = await createProduct(formData);
      if (response.status === 201) {
        navigate("/admin/products");
      }
    } catch (error) {
      throw error;
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
