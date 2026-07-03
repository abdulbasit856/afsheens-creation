import React, { useRef } from 'react';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

const CategoryFilter = ({ categories, selectedCategory, onCategorySelect }) => {
  const scrollContainer = useRef(null);
  const allCategories = [{ _id: '', count: categories?.reduce((acc, cat) => acc + cat.count, 0) || 0 }, ...(categories || [])];

  const scroll = (direction) => {
    if (scrollContainer.current) {
      scrollContainer.current.scrollLeft += direction === 'left' ? -200 : 200;
    }
  };

  return (
    <div className="relative mb-6">
      <div className="flex items-center">
        <button onClick={() => scroll('left')} className="absolute left-0 z-10 bg-white/80 backdrop-blur-sm p-2 rounded-full shadow-md hover:bg-white -translate-x-1/2"><FaChevronLeft className="text-gray-600" /></button>
        <div ref={scrollContainer} className="flex space-x-2 overflow-x-auto px-6 py-3 scrollbar-hide" style={{ scrollbarWidth: 'none' }}>
          {allCategories.map((category) => (
            <button key={category._id || 'all'} onClick={() => onCategorySelect(category._id)} className={`px-4 py-2 rounded-full whitespace-nowrap transition-all duration-200 ${selectedCategory === category._id ? 'bg-primary-600 text-white shadow-lg shadow-primary-500/30' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>
              {category._id || 'All'} <span className="ml-1 text-xs opacity-70">({category.count || 0})</span>
            </button>
          ))}
        </div>
        <button onClick={() => scroll('right')} className="absolute right-0 z-10 bg-white/80 backdrop-blur-sm p-2 rounded-full shadow-md hover:bg-white translate-x-1/2"><FaChevronRight className="text-gray-600" /></button>
      </div>
    </div>
  );
};

export default CategoryFilter;