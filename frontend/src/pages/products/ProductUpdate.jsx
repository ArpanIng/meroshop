import React, { useEffect, useState } from "react";
import humps from "humps";
import { useNavigate, useParams } from "react-router-dom";
import ProductForm from "./ProductForm";
import { useChoices } from "../../contexts/ChoicesContext";
import Loading from "../../components/Loading";
import DashboardMainLayout from "../../layouts/DashboardMainLayout";
import DashboardFormLayout from "../../layouts/DashboardFormLayout";
import { fetchProduct, updateProduct } from "../../services/api/productApi";

function ProductUpdate() {
  const [product, setProduct] = useState({});
  const [loading, setLoading] = useState(true);
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
    discountPrice: product.discountPrice || "",
    stock: product.stock || "",
    image: product.image || "",
    categoryId: product.category ? product.category.id : "",
    vendorId: product.vendor ? product.vendor.id : "",
    status: selectedStatusOptionValue,
  };

  const getProduct = async () => {
    try {
      const data = await fetchProduct(productSlug);
      setProduct(data);
    } catch (error) {
      if (error.response && error.response.status === 404) {
        // Handle error 404 not found when fetch api from backend
        navigate("/notFound", {
          state: { fromApiRequest: true },
          replace: true,
        });
        console.error("Error loading product data:", error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (values, actions) => {
    const formData = new FormData();
    formData.append("name", values.name);
    formData.append("description", values.description);
    formData.append("price", values.price);
    formData.append("discount_price", values.discountPrice);
    formData.append("stock", values.stock);
    // append the image data only if it is a valid File object
    if (values.image instanceof File) {
      formData.append("image", values.image);
    }
    formData.append("category_id", values.categoryId);
    formData.append("vendor_id", values.vendorId);
    formData.append("status", values.status);

    try {
      const response = await updateProduct(productSlug, formData);
      if (response.status === 200) {
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
