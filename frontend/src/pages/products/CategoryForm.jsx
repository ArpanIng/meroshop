import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button, Label, TextInput } from "flowbite-react";
import { useFormik } from "formik";
import * as Yup from "yup";
import PropTypes from "prop-types";
import DashboardMainLayout from "../../layouts/DashboardMainLayout";
import DashboardFormLayout from "../../layouts/DashboardFormLayout";
import {
  createCategory,
  fetchCategory,
  updateCategory,
} from "../../services/api/categoryApi";

function CategoryForm({ mode }) {
  const [errorMessage, setErrorMessage] = useState(""); // State for server error message
  let { categoryId } = useParams();
  const navigate = useNavigate();

  const initialValues = {
    name: "",
  };

  const validationSchema = Yup.object({
    name: Yup.string()
      .min(3, "Too Short!")
      .max(30, "Too Long!")
      .required("Category name is required"),
  });

  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: async (values, { resetForm }) => {
      try {
        setErrorMessage("");
        if (mode === "EDIT") {
          // update existing category
          await updateCategory(categoryId, values);
        } else {
          // create new category
          await createCategory(values);
          resetForm();
        }
        navigate("/admin/categories");
      } catch (error) {
        if (error.response && error.response.data && error.response.data.name) {
          setErrorMessage(error.response.data.name[0]);
        } else {
          setErrorMessage("An error occured. Please try again.");
        }
        console.error("Error submitting form:", error);
      }
    },
  });

  const getCategory = async () => {
    try {
      const data = await fetchCategory(categoryId);
      formik.setValues({ name: data.name });
    } catch (error) {
      console.error("Error loading category data:", error);
    }
  };

  useEffect(() => {
    if (mode === "EDIT" && categoryId) {
      getCategory();
    }
  }, []);

  return (
    <DashboardMainLayout>
      <DashboardFormLayout
        formTitle={mode === "ADD" ? "Add a new category" : "Edit category"}
      >
        <form onSubmit={formik.handleSubmit}>
          <div className="grid gap-4 sm:grid-cols-2 sm:gap-6">
            {errorMessage && <div className="text-red-600">{errorMessage}</div>}
            <div className="sm:col-span-2">
              <Label
                htmlFor="name"
                value="Category Name"
                className="block mb-2"
              />
              <TextInput
                type="text"
                id="name"
                name="name"
                value={formik.values.name}
                onChange={formik.handleChange}
                color={formik.errors.name ? "failure" : "gray"}
                helperText={
                  <>
                    {formik.errors.name ? (
                      <span>{formik.errors.name}</span>
                    ) : (
                      ""
                    )}
                  </>
                }
              />
            </div>
          </div>
          <Button
            type="submit"
            color="blue"
            className="mt-4"
            disabled={formik.isSubmitting}
          >
            {mode === "ADD" ? "Add category" : "Edit category"}
          </Button>
        </form>
      </DashboardFormLayout>
    </DashboardMainLayout>
  );
}

CategoryForm.propTypes = {
  mode: PropTypes.oneOf(["ADD", "EDIT"]).isRequired,
};

export default CategoryForm;
