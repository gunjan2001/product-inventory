import React, { useState } from "react";
import { deleteProduct } from "../service/api";

interface Category {
  _id: string;
  name: string;
}

interface Product {
  _id: string;
  name: string;
  description?: string;
  quantity: number;
  categories: Category[];
  createdAt: string;
}

interface ProductListProps {
  products: Product[];
  loading: boolean;
  onProductDeleted: () => void;
}

const ProductList: React.FC<ProductListProps> = ({
  products,
  loading,
  onProductDeleted,
}) => {
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    const options: Intl.DateTimeFormatOptions = {
      day: "numeric",
      month: "short",
      year: "numeric",
    };
    return date.toLocaleDateString("en-US", options);
  };

  const handleDeleteClick = (productId: string) => {
    setDeleteConfirmId(productId);
  };

  const handleCancelDelete = () => {
    setDeleteConfirmId(null);
  };

  const handleConfirmDelete = async (productId: string) => {
    setDeletingId(productId);
    try {
      await deleteProduct(productId);
      setDeleteConfirmId(null);
      onProductDeleted();
    } catch (err) {
      console.error("Error deleting product:", err);
      alert("Failed to delete product. Please try again.");
    } finally {
      setDeletingId(null);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center w-full py-12">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-4 border-gray-300 border-t-blue-600 rounded-full animate-spin"></div>
          <p className="text-gray-600 text-sm">Loading products...</p>
        </div>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="flex justify-center items-center w-full py-12">
        <p className="text-gray-600 text-center">
          No products found. Try adjusting your filters or add a new product.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
      {products.map((product, idx) => (
        <div
          key={`${product._id}_${idx + 1}`}
          className="relative bg-white border border-gray-200 rounded-lg p-5 hover:shadow-md transition-all"
        >
          {/* Delete Confirmation Modal */}
          {deleteConfirmId === product._id && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
              <div className="bg-white border border-gray-200 rounded-lg p-6 max-w-sm mx-4 shadow-lg">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Confirm Delete
                </h3>
                <p className="text-gray-700 mb-4 text-sm">
                  Are you sure you want to delete "{product.name}"?
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleConfirmDelete(product._id)}
                    disabled={deletingId === product._id}
                    className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-colors text-sm disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
                  >
                    {deletingId === product._id ? "Deleting..." : "Delete"}
                  </button>
                  <button
                    onClick={handleCancelDelete}
                    disabled={deletingId === product._id}
                    className="flex-1 px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-900 font-medium rounded-lg transition-colors text-sm disabled:opacity-60 disabled:cursor-not-allowed
                    cursor-pointer"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Product Card Content */}
          <div className="flex justify-between items-start gap-3 mb-3">
            <h3 className="text-base font-semibold text-gray-900 flex-1 break-words line-clamp-2">
              {product.name}
            </h3>
            <button
              onClick={() => handleDeleteClick(product._id)}
              title="Delete product"
              disabled={deletingId === product._id}
              className="text-lg hover:text-red-600 transition-colors disabled:opacity-60 flex-shrink-0 cursor-pointer"
            >
              <img
                src="/delete-svgrepo-com.svg"
                alt="Delete"
                className="w-5 h-5"
              />
            </button>
          </div>

          {product.description && (
            <p className="text-gray-600 text-xs mb-3 line-clamp-2">
              {product.description}
            </p>
          )}

          <div className="mb-3 pb-3 border-b border-gray-200">
            <p className="text-gray-700 text-sm">
              <strong>Qty:</strong>{" "}
              <span className="text-blue-600 font-semibold">
                {product.quantity}
              </span>
            </p>
          </div>

          {/* Categories as Tags */}
          {product.categories && product.categories.length > 0 && (
            <div className="mb-3">
              <div className="flex flex-wrap gap-2">
                {product.categories.map((category) => (
                  <span
                    key={`${category.name}_${product._id}`}
                    className="inline-block px-2 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-full"
                  >
                    {category.name}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Product Added Date */}
          <div className="pt-3 border-t border-gray-200">
            <p className="text-xs text-gray-500">
              Added: {formatDate(product.createdAt)}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProductList;
