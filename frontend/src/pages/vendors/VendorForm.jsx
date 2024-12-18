import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button, Label, Select, TextInput, Textarea } from "flowbite-react";
import { useFormik } from "formik";
import * as Yup from "yup";
import PropTypes from "prop-types";
import Loading from "../../components/Loading";
import DashboardMainLayout from "../../layouts/DashboardMainLayout";
import DashboardFormLayout from "../../layouts/DashboardFormLayout";
import {
  createVendor,
  fetchVendor,
  fetchVendorStatusChoices,
  updateVendor,
} from "../../services/api/vendorApi";

function VendorForm({ mode }) {
  const [statusChoices, setStatusChoices] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);
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
    status: Yup.string().required("Select status"),
  });

  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: async (values, { resetForm }) => {
      const submitFormData = {
        name: values.name,
        description: values.description,
        email: values.email,
        address: values.address,
        phone_number: values.phoneNumber,
        status: values.status,
      };

      try {
        setErrorMessage("");
        if (mode === "EDIT") {
          await updateVendor(vendorId, submitFormData);
        } else {
          await createVendor(submitFormData);
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

  /*
  fetches vendor status field choices with OPTIONS request
  */
  const getVendorStatusChoices = async () => {
    setLoading(true);
    try {
      const options = await fetchVendorStatusChoices(vendorId);
      setStatusChoices(options);
    } catch (error) {
      console.error("Error loading vendor status choices:", error);
    } finally {
      setLoading(false);
    }
  };

  const getVendor = async () => {
    setLoading(true);
    try {
      const data = await fetchVendor(vendorId);
      formik.setValues(data);
    } catch (error) {
      console.error("Error loading vendor data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (mode === "EDIT" && vendorId) {
      getVendor();
    }
    getVendorStatusChoices();
  }, []);

  return (
    <DashboardMainLayout>
      <DashboardFormLayout
        formTitle={mode === "ADD" ? "Add a new vendor" : "Edit vendor"}
      >
        {loading ? (
          <Loading />
        ) : (
          <form onSubmit={formik.handleSubmit}>
            <div className="grid gap-4 sm:grid-cols-2 sm:gap-6">
              {errorMessage && (
                <div className="text-red-600">{errorMessage}</div>
              )}
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
                  onBlur={formik.handleBlur}
                  helperText={
                    <>
                      {formik.touched.name && formik.errors.name ? (
                        <span>{formik.errors.name}</span>
                      ) : null}
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
                  color={formik.errors.email ? "failure" : "gray"}
                  onBlur={formik.handleBlur}
                  helperText={
                    <>
                      {formik.touched.email && formik.errors.email ? (
                        <span>{formik.errors.email}</span>
                      ) : null}
                    </>
                  }
                />
              </div>
              <div>
                <Label
                  htmlFor="address"
                  value="Address"
                  className="block mb-2"
                />
                <TextInput
                  type="text"
                  id="address"
                  name="address"
                  value={formik.values.address}
                  onChange={formik.handleChange}
                  color={formik.errors.address ? "failure" : "gray"}
                  onBlur={formik.handleBlur}
                  helperText={
                    <>
                      {formik.touched.address && formik.errors.address ? (
                        <span>{formik.errors.address}</span>
                      ) : null}
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
                  type="text"
                  id="phone-number"
                  name="phoneNumber"
                  value={formik.values.phoneNumber}
                  onChange={formik.handleChange}
                  color={formik.errors.phoneNumber ? "failure" : "gray"}
                  onBlur={formik.handleBlur}
                  helperText={
                    <>
                      {formik.touched.phoneNumber &&
                      formik.errors.phoneNumber ? (
                        <span>{formik.errors.phoneNumber}</span>
                      ) : null}
                    </>
                  }
                />
              </div>
              <div>
                <Label
                  htmlFor="status"
                  value="Select status"
                  className="block mb-2"
                />
                <Select
                  id="status"
                  name="status"
                  value={formik.values.status}
                  onChange={formik.handleChange}
                  color={formik.errors.status ? "failure" : "gray"}
                  onBlur={formik.handleBlur}
                  helperText={
                    <>
                      {formik.touched.status && formik.errors.status ? (
                        <span>{formik.errors.status}</span>
                      ) : null}
                    </>
                  }
                >
                  <option value="" disabled>
                    Select status
                  </option>
                  {statusChoices.map((choice) => (
                    <option key={choice.value} value={choice.value}>
                      {choice.display_name}
                    </option>
                  ))}
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
                  value={formik.values.description}
                  onChange={formik.handleChange}
                  color={formik.errors.description ? "failure" : "gray"}
                  onBlur={formik.handleBlur}
                  helperText={
                    <>
                      {formik.touched.description &&
                      formik.errors.description ? (
                        <span>{formik.errors.description}</span>
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
              disabled={formik.isSubmitting}
            >
              {mode === "ADD" ? "Add vendor" : "Edit vendor"}
            </Button>
          </form>
        )}
      </DashboardFormLayout>
    </DashboardMainLayout>
  );
}

VendorForm.propTypes = {
  mode: PropTypes.oneOf(["ADD", "EDIT"]).isRequired,
};

export default VendorForm;
