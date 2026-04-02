import { useState, useEffect } from "react";
import SearchFilter from "../components/SearchFilter";
import ProductList from "../components/ProductList";
import Pagination from "../components/Pagination";
import { fetchProducts } from "../service/api";

interface Product {
  _id: string;
  name: string;
  description?: string;
  quantity: number;
  categories: { _id: string; name: string }[];
  createdAt: string;
}

function HomePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [totalProducts, setTotalProducts] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Fetch products whenever filters or page changes
  useEffect(() => {
    loadProducts();
  }, [currentPage, searchQuery, selectedCategories]);

  const loadProducts = async () => {
    setLoading(true);
    setError("");

    try {
      const data = await fetchProducts(
        currentPage,
        searchQuery,
        selectedCategories,
      );
      setProducts(data.products);
      setTotalPages(data.pages);
      setTotalProducts(data.total);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message || err.message || "Failed to load products";
      setError(errorMessage);
      console.error("Error loading products:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (search: string, categories: string[]) => {
    setSearchQuery(search);
    setSelectedCategories(categories);
    setCurrentPage(1); // Reset to first page when filters change
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // Scroll to top when changing pages
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleProductDeleted = () => {
    // Reload products after deletion
    loadProducts();
  };

  return (
    <div className="w-full space-y-6">
      {/* Title Section */}
      <div>
        <h1 className="text-4xl font-bold text-gray-900 mb-2">📦 Products</h1>
        <p className="text-gray-600">Browse and manage all your products</p>
      </div>

      {/* Search and Filter Controls */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 sm:p-5">
        <SearchFilter onFilterChange={handleFilterChange} />
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 sm:px-6 py-4 rounded-lg text-sm">
          {error}
        </div>
      )}

      {/* Products Count */}
      {!loading && !error && (
        <div className="text-gray-700 text-sm">
          {totalProducts !== 0 && (
            <p>
              Showing {products.length} of {totalProducts} product
              {totalProducts !== 1 ? "s" : ""}
            </p>
          )}
        </div>
      )}

      {/* Product List */}
      <section>
        <ProductList
          products={products}
          loading={loading}
          onProductDeleted={handleProductDeleted}
        />
      </section>

      {/* Pagination */}
      {!loading && totalPages > 1 && (
        <section>
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </section>
      )}
    </div>
  );
}

export default HomePage;
