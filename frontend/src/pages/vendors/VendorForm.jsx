import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button, Label, Select, TextInput, Textarea } from "flowbite-react";
import { useFormik } from "formik";
import * as Yup from "yup";
import PropTypes from "prop-types";
import api from "../../api/endpoint";
import DashboardMainLayout from "../../layouts/DashboardMainLayout";
import DashboardFormLayout from "../../layouts/DashboardFormLayout";

function VendorForm({ mode }) {
  const [errorMessage, setErrorMessage] = useState("");
  let { vendorId } = useParams();
  const navigate = useNavigate();

  const initialValues = {
    name: "",
    description: "",
    email: "",
    address: "",
    phoneNumber: "",
    status: "",
  };

  const validationSchema = Yup.object({
    name: Yup.string()
      .min(3, "Too Short!")
      .max(50, "Too Long!")
      .required("Vendor name is required"),
    description: Yup.string().max(
      500,
      "Description cannot exceed 255 characters"
    ),
    email: Yup.string().email("Invalid email").required("Email is required"),
    address: Yup.string()
      .max(100, "Address cannot exceed 100 characters")
      .required("Address is required"),
    phoneNumber: Yup.string()
      .matches(/^[0-9]{10}$/, "Phone number must be exactly 10 digits")
      .required("Phone number is required"),
    status: Yup.string()
      .oneOf(
        ["active", "inactive"],
        "Status must be either 'active' or 'inactive'"
      )
      .required("Select status"),
  });

  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: async (values, { resetForm }) => {
      try {
        setErrorMessage("");
        if (mode === "EDIT") {
          await api.put(`/api/vendors/${vendorId}/`, values);
        } else {
          await api.post("/api/vendors", values);
          resetForm();
        }
        navigate("/admin/vendors");
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

  const fetchVendor = async () => {
    try {
      const response = await api.get(`/api/vendors/${vendorId}`);
      formik.setValues(response.data);
    } catch (error) {
      console.error("Error fetching vendor:", error);
    }
  };

  useEffect(() => {
    if (mode === "EDIT" && vendorId) {
      fetchVendor();
    }
  }, []);

  return (
    <DashboardMainLayout>
      <DashboardFormLayout
        formTitle={mode === "ADD" ? "Add a new vendor" : "Edit vendor"}
      >
        <form onSubmit={formik.handleSubmit}>
          <div className="grid gap-4 sm:grid-cols-2 sm:gap-6">
            <div className="sm:col-span-2">
              <Label
                htmlFor="name"
                value="Vendor name"
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
            <div>
              <Label htmlFor="email" value="Email" className="block mb-2" />
              <TextInput
                type="email"
                id="email"
                name="email"
                value={formik.values.email}
                onChange={formik.handleChange}
                color={formik.errors.name ? "failure" : "gray"}
                helperText={
                  <>
                    {formik.errors.email ? (
                      <span>{formik.errors.email}</span>
                    ) : (
                      ""
                    )}
                  </>
                }
              />
            </div>
            <div>
              <Label htmlFor="address" value="Address" className="block mb-2" />
              <TextInput
                type="text"
                id="address"
                name="address"
                value={formik.values.address}
                onChange={formik.handleChange}
                color={formik.errors.name ? "failure" : "gray"}
                helperText={
                  <>
                    {formik.errors.address ? (
                      <span>{formik.errors.address}</span>
                    ) : (
                      ""
                    )}
                  </>
                }
              />
            </div>
            <div>
              <Label
                htmlFor="phone-number"
                value="Phone number"
                className="block mb-2"
              />
              <TextInput
                type="number"
                id="phone-number"
                name="phoneNumber"
                value={formik.validateField.phoneNumber}
                onChange={formik.handleChange}
                color={formik.errors.name ? "failure" : "gray"}
                helperText={
                  <>
                    {formik.errors.phoneNumber ? (
                      <span>{formik.errors.phoneNumber}</span>
                    ) : (
                      ""
                    )}
                  </>
                }
              />
            </div>
            <div>
              <Label htmlFor="status" value="Status" className="block mb-2" />
              <Select
                id="status"
                name="status"
                value={formik.validateField.status}
                onChange={formik.handleChange}
                color={formik.errors.status ? "failure" : "gray"}
                helperText={
                  <>
                    {formik.errors.status ? (
                      <span>{formik.errors.status}</span>
                    ) : (
                      ""
                    )}
                  </>
                }
              >
                <option>Active</option>
                <option>Inactive</option>
              </Select>
            </div>
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
                value={formik.validateField.description}
                onChange={formik.handleChange}
                color={formik.errors.description ? "failure" : "gray"}
                helperText={
                  <>
                    {formik.errors.description ? (
                      <span>{formik.errors.description}</span>
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
            {mode === "ADD" ? "Add vendor" : "Edit vendor"}
          </Button>
        </form>
      </DashboardFormLayout>
    </DashboardMainLayout>
  );
}

VendorForm.propTypes = {
  mode: PropTypes.oneOf(["ADD", "EDIT"]).isRequired,
};

export default VendorForm;
