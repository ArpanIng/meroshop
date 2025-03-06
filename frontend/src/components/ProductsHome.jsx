import React, { useEffect, useState } from "react";
import { fetchProducts } from "../services/api/productApi";
import ProductCard from "./ProductCard";

function ProductsHome() {
  const [newArrivals, setNewArrivals] = useState([]);
  const [loading, setLoading] = useState(true);

  const getNewArrivalsProducts = async () => {
    try {
      const data = await fetchProducts();
      setNewArrivals(data.results);
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  console.log(newArrivals);

  useEffect(() => {
    getNewArrivalsProducts();
  }, []);

  return (
    <section className="bg-gray-50 py-8 antialiased dark:bg-gray-900 md:py-12">
      <div className="mx-auto max-w-screen-xl px-4 2xl:px-0">
        <div className="mb-4 items-end justify-between space-y-4 sm:flex sm:space-y-0 md:mb-8">
          <div>
            <h2 className="mt-3 text-xl font-semibold text-gray-900 dark:text-white sm:text-2xl">
              New arrivals
            </h2>
          </div>
        </div>
        <div className="mb-4 grid gap-4 sm:grid-cols-2 md:mb-8 lg:grid-cols-3 xl:grid-cols-4">
          {newArrivals.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
        <div className="w-full text-center">
          <button
            type="button"
            className="rounded-lg border border-gray-200 bg-white px-5 py-2.5 text-sm font-medium text-gray-900 hover:bg-gray-100 hover:text-primary-700 focus:z-10 focus:outline-none focus:ring-4 focus:ring-gray-100 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white dark:focus:ring-gray-700"
          >
            Show more
          </button>
        </div>
      </div>
    </section>
  );
}

export default ProductsHome;
