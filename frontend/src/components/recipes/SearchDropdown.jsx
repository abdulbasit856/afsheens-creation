import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { FaSearch, FaTimes } from 'react-icons/fa';
import LoadingSpinner from '../common/LoadingSpinner';

const SearchDropdown = ({ onSearch, categories }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const dropdownRef = useRef(null);
  const inputRef = useRef(null);
  const [isMobile, setIsMobile] = useState(false);

  // Check if mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Fetch suggestions based on search term
  useEffect(() => {
    const fetchSuggestions = async () => {
      if (!searchTerm.trim()) {
        setSuggestions([]);
        setShowDropdown(false);
        return;
      }

      setLoading(true);
      try {
        const API_URL = process.env.REACT_APP_API_URL || 'https://afsheens-creation-production.up.railway.app/api';
        const response = await fetch(`${API_URL}/recipes?search=${encodeURIComponent(searchTerm)}&limit=5`);
        const data = await response.json();
        if (data.success) {
          setSuggestions(data.recipes);
          setShowDropdown(true);
        }
      } catch (error) {
        console.error('Error fetching suggestions:', error);
      } finally {
        setLoading(false);
      }
    };

    const debounceTimer = setTimeout(fetchSuggestions, 300);
    return () => clearTimeout(debounceTimer);
  }, [searchTerm]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
        setSelectedIndex(-1);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, []);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!showDropdown || suggestions.length === 0) return;

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex(prev => (prev + 1) % suggestions.length);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex(prev => (prev - 1 + suggestions.length) % suggestions.length);
      } else if (e.key === 'Enter' && selectedIndex >= 0) {
        e.preventDefault();
        const selected = suggestions[selectedIndex];
        if (selected) {
          window.location.href = `/recipe/${selected._id}`;
        }
      } else if (e.key === 'Escape') {
        setShowDropdown(false);
        setSelectedIndex(-1);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [showDropdown, suggestions, selectedIndex]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      onSearch(searchTerm, '');
      setShowDropdown(false);
      setSelectedIndex(-1);
      // On mobile, blur the input to hide keyboard
      if (inputRef.current) {
        inputRef.current.blur();
      }
    }
  };

  const handleClear = () => {
    setSearchTerm('');
    setSuggestions([]);
    setShowDropdown(false);
    setSelectedIndex(-1);
    onSearch('', '');
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const handleSuggestionClick = (recipe) => {
    window.location.href = `/recipe/${recipe._id}`;
  };

  // Touch handler for mobile
  const handleTouchStart = (e) => {
    // Keep dropdown open on touch
    if (searchTerm.trim() && suggestions.length > 0) {
      setShowDropdown(true);
    }
  };

  return (
    <div className="w-full relative" ref={dropdownRef}>
      <form onSubmit={handleSearch} className="relative">
        <div className="relative">
          <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Search recipes by name, ingredients..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onFocus={() => {
              if (searchTerm.trim() && suggestions.length > 0) {
                setShowDropdown(true);
              }
            }}
            onTouchStart={handleTouchStart}
            className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 text-base"
            autoComplete="off"
          />
          {searchTerm && (
            <button
              type="button"
              onClick={handleClear}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
              aria-label="Clear search"
            >
              <FaTimes />
            </button>
          )}
        </div>
        <button type="submit" className="hidden">Search</button>
      </form>

      {/* Dropdown Suggestions - Mobile friendly */}
      {showDropdown && (
        <div className={`absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-80 overflow-auto ${isMobile ? 'w-full' : ''}`}>
          {loading ? (
            <div className="flex justify-center items-center p-4">
              <LoadingSpinner size="sm" />
            </div>
          ) : suggestions.length === 0 ? (
            <div className="p-4 text-center text-gray-500">
              No recipes found for "{searchTerm}"
            </div>
          ) : (
            <div>
              {suggestions.map((recipe, index) => (
                <div
                  key={recipe._id}
                  onClick={() => handleSuggestionClick(recipe)}
                  onTouchEnd={() => handleSuggestionClick(recipe)}
                  className={`flex items-center gap-3 p-3 hover:bg-gray-50 active:bg-gray-100 cursor-pointer transition-colors ${
                    index === selectedIndex ? 'bg-gray-100' : ''
                  } ${index !== suggestions.length - 1 ? 'border-b border-gray-100' : ''}`}
                >
                  <img
                    src={recipe.imageUrl || 'https://via.placeholder.com/50x50/cccccc/666666?text=No+Image'}
                    alt={recipe.title}
                    className="w-12 h-12 object-cover rounded-lg flex-shrink-0"
                    onError={(e) => {
                      e.target.src = 'https://via.placeholder.com/50x50/cccccc/666666?text=No+Image';
                    }}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-800 truncate">{recipe.title}</p>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <span>{recipe.category}</span>
                      {recipe.prepTime && (
                        <>
                          <span>•</span>
                          <span>{recipe.prepTime} mins</span>
                        </>
                      )}
                    </div>
                  </div>
                  <FaSearch className="text-gray-400 flex-shrink-0" />
                </div>
              ))}
              <div className="p-2 text-center border-t border-gray-100">
                <button
                  onClick={handleSearch}
                  className="text-sm text-primary-600 hover:text-primary-700 font-medium w-full py-2"
                >
                  See all results for "{searchTerm}"
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchDropdown;