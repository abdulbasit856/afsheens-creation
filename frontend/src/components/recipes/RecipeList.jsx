import React, { useEffect, useState, useRef } from 'react';
import { useRecipes } from '../../context/RecipeContext';
import RecipeCard from './RecipeCard';
import LoadingSpinner from '../common/LoadingSpinner';

const RecipeList = ({ searchParams, featured = false }) => {
  const { 
    recipes, 
    featuredRecipes, 
    loading, 
    pagination, 
    fetchRecipes 
  } = useRecipes();
  
  const [currentPage, setCurrentPage] = useState(1);
  const hasFetched = useRef(false);
  const prevSearchParams = useRef(searchParams);

  useEffect(() => {
    const paramsChanged = JSON.stringify(prevSearchParams.current) !== JSON.stringify(searchParams);
    
    if (!featured && (!hasFetched.current || paramsChanged)) {
      hasFetched.current = true;
      prevSearchParams.current = searchParams;
      
      fetchRecipes({
        ...searchParams,
        page: currentPage,
        limit: 12,
      });
    }
  }, [fetchRecipes, searchParams, currentPage, featured]);

  const displayRecipes = featured ? featuredRecipes : recipes;

  if (loading) {
    return (
      <div className="flex justify-center py-8 md:py-12">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (displayRecipes.length === 0) {
    return (
      <div className="text-center py-8 md:py-12">
        <p className="text-gray-500 text-base md:text-lg">No recipes found</p>
        <p className="text-gray-400 text-sm mt-1">Try adjusting your search</p>
      </div>
    );
  }

  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
        {displayRecipes.map((recipe) => (
          <RecipeCard key={recipe._id} recipe={recipe} />
        ))}
      </div>

      {!featured && pagination.pages > 1 && (
        <div className="flex justify-center mt-6 md:mt-8 space-x-2">
          <button
            onClick={() => {
              setCurrentPage(prev => Math.max(prev - 1, 1));
              hasFetched.current = false;
            }}
            disabled={currentPage === 1}
            className="px-3 md:px-4 py-1.5 md:py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors text-sm md:text-base"
          >
            Previous
          </button>
          <span className="px-3 md:px-4 py-1.5 md:py-2 text-gray-600 text-sm md:text-base">
            {currentPage} / {pagination.pages}
          </span>
          <button
            onClick={() => {
              setCurrentPage(prev => Math.min(prev + 1, pagination.pages));
              hasFetched.current = false;
            }}
            disabled={currentPage === pagination.pages}
            className="px-3 md:px-4 py-1.5 md:py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors text-sm md:text-base"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default RecipeList;