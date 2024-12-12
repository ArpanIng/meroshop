import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button, Label, Textarea, TextInput } from "flowbite-react";
import { useFormik } from "formik";
import * as Yup from "yup";
import PropTypes from "prop-types";
import api from "../../api/endpoint";
import DashboardMainLayout from "../../layouts/DashboardMainLayout";
import DashboardFormLayout from "../../layouts/DashboardFormLayout";

function ProductForm({ mode }) {
  const [errorMessage, setErrorMessage] = useState("");
  let { productSlug } = useParams();
  const navigate = useNavigate();

  const initialValues = {};

  const validationSchema = Yup.object({});

  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: async (values, { resetForm }) => {},
  });

  const fetchProduct = async () => {
    try {
    } catch (error) {
      console.error("Error fetching product:", error);
    }
  };

  useEffect(() => {}, []);

  return (
    <DashboardMainLayout>
      <DashboardFormLayout
        formTitle={mode === "ADD" ? "Add a new product" : "Edit product"}
      >
        <form>
          <div className="grid gap-4 sm:grid-cols-2 sm:gap-6">
            <div className="sm:col-span-2"></div>
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
