import React, { useEffect, useState } from "react";
import { Button, Rating } from "flowbite-react";
import { useParams } from "react-router-dom";
import { HiOutlineHeart, HiOutlineShoppingCart } from "react-icons/hi";
import Loading from "../../components/Loading";
import { fetchProduct } from "../../services/api/productApi";
import { useCart } from "../../contexts/CartContext";

function ProductDetail() {
  const [product, setProduct] = useState({});
  const [loading, setLoading] = useState(true);
  let { productSlug } = useParams();
  const { handleAddToCart } = useCart();

  const getProduct = async () => {
    try {
      const data = await fetchProduct(productSlug);
      setProduct(data);
    } catch (error) {
      console.error("Error loading product:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getProduct();
  }, [productSlug]);

  if (loading) {
    return <Loading />;
  }

  return (
    <section className="py-8 bg-white md:py-16 dark:bg-gray-900 antialiased">
      <div className="max-w-screen-xl px-4 mx-auto 2xl:px-0">
        <div className="lg:grid lg:grid-cols-2 lg:gap-8 xl:gap-16">
          <div className="shrink-0 max-w-md lg:max-w-lg mx-auto">
            <img
              className="w-full dark:hidden"
              src={`${product.image}`}
              alt={`${product.name} Image`}
            />
          </div>

          <div className="mt-6 sm:mt-8 lg:mt-0">
            <h1 className="text-xl font-semibold text-gray-900 sm:text-2xl dark:text-white">
              {product.name}
            </h1>
            <div className="mt-4 sm:items-center sm:gap-4 sm:flex">
              {product.has_discount ? (
                <>
                  <p className="text-2xl font-extrabold text-gray-900 sm:text-3xl dark:text-white">
                    Rs. {product.discount_price}
                  </p>
                  <p className="text-2xl font-thin text-gray-600 line-through sm:text-3xl dark:text-white">
                    Rs. {product.price}
                  </p>
                  <span className="text-sm">
                    -{product.discount_percentage}%
                  </span>
                </>
              ) : (
                <p className="text-2xl font-extrabold text-gray-900 sm:text-3xl dark:text-white">
                  Rs. {product.price}
                </p>
              )}

              <div className="flex items-center gap-2 mt-2 sm:mt-0">
                <Rating>
                  <Rating.Star className="text-yellow-300" />
                  <Rating.Star className="text-yellow-300" />
                  <Rating.Star className="text-yellow-300" />
                  <Rating.Star className="text-yellow-300" />
                  <Rating.Star className="text-yellow-300" />
                  <p className="ml-2 text-sm font-bold text-gray-900 dark:text-white">
                    4.95
                  </p>
                  <span className="mx-1.5 h-1 w-1 rounded-full bg-gray-500 dark:bg-gray-400" />
                  <a
                    href="#"
                    className="text-sm font-medium text-gray-900 underline hover:no-underline dark:text-white"
                  >
                    73 reviews
                  </a>
                </Rating>
              </div>
            </div>

            <div className="mt-6 sm:gap-4 sm:items-center sm:flex sm:mt-8">
              <Button type="button" color="light" className="w-full sm:w-auto">
                <HiOutlineHeart className="w-5 h-5 -ms-2 me-2" />
                Add to favorites
              </Button>

              {product.status === "Out of Stock" ? (
                <Button
                  type="button"
                  color="failure"
                  className="mt-4 sm:mt-0 w-full sm:w-auto"
                  disabled
                >
                  Out of stock
                </Button>
              ) : (
                <Button
                  type="button"
                  color="blue"
                  className="mt-4 sm:mt-0 w-full sm:w-auto"
                  onClick={() => handleAddToCart(product.id)}
                >
                  <HiOutlineShoppingCart className="w-5 h-5 -ms-2 me-2" />
                  Add to cart
                </Button>
              )}
            </div>

            <hr className="my-6 md:my-8 border-gray-200 dark:border-gray-800" />

            <p className="mb-6 text-gray-500 dark:text-gray-400">
              {product.description}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default ProductDetail;
