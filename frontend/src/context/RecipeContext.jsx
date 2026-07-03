import React, { createContext, useState, useContext, useCallback, useRef } from 'react';
import api from '../services/api';
import { toast } from 'react-toastify';

const RecipeContext = createContext();
export const useRecipes = () => useContext(RecipeContext);

export const RecipeProvider = ({ children }) => {
  const [recipes, setRecipes] = useState([]);
  const [featuredRecipes, setFeaturedRecipes] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 12,
    total: 0,
    pages: 0,
  });
  
  // Cache to prevent duplicate requests
  const cache = useRef({});

  const fetchRecipes = useCallback(async (params = {}) => {
    // Create a cache key from params
    const cacheKey = JSON.stringify(params);
    
    // Check if we already have this data cached
    if (cache.current[cacheKey]) {
      const cached = cache.current[cacheKey];
      setRecipes(cached.recipes);
      setPagination(cached.pagination);
      return cached;
    }

    setLoading(true);
    try {
      const response = await api.get('/recipes', { params });
      
      if (response.data && response.data.recipes) {
        // Cache the response
        cache.current[cacheKey] = {
          recipes: response.data.recipes,
          pagination: response.data.pagination,
        };
        
        setRecipes(response.data.recipes);
        setPagination(response.data.pagination);
        return response.data;
      }
      return null;
    } catch (error) {
      console.error('Fetch recipes error:', error);
      if (error.response?.status !== 429) {
        toast.error('Failed to load recipes');
      }
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchFeaturedRecipes = useCallback(async () => {
    // Check cache for featured
    if (cache.current['featured']) {
      setFeaturedRecipes(cache.current['featured']);
      return;
    }

    try {
      const response = await api.get('/recipes/featured');
      if (response.data && response.data.recipes) {
        cache.current['featured'] = response.data.recipes;
        setFeaturedRecipes(response.data.recipes);
      }
    } catch (error) {
      console.error('Fetch featured error:', error);
    }
  }, []);

  const fetchCategories = useCallback(async () => {
    if (cache.current['categories']) {
      setCategories(cache.current['categories']);
      return;
    }

    try {
      const response = await api.get('/recipes/categories');
      if (response.data && response.data.categories) {
        cache.current['categories'] = response.data.categories;
        setCategories(response.data.categories);
      }
    } catch (error) {
      console.error('Fetch categories error:', error);
    }
  }, []);

  const getRecipe = useCallback(async (id) => {
    // Check cache for single recipe
    if (cache.current[`recipe_${id}`]) {
      return cache.current[`recipe_${id}`];
    }

    try {
      const response = await api.get(`/recipes/${id}`);
      if (response.data && response.data.recipe) {
        cache.current[`recipe_${id}`] = response.data.recipe;
        return response.data.recipe;
      }
      return null;
    } catch (error) {
      console.error('Get recipe error:', error);
      toast.error('Failed to load recipe');
      return null;
    }
  }, []);

  const createRecipe = useCallback(async (recipeData) => {
    try {
      const response = await api.post('/recipes', recipeData);
      toast.success('Recipe created successfully!');
      // Clear cache
      cache.current = {};
      return response.data.recipe;
    } catch (error) {
      console.error('Create recipe error:', error);
      toast.error(error.response?.data?.message || 'Failed to create recipe');
      return null;
    }
  }, []);

  const updateRecipe = useCallback(async (id, recipeData) => {
    try {
      const response = await api.put(`/recipes/${id}`, recipeData);
      toast.success('Recipe updated successfully!');
      // Clear cache for this recipe
      delete cache.current[`recipe_${id}`];
      cache.current = {};
      return response.data.recipe;
    } catch (error) {
      console.error('Update recipe error:', error);
      toast.error(error.response?.data?.message || 'Failed to update recipe');
      return null;
    }
  }, []);

  const deleteRecipe = useCallback(async (id) => {
    try {
      await api.delete(`/recipes/${id}`);
      toast.success('Recipe deleted successfully!');
      // Clear cache
      cache.current = {};
      return true;
    } catch (error) {
      console.error('Delete recipe error:', error);
      toast.error(error.response?.data?.message || 'Failed to delete recipe');
      return false;
    }
  }, []);

  const value = {
    recipes,
    featuredRecipes,
    categories,
    loading,
    pagination,
    fetchRecipes,
    fetchFeaturedRecipes,
    fetchCategories,
    getRecipe,
    createRecipe,
    updateRecipe,
    deleteRecipe,
  };

  return (
    <RecipeContext.Provider value={value}>
      {children}
    </RecipeContext.Provider>
  );
};