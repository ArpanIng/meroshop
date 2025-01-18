import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ProductForm from "./ProductForm";
import { useChoices } from "../../contexts/ChoicesContext";
import Loading from "../../components/Loading";
import DashboardMainLayout from "../../layouts/DashboardMainLayout";
import DashboardFormLayout from "../../layouts/DashboardFormLayout";
import { fetchProduct, updateProduct } from "../../services/api/productApi";

function ProductUpdate() {
  const [product, setProduct] = useState({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  let { productSlug } = useParams();
  const { productStatusChoices } = useChoices();

  // find value of the selected status option based on the label
  const selectedStatusOption = productStatusChoices.find(
    (choice) => choice.label === product.status
  );
  const selectedStatusOptionValue = selectedStatusOption
    ? selectedStatusOption.value
    : "";

  const initialValues = {
    name: product.name || "",
    description: product.description || "",
    price: product.price || "",
    discountPrice: product.discount_price || "",
    stock: product.stock || "",
    image: product.image || "",
    category: product.category ? product.category.id : "",
    vendor: product.vendor ? product.vendor.id : "",
    status: selectedStatusOptionValue,
  };

  const getProduct = async () => {
    setLoading(true);
    try {
      const data = await fetchProduct(productSlug);
      setProduct(data);
    } catch (error) {
      console.error("Error loading product data:", error.message);
    } finally {
      setLoading(false);
    }
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
      const response = await updateProduct(productSlug, formData);
      if (response.status === 200) {
        navigate("/admin/products");
      }
    } catch (error) {
      throw error;
    }
  };

  useEffect(() => {
    if (productSlug) {
      getProduct();
    }
  }, [productSlug]);

  return (
    <DashboardMainLayout>
      <DashboardFormLayout formTitle="Edit product">
        {loading ? (
          <Loading />
        ) : (
          <ProductForm
            initialValues={initialValues}
            onSubmit={handleSubmit}
            isEditMode={true}
          />
        )}
      </DashboardFormLayout>
    </DashboardMainLayout>
  );
}

export default ProductUpdate;
