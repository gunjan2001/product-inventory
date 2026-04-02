import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import HomePage from './pages/HomePage';
import AddProductPage from './pages/AddProductPage';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-white flex flex-col">
        <Header />
        <main className="flex-1 w-full px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          <div className="max-w-6xl mx-auto w-full">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/add-product" element={<AddProductPage />} />
            </Routes>
          </div>
        </main>
        <footer className="bg-gray-100 border-t border-gray-200 py-4 px-4 text-center text-gray-600 text-sm mt-auto">
          <p>© 2026 Product Inventory System</p>
        </footer>
      </div>
    </Router>
  );
}

export default App;
