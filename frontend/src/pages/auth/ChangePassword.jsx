import React from "react";
import { Button, Label, TextInput } from "flowbite-react";
import AuthLayout from "../../layouts/AuthLayout";

function ChangePassword() {
  return (
    <AuthLayout title="Change password">
      <form className="space-y-4 lg:mt-5 md:space-y-5" action="#">
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
          <Label
            htmlFor="password"
            value="New Password"
            className="block mb-2"
          />
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
          Reset password
        </Button>
      </form>
    </AuthLayout>
  );
}

export default ChangePassword;
