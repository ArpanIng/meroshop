import React, { useEffect, useState } from "react";
import { Button, Label, Select, TextInput, Textarea } from "flowbite-react";
import { useFormik } from "formik";
import PropTypes from "prop-types";
import { useChoices } from "../../contexts/ChoicesContext";
import Loading from "../../components/Loading";
import { vendorValidationSchema } from "../../schemas/vendorValidationSchema";
import { fetchVendorUsers } from "../../services/api/userApi";

function VendorForm({ initialValues, onSubmit, isEditMode = false }) {
  const [loading, setLoading] = useState(false);
  const [vendorUsers, setVendorUsers] = useState([]);
  const { vendorStatusChoices } = useChoices();

  const {
    values,
    errors,
    touched,
    handleBlur,
    handleChange,
    handleSubmit,
    isSubmitting,
  } = useFormik({
    initialValues,
    validationSchema: vendorValidationSchema,
    onSubmit: async (values, actions) => {
      try {
        await onSubmit(values, actions);
      } catch (error) {
        if (error.response && error.response.data) {
          const errorData = error.response.data;
          // map backend errors to formik
          const errors = {};
          Object.keys(errorData).forEach((field) => {
            errors[field] = errorData[field].join("");
          });
          actions.setErrors(errors); // Set backend errors in Formik
        } else {
          console.error("An error occured. Please try again.");
        }
        console.error("Error submitting form:", error);
      } finally {
        actions.setSubmitting(false);
      }
    },
  });

  const getVendorUsers = async () => {
    setLoading(true);
    try {
      const data = await fetchVendorUsers();
      setVendorUsers(data);
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getVendorUsers();
  }, []);

  return (
    <form onSubmit={handleSubmit}>
      <div className="grid gap-4 sm:grid-cols-2 sm:gap-6">
        {/* Name field */}
        <div className="sm:col-span-2">
          <Label htmlFor="name" value="Vendor name" className="block mb-2" />
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
        {/* User field */}
        <div className="sm:col-span-2">
          <Label htmlFor="user" value="User" className="block mb-2" />
          {loading ? (
            <Loading />
          ) : (
            <Select
              id="user"
              name="user"
              value={values.user}
              onChange={handleChange}
              color={touched.user && errors.user ? "failure" : "gray"}
              onBlur={handleBlur}
              helperText={
                <>
                  {touched.user && errors.user ? (
                    <span>{errors.user}</span>
                  ) : null}
                </>
              }
            >
              <option value="" disabled>
                ------
              </option>
              {vendorUsers.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.email}
                </option>
              ))}
            </Select>
          )}
        </div>
        {/* Email field */}
        <div>
          <Label htmlFor="email" value="Email" className="block mb-2" />
          <TextInput
            type="email"
            id="email"
            name="email"
            value={values.email}
            onChange={handleChange}
            color={touched.email && errors.email ? "failure" : "gray"}
            onBlur={handleBlur}
            helperText={
              <>
                {touched.email && errors.email ? (
                  <span>{errors.email}</span>
                ) : null}
              </>
            }
          />
        </div>
        {/* Address field */}
        <div>
          <Label htmlFor="address" value="Address" className="block mb-2" />
          <TextInput
            type="text"
            id="address"
            name="address"
            value={values.address}
            onChange={handleChange}
            color={touched.address && errors.address ? "failure" : "gray"}
            onBlur={handleBlur}
            helperText={
              <>
                {touched.address && errors.address ? (
                  <span>{errors.address}</span>
                ) : null}
              </>
            }
          />
        </div>
        {/* Phone number field */}
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
            value={values.phoneNumber}
            onChange={handleChange}
            color={
              touched.phoneNumber && errors.phoneNumber ? "failure" : "gray"
            }
            onBlur={handleBlur}
            helperText={
              <>
                {touched.phoneNumber && errors.phoneNumber ? (
                  <span>{errors.phoneNumber}</span>
                ) : null}
              </>
            }
          />
        </div>
        {/* Status field */}
        <div>
          <Label
            htmlFor="status"
            value="Select status"
            className="block mb-2"
          />
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
            {vendorStatusChoices.map((choice) => (
              <option key={choice.value} value={choice.value}>
                {choice.label}
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
        {isEditMode ? "Edit vendor" : "Add vendor"}
      </Button>
    </form>
  );
}

VendorForm.propTypes = {
  initialValues: PropTypes.object.isRequired,
  onSubmit: PropTypes.func.isRequired,
  isEditMode: PropTypes.bool,
};

export default VendorForm;
