import React, { useEffect, useState } from "react";
import { Button } from "flowbite-react";
import { HiCalendar, HiTrash, HiPencilAlt } from "react-icons/hi";
import { Link, useSearchParams } from "react-router-dom";
import StarRating from "../../components/StarRating";
import DeletePopupModal from "../../components/modals/DeletePopupModal";
import { fetchUserReviews } from "../../services/api/userApi";
import { formatDateOnly } from "../../utils/formatting";

function UserReviewList() {
  const [userReviews, setUserReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  // modals
  const [openModal, setOpenModal] = useState(false);
  // URL Search Parameters
  const [searchParams, setSearchParams] = useSearchParams();
  // filters
  const ratingFilterParam = searchParams.get("rating");
  const [rating, setRating] = useState(ratingFilterParam || "");

  const getUserReviews = async () => {
    const data = await fetchUserReviews(rating);
    setUserReviews(data);
    try {
    } catch (error) {
      console.error("Error loading user reviews:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleRatingChange = (e) => {
    const ratingValue = e.target.value;
    setRating(ratingValue);
    setSearchParams(ratingValue ? { rating: ratingValue } : {});
  };

  useEffect(() => {
    getUserReviews();
  }, [rating]);

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
                  className="block w-full min-w-[8rem] rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-primary-500 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder:text-gray-400 dark:focus:border-primary-500 dark:focus:ring-primary-500"
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
                          {review.product}
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
                      <Button color="blue" size="sm">
                        <HiPencilAlt className="h-5 w-5 me-2" />
                        Edit review
                      </Button>
                      <Button
                        color="failure"
                        size="sm"
                        data-modal-target="delete-review-modal"
                        data-modal-toggle="delete-review-modal"
                        onClick={() => setOpenModal(true)}
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

            {/* pagination */}
          </div>
        </div>
      </section>

      {/* review delete modal */}
      <DeletePopupModal
        openModal={openModal}
        setOpenModal={setOpenModal}
        confirmationText="Are you sure you want to delete this review?"
        modalID="delete-review-modal"
      />
    </>
  );
}

export default UserReviewList;
