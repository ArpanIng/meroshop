import React, { useState } from "react";
import { useFormik } from "formik";
import { Button, Label, TextInput } from "flowbite-react";
import { Link } from "react-router-dom";
import AuthLayout from "../../../components/layouts/AuthLayout";
import { useAuth } from "../../../contexts/AuthContext";
import { userLoginValidationSchema } from "../../../schemas/userValidationSchema";

function Login() {
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const initialValues = {
    email: "",
    password: "",
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
    validationSchema: userLoginValidationSchema,
    onSubmit: async (values, actions) => {
      setLoading(true);
      try {
        await login(values);
      } catch (error) {
        actions.setErrors(error);
      } finally {
        setLoading(false);
      }
    },
  });

  return (
    <AuthLayout title="Sign in to your account">
      <form className="space-y-4 md:space-y-6" onSubmit={handleSubmit}>
        {errors.detail && (
          <p className="text-sm text-red-600 dark:text-red-500">
            {errors.detail}
          </p>
        )}
        {/* email field */}
        <div>
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
        <div>
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
        <div className="flex items-center justify-between">
          <div className="flex items-start">
            <div className="flex items-center h-5">
              <input
                id="remember"
                aria-describedby="remember"
                type="checkbox"
                className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-primary-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-primary-600 dark:ring-offset-gray-800"
                required=""
              />
            </div>
            <div className="ml-3 text-sm">
              <label
                htmlFor="remember"
                className="text-gray-500 dark:text-gray-300"
              >
                Remember me
              </label>
            </div>
          </div>
          <a
            href="#"
            className="text-sm font-medium text-primary-600 hover:underline dark:text-primary-500"
          >
            Forgot password?
          </a>
        </div>
        <Button
          color="blue"
          type="submit"
          className="w-full"
          disabled={isSubmitting}
        >
          Sign in
        </Button>
        <p className="text-sm font-light text-gray-500 dark:text-gray-400">
          Don’t have an account yet?{" "}
          <Link
            to="/auth/register"
            className="font-medium text-primary-600 hover:underline dark:text-primary-500"
          >
            Sign up
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
}

export default Login;
