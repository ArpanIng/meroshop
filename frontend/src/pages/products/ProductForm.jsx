import React, { useEffect, useState } from "react";
import {
  Avatar,
  Button,
  FileInput,
  Label,
  Select,
  Textarea,
  TextInput,
} from "flowbite-react";
import { useFormik } from "formik";
import PropTypes from "prop-types";
import { useChoices } from "../../contexts/ChoicesContext";
import Loading from "../../components/Loading";
import { productValidationSchema } from "../../schemas/productValidationSchema";
import { fetchCategories } from "../../services/api/categoryApi";
import { fetchVendors } from "../../services/api/vendorApi";

function ProductForm({ initialValues, onSubmit, isEditMode = false }) {
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [vendors, setVendors] = useState([]);
  const { productStatusChoices } = useChoices();

  const {
    values,
    errors,
    touched,
    handleBlur,
    handleChange,
    setFieldValue,
    handleSubmit,
    isSubmitting,
  } = useFormik({
    initialValues,
    validationSchema: productValidationSchema,
    enableReinitialize: true, // Reinitializes form values when initialValues change
    onSubmit,
  });

  const getCategories = async () => {
    setLoading(true);
    try {
      const data = await fetchCategories();
      setCategories(data);
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const getVendors = async () => {
    setLoading(true);
    try {
      const data = await fetchVendors();
      setVendors(data.results);
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getCategories();
    getVendors();
  }, []);

  return (
    <form onSubmit={handleSubmit}>
      <div className="grid gap-4 sm:grid-cols-2 sm:gap-6">
        {/* Name field */}
        <div className="sm:col-span-2">
          <Label htmlFor="name" value="Product name" className="block mb-2" />
          <TextInput
            type="text"
            id="name"
            name="name"
            value={values.name}
            onChange={handleChange}
            color={touched.name && errors.name ? "failure" : "gray"}
            onBlur={handleBlur}
            helperText={
              <>
                {touched.name && errors.name ? (
                  <span>{errors.name}</span>
                ) : null}
              </>
            }
          />
        </div>
        {/* Price field */}
        <div className="w-full">
          <Label htmlFor="price" value="Price" className="block mb-2" />
          <TextInput
            type="number"
            id="price"
            name="price"
            value={values.price}
            onChange={handleChange}
            color={touched.price && errors.price ? "failure" : "gray"}
            onBlur={handleBlur}
            helperText={
              <>
                {touched.price && errors.price ? (
                  <span>{errors.price}</span>
                ) : (
                  "Original price of the product."
                )}
              </>
            }
          />
        </div>
        {/* Discount price field */}
        <div className="w-full">
          <Label
            htmlFor="discount-price"
            value="Discount price"
            className="block mb-2"
          />
          <TextInput
            type="number"
            id="discount-price"
            name="discountPrice"
            value={values.discountPrice}
            onChange={handleChange}
            color={
              touched.discountPrice && errors.discountPrice ? "failure" : "gray"
            }
            onBlur={handleBlur}
            helperText={
              <>
                {touched.discountPrice && errors.discountPrice ? (
                  <span>{errors.discountPrice}</span>
                ) : (
                  "Discounted price of the product."
                )}
              </>
            }
          />
        </div>
        {/* Stock field */}
        <div className="w-full">
          <Label htmlFor="stock" value="Stock" className="block mb-2" />
          <TextInput
            type="number"
            id="stock"
            name="stock"
            value={values.stock}
            onChange={handleChange}
            color={touched.stock && errors.stock ? "failure" : "gray"}
            onBlur={handleBlur}
            helperText={
              <>
                {touched.stock && errors.stock ? (
                  <span>{errors.stock}</span>
                ) : null}
              </>
            }
          />
        </div>
        {/* Status field */}
        <div className="w-full">
          <Label htmlFor="status" value="Status" className="block mb-2" />
          {loading ? (
            <Loading />
          ) : (
            <Select
              id="status"
              name="status"
              value={values.status}
              onChange={handleChange}
              color={touched.status && errors.status ? "failure" : "gray"}
              onBlur={handleBlur}
              helperText={
                <>
                  {touched.status && errors.status ? (
                    <span>{errors.status}</span>
                  ) : null}
                </>
              }
            >
              <option value="" disabled>
                Select status
              </option>
              {productStatusChoices.map((choice) => (
                <option key={choice.value} value={choice.value}>
                  {choice.label}
                </option>
              ))}
            </Select>
          )}
        </div>
        {/* Image preview */}
        {/* {values.image && (
          <div className="sm:col-span-2">
            <Label
              htmlFor="image"
              value="Preview image"
              className="block mb-2"
            />
            <Avatar img={values.image} alt={`${values.name} image`} size="xl" />
          </div>
        )} */}
        {/* Image field */}
        <div className="sm:col-span-2">
          <Label
            htmlFor="productImageFile"
            value="Upload image"
            className="block mb-2"
          />
          <FileInput
            id="productImageFile"
            accept="image/*"
            name="image"
            onChange={(e) => {
              setFieldValue("image", e.currentTarget.files[0]);
            }}
            color={touched.image && errors.image ? "failure" : "gray"}
            onBlur={handleBlur}
            helperText={
              <>
                {touched.image && errors.image ? (
                  <span>{errors.image}</span>
                ) : null}
              </>
            }
          />
        </div>
        {/* Category field */}
        <div className="w-full">
          <Label htmlFor="category" value="Category" className="block mb-2" />
          <Select
            id="category"
            name="categoryId"
            value={values.categoryId}
            onChange={handleChange}
            color={touched.categoryId && errors.categoryId ? "failure" : "gray"}
            onBlur={handleBlur}
            helperText={
              <>
                {touched.categoryId && errors.categoryId ? (
                  <span>{errors.categoryId}</span>
                ) : null}
              </>
            }
          >
            <option value="" disabled>
              Select category
            </option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </Select>
        </div>
        {/* Vendor field */}
        <div className="w-full">
          <Label htmlFor="vendor" value="Vendor" className="block mb-2" />
          <Select
            id="vendor"
            name="vendorId"
            value={values.vendorId}
            onChange={handleChange}
            color={touched.vendorId && errors.vendorId ? "failure" : "gray"}
            onBlur={handleBlur}
            helperText={
              <>
                {touched.vendorId && errors.vendorId ? (
                  <span>{errors.vendorId}</span>
                ) : null}
              </>
            }
          >
            <option value="" disabled>
              Select vendor
            </option>
            {vendors.map((vendor) => (
              <option key={vendor.id} value={vendor.id}>
                {vendor.name}
              </option>
            ))}
          </Select>
        </div>
        {/* Description field */}
        <div className="sm:col-span-2">
          <Label
            htmlFor="description"
            value="Description"
            className="block mb-2"
          />
          <Textarea
            id="description"
            name="description"
            rows={8}
            value={values.description}
            onChange={handleChange}
            color={
              touched.description && errors.description ? "failure" : "gray"
            }
            onBlur={handleBlur}
            helperText={
              <>
                {touched.description && errors.description ? (
                  <span>{errors.description}</span>
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
        {isEditMode ? "Edit product" : "Add product"}
      </Button>
    </form>
  );
}

ProductForm.propTypes = {
  initialValues: PropTypes.object.isRequired,
  onSubmit: PropTypes.func.isRequired,
  isEditMode: PropTypes.bool,
};

export default ProductForm;
