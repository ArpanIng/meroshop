import * as Yup from "yup";

export const categoryValidationSchema = Yup.object({
  name: Yup.string()
    .min(3, "Too Short!")
    .max(30, "Too Long!")
    .required("Category name is required"),
});
