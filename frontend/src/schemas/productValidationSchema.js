import * as Yup from "yup";

export const productValidationSchema = Yup.object({
  name: Yup.string()
    .min(3, "Name must be at least 3 characters")
    .max(50, "Name cannot exceed 50 characters")
    .required("Product name is required"),
  description: Yup.string()
    .min(10, "Description must be at least 10 characters")
    .max(500, "Description cannot exceed 500 characters")
    .required("Description is required"),
  price: Yup.number()
    .min(10, "Price must be greater than or equal to 10.0.")
    .required("Price is required"),
  discountPrice: Yup.number()
    .min(10, "Discount price must be greater than or equal to 10.0.")
    .max(
      Yup.ref("price"),
      "Discount price cannot be greater than or equal to the original price."
    ),
  stock: Yup.number()
    .min(0, "Stock must be greater than or equal to 0.")
    .required("Stock is required"),
  // image: Yup.string().url("Invalid image URL"),
  // image: Yup.string()
  //   .url("Invalid image URL")
  //   .when("image", {
  //     is: (value) => value && value !== "", // Only validate if the value is not empty
  //     then: Yup.string().required("An image URL is required"),
  //   }),
  status: Yup.string().required("Status is required"),
  category: Yup.string().required("Category is required"),
  vendor: Yup.string().required("Vendor is required"),
});
