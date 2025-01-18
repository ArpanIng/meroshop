import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import VendorForm from "./VendorForm";
import { useChoices } from "../../contexts/ChoicesContext";
import Loading from "../../components/Loading";
import DashboardMainLayout from "../../layouts/DashboardMainLayout";
import DashboardFormLayout from "../../layouts/DashboardFormLayout";
import { fetchVendor, updateVendor } from "../../services/api/vendorApi";

function VendorUpdate() {
  const [vendor, setVendor] = useState({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  let { vendorId } = useParams();
  const { vendorStatusChoices } = useChoices();

  // find value of the selected status option based on the label
  const selectedStatusOption = vendorStatusChoices.find(
    (choice) => choice.label === vendor.status
  );
  const selectedStatusOptionValue = selectedStatusOption
    ? selectedStatusOption.value
    : "";

  const initialValues = {
    name: vendor.name || "",
    description: vendor.description || "",
    user: vendor.user ? vendor.user.id : "",
    email: vendor.email || "",
    address: vendor.address || "",
    phoneNumber: vendor.phone_number || "",
    status: selectedStatusOptionValue,
  };

  const getVendor = async () => {
    setLoading(true);
    try {
      const data = await fetchVendor(vendorId);
      setVendor(data);
    } catch (error) {
      console.error("Error loading vendor data:", error.message);
    } finally {
      setLoading(false);
    }
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
      const response = await updateVendor(vendorId, submitFormDataValues);
      if (response.status === 200) {
        navigate("/admin/vendors");
      }
    } catch (error) {
      throw error;
    }
  };

  useEffect(() => {
    if (vendorId) {
      getVendor();
    }
  }, [vendorId]);

  return (
    <DashboardMainLayout>
      <DashboardFormLayout formTitle="Edit vendor">
        {loading ? (
          <Loading />
        ) : (
          <VendorForm
            initialValues={initialValues}
            onSubmit={handleSubmit}
            isEditMode={true}
          />
        )}
      </DashboardFormLayout>
    </DashboardMainLayout>
  );
}

export default VendorUpdate;
