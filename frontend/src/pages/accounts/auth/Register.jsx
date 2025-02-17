import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Button, Label, TextInput } from "flowbite-react";
import { useAuth } from "../../../contexts/AuthContext";
import AuthLayout from "../../../layouts/AuthLayout";

function Register() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();

  const handleRegister = async (e) => {
    setLoading(true);
    e.preventDefault();
    try {
      await register(
        firstName,
        lastName,
        username,
        email,
        password,
        confirmPassword
      );
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout title="Create an account">
      <form className="space-y-4 md:space-y-6" onSubmit={handleRegister}>
        <div>
          <Label
            htmlFor="first_name"
            value="First name"
            className="block mb-2"
          />
          <TextInput
            type="text"
            id="first_name"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
          />
        </div>
        <div>
          <Label htmlFor="last_name" value="Last name" className="block mb-2" />
          <TextInput
            type="text"
            id="last_name"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            required
          />
        </div>
        <div>
          <Label htmlFor="username" value="Username" className="block mb-2" />
          <TextInput
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div>
          <Label htmlFor="email" value="Email" className="block mb-2" />
          <TextInput
            type="email"
            id="email"
            placeholder="name@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <Label htmlFor="password" value="Password" className="block mb-2" />
          <TextInput
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <div>
          <Label
            htmlFor="confirm-password"
            value="Confirm password"
            className="block mb-2"
          />
          <TextInput
            type="password"
            id="confirm-password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </div>
        <Button color="blue" type="submit" className="w-full">
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
