import React, { useState, useEffect } from 'react';
import { fetchCategories, createProduct } from '../service/api';

interface Category {
  _id: string;
  name: string;
}

interface ProductFormProps {
  onProductAdded: () => void;
  onCancel?: () => void;
}

const ProductForm: React.FC<ProductFormProps> = ({ onProductAdded, onCancel }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [quantity, setQuantity] = useState<number | ''>('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  // Fetch categories on component mount
  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      const data = await fetchCategories();
      setCategories(data);
    } catch (err) {
      console.error('Error loading categories:', err);
    }
  };

  // Client-side validation
  const validateForm = (): boolean => {
    const newErrors: { [key: string]: string } = {};

    if (!name.trim()) {
      newErrors.name = 'Product name is required';
    } else if (name.length > 100) {
      newErrors.name = 'Product name must be less than 100 characters';
    }

    if (quantity === '' || quantity === null || quantity === undefined) {
      newErrors.quantity = 'Quantity is required';
    } else if (quantity < 0) {
      newErrors.quantity = 'Quantity cannot be negative';
    } else if (!Number.isInteger(Number(quantity))) {
      newErrors.quantity = 'Quantity must be a whole number';
    }

    if (selectedCategories.length === 0) {
      newErrors.categories = 'At least one category is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Validate form
    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const productData = {
        name: name.trim(),
        description: description.trim(),
        quantity: Number(quantity),
        categories: selectedCategories,
      };

      await createProduct(productData);
      setSuccess('Product added successfully!');
      
      // Reset form
      setName('');
      setDescription('');
      setQuantity('');
      setSelectedCategories([]);
      setErrors({});
      
      // Notify parent component
      onProductAdded();

      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(''), 3000);
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to add product';
      const validationErrors = err.response?.data?.errors;
      
      if (validationErrors && Array.isArray(validationErrors)) {
        setError(validationErrors.join(', '));
      } else {
        setError(errorMessage);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryToggle = (categoryId: string) => {
    setSelectedCategories(prev =>
      prev.includes(categoryId)
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  return (
    <div>
      {error && (
        <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
          {error}
        </div>
      )}
      
      {success && (
        <div className="mb-4 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-sm">
          {success}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Product Name */}
        <div>
          <label htmlFor="name" className="block text-gray-700 font-medium mb-1.5 text-sm">
            Product Name <span className="text-red-600">*</span>
          </label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter product name"
            disabled={loading}
            className={`w-full px-4 py-2.5 border rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all text-sm ${
              errors.name ? 'border-red-300' : 'border-gray-300'
            }`}
          />
          {errors.name && <span className="text-red-600 text-xs mt-1 block">{errors.name}</span>}
        </div>

        {/* Description */}
        <div>
          <label htmlFor="description" className="block text-gray-700 font-medium mb-1.5 text-sm">
            Description
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Enter product description (optional)"
            rows={3}
            disabled={loading}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all text-sm"
          />
        </div>

        {/* Quantity */}
        <div>
          <label htmlFor="quantity" className="block text-gray-700 font-medium mb-1.5 text-sm">
            Quantity <span className="text-red-600">*</span>
          </label>
          <input
            type="number"
            id="quantity"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value === '' ? '' : Number(e.target.value))}
            placeholder="Enter quantity"
            min="0"
            step="1"
            disabled={loading}
            className={`w-full px-4 py-2.5 border rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all text-sm ${
              errors.quantity ? 'border-red-300' : 'border-gray-300'
            }`}
          />
          {errors.quantity && <span className="text-red-600 text-xs mt-1 block">{errors.quantity}</span>}
        </div>

        {/* Categories */}
        <div>
          <label className="block text-gray-700 font-medium mb-2 text-sm">Categories <span className="text-red-600">*</span></label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {categories.length === 0 ? (
              <p className="text-gray-500 text-center col-span-full py-3 text-sm">No categories available</p>
            ) : (
              categories.map(category => (
                <label key={category._id} className="flex items-center gap-3 p-2.5 bg-gray-50 border border-gray-200 rounded-lg hover:bg-gray-100 cursor-pointer transition-all">
                  <input
                    type="checkbox"
                    checked={selectedCategories.includes(category._id)}
                    onChange={() => handleCategoryToggle(category._id)}
                    disabled={loading}
                    className="cursor-pointer"
                  />
                  <span className="text-gray-700 text-sm">{category.name}</span>
                </label>
              ))
            )}
          </div>
          {errors.categories && <span className="text-red-600 text-xs mt-1 block">{errors.categories}</span>}
        </div>

        {/* Submit & Cancel Buttons */}
        <div className="flex gap-3 pt-2">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors text-sm disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? 'Adding...' : 'Add Product'}
          </button>
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              disabled={loading}
              className="flex-1 px-4 py-2.5 bg-gray-200 hover:bg-gray-300 text-gray-900 font-medium rounded-lg transition-colors text-sm disabled:opacity-60 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default ProductForm;
