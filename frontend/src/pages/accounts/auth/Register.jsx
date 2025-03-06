import React, { useState } from "react";
import { useFormik } from "formik";
import { Button, Label, TextInput } from "flowbite-react";
import { Link } from "react-router-dom";
import AuthLayout from "../../../components/layouts/AuthLayout";
import { useAuth } from "../../../contexts/AuthContext";
import { userRegistrationValidationSchema } from "../../../schemas/userValidationSchema";

function Register() {
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();

  const initialValues = {
    firstName: "",
    lastName: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  };

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
    validationSchema: userRegistrationValidationSchema,
    onSubmit: async (values, actions) => {
      setLoading(true);
      try {
        await register(values, actions);
      } catch (error) {
        actions.setErrors(error);
      } finally {
        setLoading(false);
      }
    },
  });

  return (
    <AuthLayout title="Create an account">
      <form className="space-y-4 md:space-y-6" onSubmit={handleSubmit}>
        {errors.nonFieldErrors && (
          <p className="text-sm text-red-600 dark:text-red-500">
            {errors.nonFieldErrors}
          </p>
        )}
        <div className="grid gap-4 sm:grid-cols-2 sm:gap-6">
          {/* first name field */}
          <div className="w-full">
            <Label
              htmlFor="first_name"
              value="First name"
              className="block mb-2"
            />
            <TextInput
              type="text"
              id="first_name"
              name="firstName"
              value={values.firstName}
              onChange={handleChange}
              color={touched.firstName && errors.firstName ? "failure" : "gray"}
              onBlur={handleBlur}
              helperText={
                <>
                  {touched.firstName && errors.firstName ? (
                    <span>{errors.firstName}</span>
                  ) : null}
                </>
              }
            />
          </div>
          {/* last name field */}
          <div className="w-full">
            <Label
              htmlFor="last_name"
              value="Last name"
              className="block mb-2"
            />
            <TextInput
              type="text"
              id="last_name"
              name="lastName"
              value={values.lastName}
              onChange={handleChange}
              color={touched.lastName && errors.lastName ? "failure" : "gray"}
              onBlur={handleBlur}
              helperText={
                <>
                  {touched.lastName && errors.lastName ? (
                    <span>{errors.lastName}</span>
                  ) : null}
                </>
              }
            />
          </div>
          {/* username field */}
          <div className="sm:col-span-2">
            <Label htmlFor="username" value="Username" className="block mb-2" />
            <TextInput
              type="text"
              id="username"
              name="username"
              value={values.username}
              onChange={handleChange}
              color={touched.username && errors.username ? "failure" : "gray"}
              onBlur={handleBlur}
              helperText={
                <>
                  {touched.username && errors.username ? (
                    <span>{errors.username}</span>
                  ) : null}
                </>
              }
            />
          </div>
          {/* email field */}
          <div className="sm:col-span-2">
            <Label htmlFor="email" value="Email" className="block mb-2" />
            <TextInput
              type="email"
              id="email"
              placeholder="name@example.com"
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
          {/* password field */}
          <div className="sm:col-span-2">
            <Label htmlFor="password" value="Password" className="block mb-2" />
            <TextInput
              type="password"
              id="password"
              name="password"
              value={values.password}
              onChange={handleChange}
              color={touched.password && errors.password ? "failure" : "gray"}
              onBlur={handleBlur}
              helperText={
                <>
                  {touched.password && errors.password ? (
                    <span>{errors.password}</span>
                  ) : null}
                </>
              }
            />
          </div>
          {/* password confirmation field */}
          <div className="sm:col-span-2">
            <Label
              htmlFor="confirm-password"
              value="Confirm password"
              className="block mb-2"
            />
            <TextInput
              type="password"
              id="confirm-password"
              name="confirmPassword"
              value={values.confirmPassword}
              onChange={handleChange}
              color={
                touched.confirmPassword && errors.confirmPassword
                  ? "failure"
                  : "gray"
              }
              onBlur={handleBlur}
              helperText={
                <>
                  {touched.confirmPassword && errors.confirmPassword ? (
                    <span>{errors.confirmPassword}</span>
                  ) : null}
                </>
              }
            />
          </div>
        </div>
        <Button
          color="blue"
          type="submit"
          className="w-full"
          disabled={isSubmitting}
        >
          Create an account
        </Button>
        <p className="text-sm font-light text-gray-500 dark:text-gray-400">
          Already have an account?{" "}
          <Link
            to="/auth/login"
            className="font-medium text-primary-600 hover:underline dark:text-primary-500"
          >
            Login
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
}

export default Register;
