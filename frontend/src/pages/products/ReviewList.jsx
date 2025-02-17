import React, { useEffect, useState } from "react";
import humps from "humps";
import { Table, Button } from "flowbite-react";
import { Link, useSearchParams } from "react-router-dom";
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
import PopupModal from "../../components/modals/PopupModal";
import ReviewModal from "../../components/modals/ReviewModal";
import DashboardMainLayout from "../../layouts/DashboardMainLayout";
import { fetchProducts } from "../../services/api/productApi";
import { createReview, fetchReviews } from "../../services/api/reviewApi";
import { fetchUsers } from "../../services/api/userApi";
import { formatDate } from "../../utils/formatting";

function ReviewList() {
  const [reviews, setReviews] = useState([]);
  const [users, setUsers] = useState([]);
  const [products, setProducts] = useState([]);
  const [laoding, setLoading] = useState(true);

  // modals
  const [openModal, setOpenModal] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [selectedReview, setSelectedReview] = useState(null);

  // URL Search Parameters
  const [searchParams, setSearchParams] = useSearchParams();
  // review table search
  const [searchQuery, setSearchQuery] = useState(searchParams.get("q") || "");

  const initialValues = {
    productId: "",
    userId: "",
    rating: "",
    comment: "",
    isActive: "",
  };

  const getReviews = async () => {
    try {
      const data = await fetchReviews();
      setReviews(data);
    } catch (error) {
      console.error("Error loading reviews data:", error);
    } finally {
      setLoading(false);
    }
  };

  const getUsers = async () => {
    try {
      const data = await fetchUsers();
      setUsers(data);
    } catch (error) {
      console.error("Error loading users:", error);
    } finally {
      setLoading(false);
    }
  };

  const getProducts = async () => {
    try {
      const data = await fetchProducts();
      setProducts(data.results);
    } catch (error) {
      console.error("Error loading products:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setSearchParams(searchQuery ? { q: searchQuery } : {});
    if (searchQuery.trim()) {
      // fetch reviews based on user submitted query
      getReviews();
    }
  };

  const openReviewDeleteModal = (reviewId) => {
    setSelectedReview(reviewId);
    setOpenDeleteModal(true);
  };

  const handleReviewDelete = (reviewId) => {
    try {
    } catch (error) {
      console.error("Error deleting review:", error);
    }
  };

  const handleSubmit = async (data) => {
    // convert values to snake_case
    const formData = humps.decamelizeKeys(data);
    try {
      await createReview(formData);
      getReviews();
    } catch (error) {
      console.error("Error ");
    }
  };

  useEffect(() => {
    getReviews();
    getUsers();
    getProducts();
  }, []);

  return (
    <>
      <DashboardMainLayout>
        <section className="bg-gray-50 dark:bg-gray-900 p-3 sm:p-5">
          <div className="mx-auto max-w-screen-full px-4 lg:px-12">
            <div className="bg-white dark:bg-gray-800 relative shadow-md sm:rounded-lg overflow-hidden">
              {laoding ? (
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
                      <Button
                        color="blue"
                        data-modal-target="review-modal"
                        data-modal-toggle="review-modal"
                        onClick={() => setOpenModal(true)}
                      >
                        <HiPlus className="h-5 w-5 mr-2" />
                        Add review
                      </Button>
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
                                {review.product}
                              </Table.Cell>
                              <Table.Cell>{review.user}</Table.Cell>
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
                                <Link
                                  to={`/admin/reviews/${review.slug}/edit`}
                                  type="button"
                                  className="flex items-center justify-center text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
                                >
                                  <HiPencil className="h-4 w-4 mr-2" />
                                  Edit
                                </Link>
                                <button
                                  type="button"
                                  className="flex items-center justify-center focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900"
                                  data-modal-target="delete-review-modal"
                                  data-modal-toggle="delete-review-modal"
                                  onClick={() =>
                                    openReviewDeleteModal(review.id)
                                  }
                                >
                                  <HiTrash className="h-4 w-4 mr-2" />
                                  Delete
                                </button>
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
      <ReviewModal
        openModal={openModal}
        initialData={initialValues}
        setOpenModal={setOpenModal}
        onSubmit={handleSubmit}
        products={products}
        users={users}
        modalID="review-modal"
      />

      {/* review delete modal */}
      <PopupModal
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
