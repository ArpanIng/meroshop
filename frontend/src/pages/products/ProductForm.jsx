import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button, Label, Select, Textarea, TextInput } from "flowbite-react";
import { useFormik } from "formik";
import * as Yup from "yup";
import PropTypes from "prop-types";
import DashboardMainLayout from "../../layouts/DashboardMainLayout";
import DashboardFormLayout from "../../layouts/DashboardFormLayout";
import api from "../../services/api/endpoint";

function ProductForm({ mode }) {
  const [statusChoices, setStatusChoices] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);
  let { productId } = useParams();
  const navigate = useNavigate();

  const initialValues = {
    name: "",
    description: "",
    price: "",
    discountPrice: "",
    stock: "",
    image: "",
    status: "",
    category: "",
    vendor: "",
  };

  const validationSchema = Yup.object({
    name: Yup.string()
      .min(3, "Name must be at least 3 characters")
      .max(50, "Name cannot exceed 50 characters")
      .required("Product name is required"),
    description: Yup.string()
      .min(10, "Description must be at least 10 characters")
      .max(500, "Description cannot exceed 500 characters")
      .required("Description is required"),
    price: Yup.number()
      .min(10, "Price must be at least 10")
      .typeError("Price must be a number")
      .positive("Price must be a positive number")
      .required("Price is required"),
    discountPrice: Yup.number()
      .min(0, "Discount Price cannot be negative")
      .max(Yup.ref("price"), "Discount Price cannot be greater than the Price")
      .typeError("Discount Price must be a number"),

    stock: Yup.number()
      .typeError("Stock must be a number")
      .required("Stock is required")
      .integer("Stock must be an integer")
      .min(0, "Stock cannot be negative"),
    image: Yup.string().url("Image must be a valid URL"),
    status: Yup.string().required("Status is required"),
    category: Yup.string()
      .required("Category is required")
      .min(2, "Category must be at least 2 characters"),
    vendor: Yup.string()
      .required("Vendor is required")
      .min(2, "Vendor must be at least 2 characters"),
  });

  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: async (values, { resetForm }) => {},
  });

  const fetchMetaData = async () => {
    setLoading(true);
    try {
      const url = vendorId ? `/api/products/${productId}` : "/api/products/";
      const response = await api.options(url);
      const optionStatusData = vendorId
        ? response.data.actions?.PUT?.status?.choices || []
        : response.data.actions?.POST?.status?.choices || [];
      setStatusChoices(optionStatusData);
    } catch (error) {
      console.error("Error fetching metadata:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchProduct = async () => {
    try {
      const response = await api.get(`/api/products/${productId}/`);
      console.log(response.data);
    } catch (error) {
      console.error("Error fetching product:", error);
    }
  };

  useEffect(() => {
    if (mode === "EDIT" && productId) {
      fetchProduct();
    }
    fetchMetaData();
  }, []);

  return (
    <DashboardMainLayout>
      <DashboardFormLayout
        formTitle={mode === "ADD" ? "Add a new product" : "Edit product"}
      >
        <form>
          <div className="grid gap-4 sm:grid-cols-2 sm:gap-6">
            <div className="sm:col-span-2">
              <Label
                htmlFor="name"
                value="Product name"
                className="block mb-2"
              />
              <TextInput type="text" id="name" name="name" />
            </div>
            <div>
              <Label htmlFor="price" value="Price" className="block mb-2" />
              <TextInput type="number" id="price" name="price" />
            </div>
            <div>
              <Label
                htmlFor="discount-price"
                value="Discount price"
                className="block mb-2"
              />
              <TextInput
                type="number"
                id="discount-price"
                name="discountPrice"
              />
            </div>
            <div>
              <Label htmlFor="stock" value="Stock" className="block mb-2" />
              <TextInput type="number" id="stock" name="stock" />
            </div>
            <div>
              <Label htmlFor="status" value="status" className="block mb-2" />
              <Select>
                <option>lol</option>
              </Select>
            </div>
            <div>
              <Label htmlFor="price" value="Price" className="block mb-2" />
              <TextInput type="number" id="price" name="price" />
            </div>
            <div>
              <Label htmlFor="price" value="Price" className="block mb-2" />
              <TextInput type="number" id="price" name="price" />
            </div>
            <div className="sm:col-span-2">
              <Label
                htmlFor="description"
                value="Description"
                className="block mb-2"
              />
              <Textarea id="description" name="description" rows={8} />
            </div>
          </div>
          <Button
            type="submit"
            color="blue"
            className="mt-4"
            disabled={formik.isSubmitting}
          >
            {mode === "ADD" ? "Add product" : "Edit product"}
          </Button>
        </form>
      </DashboardFormLayout>
    </DashboardMainLayout>
  );
}

ProductForm.propTypes = {
  mode: PropTypes.oneOf(["ADD", "EDIT"]).isRequired,
};

export default ProductForm;
