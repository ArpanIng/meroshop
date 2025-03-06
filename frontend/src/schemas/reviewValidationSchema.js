import * as Yup from "yup";

export const userReviewValidationSchema = Yup.object({
  rating: Yup.number()
    .min(1, "Rating must be at least 1")
    .max(5, "Rating cannot exceed 5")
    .required("Rating is required"),
  comment: Yup.string()
    .min(10, "Comment must be at least 10 characters")
    .required("Comment is required"),
});

export const adminReviewValidationSchema = Yup.object({
  productId: Yup.string().required("Product ID is required"),
  userId: Yup.string().required("User ID is required"),
  rating: Yup.number()
    .min(1, "Rating must be at least 1")
    .max(5, "Rating cannot exceed 5")
    .required("Rating is required"),
  comment: Yup.string()
    .min(10, "Comment must be at least 10 characters")
    .required("Comment is required"),
});
