import React, { useEffect, useState } from "react";
import { Table } from "flowbite-react";
import humps from "humps";
import { useSearchParams } from "react-router-dom";
import {
  HiCheckCircle,
  HiXCircle,
  HiPencil,
  HiPlus,
  HiTrash,
} from "react-icons/hi";
import DashboardTableSearchForm from "../../components/DashboardTableSearchForm";
import DashboardTableNoDataRow from "../../components/DashboardTableNoDataRow";
import Loading from "../../components/Loading";
import StarRating from "../../components/StarRating";
import DeletePopupModal from "../../components/modals/DeletePopupModal";
import ReviewFormModal from "../../components/modals/ReviewFormModal";
import DashboardButton from "../../components/ui/DashboardButton";
import DashboardMainLayout from "../../components/layouts/DashboardMainLayout";
import { fetchProducts } from "../../services/api/productApi";
import {
  createReview,
  deleteReview,
  fetchReview,
  fetchReviews,
  updateReview,
} from "../../services/api/reviewApi";
import { fetchUsers } from "../../services/api/userApi";
import { formatDate } from "../../utils/formatting";

function ReviewList() {
  const [reviews, setReviews] = useState([]);
  const [review, setReview] = useState(null);
  const [users, setUsers] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // modals
  const [openModal, setOpenModal] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [selectedReview, setSelectedReview] = useState(null);

  // URL Search Parameters
  const [searchParams, setSearchParams] = useSearchParams();
  // review table search
  const [searchQuery, setSearchQuery] = useState(searchParams.get("q") || "");

  const initialValues = {
    productId: review?.product?.id || "",
    userId: review?.user?.id || "",
    rating: review?.rating || "",
    comment: review?.comment || "",
    isActive: review?.isActive ?? true, // Nullish Coalescing Operator
  };

  const getReviews = async () => {
    try {
      const data = await fetchReviews();
      setReviews(data);
    } catch (error) {
      console.error("Error fetching reviews:", error);
    }
  };

  const getUsers = async () => {
    try {
      const data = await fetchUsers();
      setUsers(data);
    } catch (error) {
      console.error("Error loading users:", error);
    }
  };

  const getProducts = async () => {
    try {
      const data = await fetchProducts();
      setProducts(data.results);
    } catch (error) {
      console.error("Error loading products:", error);
    }
  };

  const openReviewAddModal = () => {
    setReview(null);
    setOpenModal(true);
  };

  const openReviewEditModal = async (reviewId) => {
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

  const openReviewDeleteModal = (reviewId) => {
    setSelectedReview(reviewId);
    setOpenDeleteModal(true);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setSearchParams(searchQuery ? { q: searchQuery } : {});
    if (searchQuery.trim()) {
      // fetch reviews filtered by the search query
      getReviews(searchQuery);
    }
  };

  const handleSubmit = async (data, actions) => {
    // convert values to snake_case
    const formData = humps.decamelizeKeys(data);
    try {
      let response;
      if (review) {
        response = await updateReview(review.id, formData);
      } else {
        response = await createReview(formData);
      }
      if (response.status === 200 || response.status === 201) {
        setOpenModal(false);
        actions.resetForm();
        getReviews();
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

  const handleReviewDelete = async (reviewId) => {
    try {
      await deleteReview(reviewId);
      setReviews((c) => c.filter((review) => review.id !== reviewId));
    } catch (error) {
      console.error("Error deleting review:", error);
    }
    setOpenDeleteModal(false);
  };

  const fetchData = async () => {
    setLoading(true);
    await Promise.all([getReviews(searchQuery), getUsers(), getProducts()]);
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <>
      <DashboardMainLayout>
        <section className="bg-gray-50 dark:bg-gray-900 p-3 sm:p-5">
          <div className="mx-auto max-w-screen-full px-4 lg:px-12">
            <div className="bg-white dark:bg-gray-800 relative shadow-md sm:rounded-lg overflow-hidden">
              {loading ? (
                <Loading />
              ) : (
                <>
                  <div className="flex flex-col md:flex-row items-center justify-between space-y-3 md:space-y-0 md:space-x-4 p-4">
                    <div className="w-full md:w-1/2">
                      <DashboardTableSearchForm
                        searchQuery={searchQuery}
                        setSearchQuery={setSearchQuery}
                        handleSearchSubmit={handleSearchSubmit}
                      />
                    </div>
                    <div className="w-full md:w-auto flex flex-col md:flex-row space-y-2 md:space-y-0 items-stretch md:items-center justify-end md:space-x-3 flex-shrink-0">
                      <DashboardButton
                        icon={HiPlus}
                        label="Add review"
                        onClick={openReviewAddModal}
                        data-modal-target="review-modal"
                        data-modal-toggle="review-modal"
                      />
                    </div>
                  </div>
                  <div className="overflow-x-auto">
                    <Table>
                      <Table.Head>
                        <Table.HeadCell>Product</Table.HeadCell>
                        <Table.HeadCell>User</Table.HeadCell>
                        <Table.HeadCell>Rating</Table.HeadCell>
                        <Table.HeadCell>Comment</Table.HeadCell>
                        <Table.HeadCell>Is active</Table.HeadCell>
                        <Table.HeadCell>Created at</Table.HeadCell>
                        <Table.HeadCell>Updated at</Table.HeadCell>
                        <Table.HeadCell>
                          <span className="sr-only">Actions</span>
                        </Table.HeadCell>
                      </Table.Head>
                      <Table.Body className="divide-y">
                        {reviews.length > 0 ? (
                          reviews.map((review) => (
                            <Table.Row
                              key={review.id}
                              className="bg-white dark:border-gray-700 dark:bg-gray-800"
                            >
                              <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                                {review.product.name}
                              </Table.Cell>
                              <Table.Cell>
                                {review.user.firstName} {review.user.lastName}
                              </Table.Cell>
                              <Table.Cell>
                                <StarRating ratingValue={review.rating} />
                              </Table.Cell>
                              <Table.Cell>{review.comment}</Table.Cell>
                              <Table.Cell>
                                {review.isActive ? (
                                  <HiCheckCircle className="text-green-600 w-5 h-5" />
                                ) : (
                                  <HiXCircle className="text-red-600 w-5 h-5" />
                                )}
                              </Table.Cell>
                              <Table.Cell>
                                {formatDate(review.createdAt)}
                              </Table.Cell>
                              <Table.Cell>
                                {formatDate(review.updatedAt)}
                              </Table.Cell>
                              <Table.Cell className="px-4 py-3 flex gap-2 items-center justify-end">
                                <DashboardButton
                                  icon={HiPencil}
                                  onClick={() => {
                                    openReviewEditModal(review.id);
                                  }}
                                  data-modal-target="review-modal"
                                  data-modal-toggle="review-modal"
                                />
                                <DashboardButton
                                  icon={HiTrash}
                                  color="red"
                                  onClick={() => {
                                    openReviewDeleteModal(review.id);
                                  }}
                                  data-modal-target="delete-review-modal"
                                  data-modal-toggle="delete-review-modal"
                                />
                              </Table.Cell>
                            </Table.Row>
                          ))
                        ) : reviews.length === 0 && searchQuery ? (
                          <DashboardTableNoDataRow
                            columns={8}
                            message="No results found"
                            message2="Try different keywords or remove search filters"
                          />
                        ) : (
                          <DashboardTableNoDataRow
                            columns={8}
                            message="No reviews available."
                          />
                        )}
                      </Table.Body>
                    </Table>
                  </div>
                </>
              )}
            </div>
          </div>
        </section>
      </DashboardMainLayout>

      {/* review modal */}
      <ReviewFormModal
        openModal={openModal}
        initialData={initialValues}
        setOpenModal={setOpenModal}
        onSubmit={handleSubmit}
        products={products}
        users={users}
        modalID="review-modal"
        isEditMode={!!review}
      />

      {/* review delete modal */}
      <DeletePopupModal
        openModal={openDeleteModal}
        setOpenModal={setOpenDeleteModal}
        onConfirm={() => handleReviewDelete(selectedReview)}
        confirmationText="Are you sure you want to delete this review?"
        modalID="delete-review-modal"
      />
    </>
  );
}

export default ReviewList;
