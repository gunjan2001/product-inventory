import { Link } from 'react-router-dom';

function Header() {
  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
      <div className="w-full px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 text-gray-900 hover:text-blue-600 transition-colors">
          <span className="text-2xl">📦</span>
          <span className="font-bold text-lg">Product Inventory</span>
        </Link>

        {/* Add Product Button */}
        <Link 
          to="/add-product" 
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors whitespace-nowrap text-sm sm:text-base flex items-center"
        >
          <img
            src="/plus-large-svgrepo-com.svg"
            alt="Add Product"
            className="w-5 h-5 mr-2 brightness-0 invert"
          />
          Add Product
        </Link>
      </div>
    </header>
  );
}

export default Header;