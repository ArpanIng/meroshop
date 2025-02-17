import { Button, Label, TextInput } from "flowbite-react";
import React, { useState } from "react";

function ProfileUpdate() {
  const [userData, setUserData] = useState({
    firstName: "",
    lastName: "",
    username: "",
    email: "",
    profile: {
      city: "",
      state: "",
      address: "",
      phoneNumber: "",
      profilePicture: "",
    },
  });

  return (
    <section className="bg-white dark:bg-gray-900">
      <div className="py-8 px-4 mx-auto max-w-2xl lg:py-16">
        <h2 className="mb-4 text-xl font-bold text-gray-900 dark:text-white">
          Add a new product
        </h2>
        <form action="#">
          <div className="grid gap-4 sm:grid-cols-2 sm:gap-6">
            <div className="w-full">
              <Label
                htmlFor="first-name"
                value="First name"
                className="block mb-2"
              />
              <TextInput type="text" name="firstName" id="first-name" />
            </div>
            <div className="w-full">
              <Label
                htmlFor="last-name"
                value="Last name"
                className="block mb-2"
              />
              <TextInput type="text" name="lastName" id="last-name" />
            </div>
            <div>
              <Label
                htmlFor="username"
                value="Username"
                className="block mb-2"
              />
              <TextInput type="text" name="username" id="username" />
            </div>
            <div>
              <Label htmlFor="email" value="Email" className="block mb-2" />
              <TextInput type="email" name="email" id="email" />
            </div>
          </div>
          <Button color="blue" type="submit" className="inline-flex mt-4">
            Update
          </Button>
        </form>
      </div>
    </section>
  );
}

export default ProfileUpdate;
