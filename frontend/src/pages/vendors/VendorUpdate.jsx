import React, { useEffect, useState } from "react";
import humps from "humps";
import { useNavigate, useParams } from "react-router-dom";
import VendorForm from "./VendorForm";
import { useChoices } from "../../contexts/ChoicesContext";
import Loading from "../../components/Loading";
import DashboardMainLayout from "../../layouts/DashboardMainLayout";
import DashboardFormLayout from "../../layouts/DashboardFormLayout";
import { fetchVendor, updateVendor } from "../../services/api/vendorApi";

function VendorUpdate() {
  const [vendor, setVendor] = useState({});
  const [loading, setLoading] = useState(true);
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
    userId: vendor.user ? vendor.user.id : "",
    email: vendor.email || "",
    address: vendor.address || "",
    phoneNumber: vendor.phoneNumber || "",
    status: selectedStatusOptionValue,
  };

  const getVendor = async () => {
    try {
      const data = await fetchVendor(vendorId);
      setVendor(data);
    } catch (error) {
      if (error.response && error.response.status === 404) {
        // Handle error 404 not found when fetch api from backend
        navigate("/notFound", {
          state: { fromApiRequest: true },
          replace: true,
        });
        console.error("Error loading vendor data:", error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (values, actions) => {
    try {
      const response = await updateVendor(vendorId, values);
      if (response.status === 200) {
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
