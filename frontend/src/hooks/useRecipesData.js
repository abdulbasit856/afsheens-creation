import { useEffect, useState, useRef } from 'react';
import { useRecipes } from '../context/RecipeContext';

export const useRecipesData = (searchParams, featured = false) => {
  const { 
    recipes, 
    featuredRecipes, 
    loading, 
    pagination, 
    fetchRecipes 
  } = useRecipes();
  
  const [currentPage, setCurrentPage] = useState(1);
  const initialFetchDone = useRef(false);
  const prevParamsRef = useRef(searchParams);

  useEffect(() => {
    if (featured) return;

    const paramsChanged = JSON.stringify(prevParamsRef.current) !== JSON.stringify(searchParams);
    
    if (!initialFetchDone.current || paramsChanged) {
      initialFetchDone.current = true;
      prevParamsRef.current = searchParams;
      
      fetchRecipes({
        ...searchParams,
        page: currentPage,
        limit: 12,
      });
    }
  }, [fetchRecipes, searchParams, currentPage, featured]);

  return {
    recipes: featured ? featuredRecipes : recipes,
    loading,
    pagination,
    currentPage,
    setCurrentPage,
    hasData: (featured ? featuredRecipes : recipes).length > 0,
  };
};