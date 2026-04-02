import React, { useState, useEffect, useRef } from "react";
import { fetchCategories } from "../service/api";

interface Category {
  _id: string;
  name: string;
}

interface SearchFilterProps {
  onFilterChange: (search: string, categories: string[]) => void;
}

const SearchFilter: React.FC<SearchFilterProps> = ({ onFilterChange }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [searchTimeout, setSearchTimeout] = useState<ReturnType<
    typeof setTimeout
  > | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const loadCategories = async () => {
    try {
      const data = await fetchCategories();
      setCategories(data);
    } catch (err) {
      console.error("Error loading categories:", err);
    }
  };

  // Fetch categories on component mount
  useEffect(() => {
    const initialize = async () => {
      await loadCategories();
    };
    initialize();
  }, []);

  // Handle click outside dropdown to close it and deselect checkboxes
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setDropdownOpen(false);
      }
    };

    if (dropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }
  }, [dropdownOpen, searchQuery, onFilterChange]);

  // Debounced search - waits 300ms after user stops typing
  // Only calls API if search length >= 3 or is empty
  const handleSearchChange = (value: string) => {
    setSearchQuery(value);

    // Clear existing timeout
    if (searchTimeout) {
      clearTimeout(searchTimeout);
    }

    // Call immediately if search is cleared to show default list
    if (value?.trim().length === 0) {
      onFilterChange("", selectedCategories);
    } 
    // Debounce for 3+ characters
    else if (value.length >= 3) {
      const timeout = setTimeout(() => {
        onFilterChange(value, selectedCategories);
      }, 300);
      setSearchTimeout(timeout);
    }
  };

  const handleCategoryToggle = (categoryId: string) => {
    const newSelectedCategories = selectedCategories.includes(categoryId)
      ? selectedCategories.filter((id) => id !== categoryId)
      : [...selectedCategories, categoryId];

    setSelectedCategories(newSelectedCategories);
    onFilterChange(searchQuery, newSelectedCategories);
  };

  const handleClearSearch = () => {
    setSearchQuery("");
    onFilterChange("", selectedCategories);
  };

  const handleResetAll = () => {
    setSearchQuery("");
    setSelectedCategories([]);
    onFilterChange("", []);
  };

  const getSelectedCategoryNames = () => {
    return categories
      .filter((cat) => selectedCategories.includes(cat._id))
      .map((cat) => cat.name);
  };

  return (
    <div className="flex flex-col gap-3 sm:gap-4" ref={dropdownRef}>
      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 items-center">
        {/* Search Box */}
        <div className="relative flex-1 w-full">
          <input
            type="text"
            placeholder="Search products by name (3+ characters)..."
            value={searchQuery}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all text-sm sm:text-base h-10"
          />
          {searchQuery && (
            <button
              onClick={handleClearSearch}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              title="Clear search"
            >
              ✕
            </button>
          )}
        </div>

        {/* Category Filter */}
        <div className="relative flex-1 w-full">
          <button
            className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg text-gray-900 hover:border-gray-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all flex justify-between items-center text-sm h-10"
            onClick={() => setDropdownOpen(!dropdownOpen)}
          >
            <span>
              {selectedCategories.length === 0
                ? "Select Categories"
                : `${selectedCategories.length} Selected`}
            </span>
            <span className="text-gray-400">{dropdownOpen ? "▲" : "▼"}</span>
          </button>

          {dropdownOpen && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-300 rounded-lg shadow-md max-h-60 overflow-y-auto z-10">
              {categories.length === 0 ? (
                <div className="px-4 py-3 text-gray-500 text-sm">
                  No categories available
                </div>
              ) : (
                <>
                  {categories.map((category) => (
                    <label
                      key={category._id}
                      className="flex items-center gap-3 px-4 py-2.5 hover:bg-gray-100 cursor-pointer transition-colors border-b border-gray-200 last:border-b-0"
                    >
                      <input
                        type="checkbox"
                        checked={selectedCategories.includes(category._id)}
                        onChange={() => handleCategoryToggle(category._id)}
                        className="cursor-pointer"
                      />
                      <span className="text-gray-700 text-sm">
                        {category.name}
                      </span>
                    </label>
                  ))}
                </>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Reset and Selected Categories Display */}
      <div className="flex items-center gap-3">
        {(searchQuery || selectedCategories.length > 0) && (
          <button
            onClick={handleResetAll}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium text-sm transition-colors whitespace-nowrap"
          >
            Reset
          </button>
        )}

        {/* Selected Categories Display */}
        {selectedCategories.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {getSelectedCategoryNames().map((name, index) => (
              <span
                key={index}
                className="inline-block px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs sm:text-sm font-medium"
              >
                {name}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchFilter;
