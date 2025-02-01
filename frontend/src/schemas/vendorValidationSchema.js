import * as Yup from "yup";

export const vendorValidationSchema = Yup.object({
  name: Yup.string()
    .min(3, "Too Short!")
    .max(50, "Too Long!")
    .required("Vendor name is required"),
  description: Yup.string().max(
    500,
    "Description cannot exceed 255 characters"
  ),
  userId: Yup.string().required("User is required"),
  email: Yup.string().email("Invalid email").required("Email is required"),
  address: Yup.string()
    .max(100, "Address cannot exceed 100 characters")
    .required("Address is required"),
  phoneNumber: Yup.string()
    .matches(/^[0-9]{10}$/, "Phone number must be exactly 10 digits")
    .required("Phone number is required"),
  status: Yup.string().required("Select status"),
});
