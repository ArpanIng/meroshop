import React from "react";
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
    user: "",
    email: "",
    address: "",
    phoneNumber: "",
    status: "",
  };

  const handleSubmit = async (values) => {
    try {
      const submitFormDataValues = {
        name: values.name,
        description: values.description,
        user: values.user,
        email: values.email,
        address: values.address,
        phone_number: values.phoneNumber,
        status: values.status,
      };
      const response = await createVendor(submitFormDataValues);
      if (response.status === 201) {
        navigate("/admin/vendors");
      }
    } catch (error) {
      throw error;
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
