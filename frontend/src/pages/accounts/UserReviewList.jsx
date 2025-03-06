import React, { useEffect, useState } from "react";
import { Button } from "flowbite-react";
import humps from "humps";
import { HiCalendar, HiTrash, HiPencilAlt } from "react-icons/hi";
import { Link, useSearchParams } from "react-router-dom";
import StarRating from "../../components/StarRating";
import DeletePopupModal from "../../components/modals/DeletePopupModal";
import UserReviewFormModal from "../../components/modals/UserReviewFormModal";
import { useAuth } from "../../contexts/AuthContext";
import {
  deleteReview,
  fetchReview,
  updateReview,
} from "../../services/api/reviewApi";
import { fetchUserReviews } from "../../services/api/userApi";
import { formatDateOnly } from "../../utils/formatting";

function UserReviewList() {
  const [userReviews, setUserReviews] = useState([]);
  const [review, setReview] = useState(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  // modals
  const [openModal, setOpenModal] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [selectedReview, setSelectedReview] = useState(null);

  // URL Search Parameters
  const [searchParams, setSearchParams] = useSearchParams();
  // filters
  const ratingFilterParam = searchParams.get("rating");
  const [rating, setRating] = useState(ratingFilterParam || "");

  // load more pagination
  const USER_REVIEWS_LIMIT = 2; // no. of data per request
  const [offset, setOffset] = useState(0); // 0 for first page
  const [next, setNext] = useState(null);

  const initialValues = {
    productId: review?.product?.id || "",
    userId: user?.id || "",
    rating: review?.rating || "",
    comment: review?.comment || "",
  };

  const getUserReviews = async () => {
    const data = await fetchUserReviews(rating, USER_REVIEWS_LIMIT, offset);
    setUserReviews(data.results);
    setNext(data.next);
    try {
    } catch (error) {
      console.error("Error loading user reviews:", error);
    } finally {
      setLoading(false);
    }
  };

  const openUserReviewEditModal = async (reviewId) => {
    setLoading(true);
    try {
      const data = await fetchReview(reviewId);
      setReview(data);
      setOpenModal(true);
    } catch (error) {
      console.error("Error fetching review:", error);
    } finally {
      setLoading(false);
    }
  };

  const openUserReviewDeleteModal = (reviewId) => {
    setSelectedReview(reviewId);
    setOpenDeleteModal(true);
  };

  const handleRatingChange = (e) => {
    let ratingValue = e.target.value;
    // Converts to integer or sets to null if empty
    ratingValue = ratingValue ? parseInt(ratingValue, 10) : null;
    setRating(ratingValue);
    setSearchParams({ rating: ratingValue });
  };

  const handleSubmit = async (data, actions) => {
    // convert values to snake_case
    const formData = humps.decamelizeKeys(data);
    try {
      let response;
      if (review) {
        response = await updateReview(review.id, formData);
      }
      if (response.status === 200) {
        setOpenModal(false);
        actions.resetForm();
        getUserReviews();
      }
    } catch (error) {
      console.error("Error submiting review data:", error);
      if (error.response && error.response.data) {
        const errorData = error.response.data;
        // map backend errors to formik
        const errors = {};
        Object.keys(errorData).forEach((field) => {
          // handle non-field errors
          if (field === "non_field_errors") {
            errors.nonFieldErrors = errorData[field].join("");
          } else {
            // handle field errors
            // convert error field to camelCase to match formik initialValues
            const camelCaseField = humps.camelize(field);
            errors[camelCaseField] = errorData[field].join("");
          }
        });
        actions.setErrors(errors); // Set backend errors in Formik
      } else {
        console.error("An error occured. Please try again.");
      }
    } finally {
      actions.setSubmitting(false);
    }
  };

  const handleUserReviewDelete = async (reviewId) => {
    try {
      await deleteReview(reviewId);
      setUserReviews((prev) => prev.filter((review) => review.id !== reviewId));
    } catch (error) {
      console.error("Error deleting review:", error);
    }
    setOpenDeleteModal(false);
  };

  useEffect(() => {
    getUserReviews();
  }, [rating, offset]);

  return (
    <>
      <section className="bg-white py-8 antialiased dark:bg-gray-900 md:py-16">
        <div className="mx-auto max-w-screen-xl px-4 2xl:px-0">
          <div className="mx-auto max-w-5xl">
            <div className="gap-4 sm:flex sm:items-center sm:justify-between">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white sm:text-2xl">
                My reviews
              </h2>
              <div className="mt-6 sm:mt-0">
                <label
                  htmlFor="rating-filter"
                  className="sr-only mb-2 block text-sm font-medium text-gray-900 dark:text-white"
                >
                  Select rating
                </label>
                <select
                  id="rating-filter"
                  className="block w-full min-w-[8rem] rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder:text-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
                  value={rating}
                  onChange={handleRatingChange}
                >
                  <option value="">All stsars</option>
                  <option value="5">5 stars</option>
                  <option value="4">4 stars</option>
                  <option value="3">3 stars</option>
                  <option value="2">2 stars</option>
                  <option value="1">1 star</option>
                </select>
              </div>
            </div>

            {userReviews.length > 0 ? (
              <>
                {userReviews.map((review) => (
                  <div
                    key={review.id}
                    className="max-w-full mt-6 p-6 bg-white border border-gray-200 rounded-lg shadow-sm dark:bg-gray-800 dark:border-gray-700"
                  >
                    <div className="flex flex-col sm:flex-row items-start justify-between">
                      <div className="mb-4">
                        <span className="bg-gray-100 text-gray-800 text-xs font-medium inline-flex items-center px-2.5 py-0.5 rounded-sm dark:bg-gray-700 dark:text-gray-300">
                          <HiCalendar className="me-2" />{" "}
                          {formatDateOnly(review.createdAt)}
                        </span>
                        <Link
                          href="#"
                          className="block mt-2 text-base font-semibold text-gray-900 dark:text-white hover:underline"
                        >
                          {review.product.name}
                        </Link>
                      </div>
                      <div>
                        <StarRating ratingValue={review.rating} />
                      </div>
                    </div>
                    <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">
                      {review.comment}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      <Button
                        color="blue"
                        size="sm"
                        data-modal-target="user-review-modal"
                        data-modal-toggle="user-review-modal"
                        onClick={() => openUserReviewEditModal(review.id)}
                      >
                        <HiPencilAlt className="h-5 w-5 me-2" />
                        Edit review
                      </Button>
                      <Button
                        color="failure"
                        size="sm"
                        data-modal-target="delete-user-review-modal"
                        data-modal-toggle="delete-user-review-modal"
                        onClick={() => openUserReviewDeleteModal(review.id)}
                      >
                        <HiTrash className="h-5 w-5 me-2" />
                        Delete review
                      </Button>
                    </div>
                  </div>
                ))}
              </>
            ) : (
              <div className="text-center py-10">
                <p>No revivews found.</p>
              </div>
            )}

            {/* load more scrolling */}
            {next && (
              <div className="w-full text-center my-4">
                <button
                  type="button"
                  className="rounded-lg border border-gray-200 bg-white px-5 py-2.5 text-sm font-medium text-gray-900 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:outline-none focus:ring-4 focus:ring-gray-100 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white dark:focus:ring-gray-700"
                  onClick={() => setOffset(offset + USER_REVIEWS_LIMIT)}
                >
                  Show more
                </button>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* user review edit modal */}
      <UserReviewFormModal
        openModal={openModal}
        setOpenModal={setOpenModal}
        initialData={initialValues}
        onSubmit={handleSubmit}
        modalID="user-review-modal"
        isEditMode={!!review}
      />

      {/* user review delete modal */}
      <DeletePopupModal
        openModal={openDeleteModal}
        setOpenModal={setOpenDeleteModal}
        onConfirm={() => handleUserReviewDelete(selectedReview)}
        confirmationText="Are you sure you want to delete the selected review?"
        modalID="delete-user-review-modal"
      />
    </>
  );
}

export default UserReviewList;
