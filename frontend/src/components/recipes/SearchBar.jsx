import React from 'react';
import SearchDropdown from './SearchDropdown';

const SearchBar = ({ onSearch, categories }) => {
  return (
    <div className="w-full">
      <SearchDropdown onSearch={onSearch} categories={categories} />
    </div>
  );
};

export default SearchBar;