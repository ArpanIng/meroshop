import React from "react";
import { Link } from "react-router-dom";
import { Button, Label, TextInput } from "flowbite-react";
import AuthLayout from "../../layouts/AuthLayout";

function Register() {
  return (
    <AuthLayout title="Create an account">
      <form className="space-y-4 md:space-y-6" action="#">
        <div>
          <Label htmlFor="email" value="Email" className="block mb-2" />
          <TextInput
            type="email"
            id="email"
            placeholder="name@example.com"
            required
          />
        </div>
        <div>
          <Label htmlFor="password" value="Password" className="block mb-2" />
          <TextInput type="password" id="password" required />
        </div>
        <div>
          <Label
            htmlFor="confirm-password"
            value="Confirm password"
            className="block mb-2"
          />
          <TextInput type="password" id="Confirm password" required />
        </div>
        <Button color="blue" type="submit" className="w-full">
          Create an account
        </Button>
        <p className="text-sm font-light text-gray-500 dark:text-gray-400">
          Already have an account?{" "}
          <Link
            to="/login"
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
