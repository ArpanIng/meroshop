import React from "react";
import humps from "humps";
import { useNavigate } from "react-router-dom";
import VendorForm from "./VendorForm";
import DashboardMainLayout from "../../layouts/DashboardMainLayout";
import DashboardFormLayout from "../../layouts/DashboardFormLayout";
import { createVendor } from "../../services/api/vendorApi";

function VendorCreate() {
  const navigate = useNavigate();

  const initialValues = {
    name: "",
    description: "",
    userId: "",
    email: "",
    address: "",
    phoneNumber: "",
    status: "",
  };

  const handleSubmit = async (values, actions) => {
    // convert values to snake_case
    const snakeCaseData = humps.decamelizeKeys(values);

    try {
      const response = await createVendor(snakeCaseData);
      if (response.status === 201) {
        navigate("/admin/vendors");
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
      <DashboardFormLayout formTitle="Add a new vendor">
        <VendorForm
          initialValues={initialValues}
          onSubmit={handleSubmit}
          isEditMode={false}
        />
      </DashboardFormLayout>
    </DashboardMainLayout>
  );
}

export default VendorCreate;
