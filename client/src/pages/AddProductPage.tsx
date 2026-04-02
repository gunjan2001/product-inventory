import { useNavigate } from 'react-router-dom';
import ProductForm from '../components/ProductForm';

function AddProductPage() {
  const navigate = useNavigate();

  const handleProductAdded = () => {
    // Redirect to home page after product is added
    navigate('/');
  };

  const handleCancel = () => {
    // Go back to home page
    navigate('/');
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="mb-6">
        <h1 className="text-4xl font-bold text-gray-900 mb-2 flex items-center gap-2">
          <img
            src="/plus-large-svgrepo-com.svg"
            alt="Add Product"
            className="w-8 h-8 mr-2"
          />
          Add New Product
        </h1>
        <p className="text-gray-600">
          Fill in the details to add a new product
        </p>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg p-5 sm:p-6 shadow-sm">
        <ProductForm
          onProductAdded={handleProductAdded}
          onCancel={handleCancel}
        />
      </div>
    </div>
  );
}

export default AddProductPage;
