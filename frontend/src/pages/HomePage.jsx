import React, { useEffect, useRef } from 'react';
import { Helmet } from 'react-helmet-async';
import { useRecipes } from '../context/RecipeContext';
import RecipeList from '../components/recipes/RecipeList';
import SearchBar from '../components/recipes/SearchBar';
import RecipeCard from '../components/recipes/RecipeCard';
import { FaUtensils, FaClock, FaStar } from 'react-icons/fa';

const HomePage = () => {
  const { 
    featuredRecipes, 
    fetchFeaturedRecipes, 
    categories,
    fetchCategories,
  } = useRecipes();
  
  const [searchParams, setSearchParams] = React.useState({
    search: '',
    category: '',
  });
  
  const fetchedFeatured = useRef(false);
  const fetchedCategories = useRef(false);

  useEffect(() => {
    if (!fetchedFeatured.current) {
      fetchedFeatured.current = true;
      fetchFeaturedRecipes();
    }
  }, []);

  useEffect(() => {
    if (!fetchedCategories.current) {
      fetchedCategories.current = true;
      fetchCategories();
    }
  }, []);

  const handleSearch = (search, category) => {
    setSearchParams({ search, category });
  };

  return (
    <>
      <Helmet>
        <title>Afsheen's Creations - Delicious Recipes from Around the World</title>
        <meta name="description" content="Discover amazing recipes from Pakistani, Arabic, Indian cuisines and more." />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Helmet>

      {/* Hero Section */}
      <section className="relative min-h-[60vh] md:min-h-[70vh] flex items-center bg-gradient-to-br from-primary-50 via-pink-50 to-white overflow-hidden">
        <div className="container-custom relative z-10 py-12 md:py-20">
          <div className="max-w-3xl animate-fade-in">
            <h1 className="text-3xl md:text-4xl lg:text-6xl font-playfair font-bold text-gray-900 leading-tight">
              Welcome to <span className="text-primary-600">Afsheen's</span> Creations
            </h1>
            <p className="mt-3 md:mt-4 text-base md:text-lg lg:text-xl text-gray-600 leading-relaxed">
              Explore our collection of mouth-watering recipes from around the world.
            </p>
            <div className="mt-6 md:mt-8 flex flex-wrap gap-3 md:gap-4">
              <div className="flex items-center space-x-2 bg-white rounded-full px-3 py-1.5 md:px-4 md:py-2 shadow-sm">
                <FaUtensils className="text-primary-500 text-sm md:text-base" />
                <span className="text-xs md:text-sm font-medium">100+ Recipes</span>
              </div>
              <div className="flex items-center space-x-2 bg-white rounded-full px-3 py-1.5 md:px-4 md:py-2 shadow-sm">
                <FaClock className="text-primary-500 text-sm md:text-base" />
                <span className="text-xs md:text-sm font-medium">Easy to Follow</span>
              </div>
              <div className="flex items-center space-x-2 bg-white rounded-full px-3 py-1.5 md:px-4 md:py-2 shadow-sm">
                <FaStar className="text-primary-500 text-sm md:text-base" />
                <span className="text-xs md:text-sm font-medium">Video Tutorials</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Search Section */}
      <section className="py-4 md:py-8 bg-white border-b border-gray-100 sticky top-16 z-40">
        <div className="container-custom">
          <SearchBar onSearch={handleSearch} categories={categories} />
        </div>
      </section>

      {/* Featured Recipes */}
      {featuredRecipes.length > 0 && (
        <section className="py-8 md:py-12 bg-gray-50">
          <div className="container-custom">
            <div className="flex items-center justify-between mb-4 md:mb-8">
              <div>
                <h2 className="text-2xl md:text-3xl font-playfair font-bold text-gray-900">
                  Featured Recipes
                </h2>
                <p className="text-sm md:text-base text-gray-600 mt-1">Hand-picked favorites from our collection</p>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              {featuredRecipes.map((recipe) => (
                <RecipeCard key={recipe._id} recipe={recipe} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* All Recipes */}
      <section className="py-8 md:py-12">
        <div className="container-custom">
          <div className="flex items-center justify-between mb-4 md:mb-8">
            <div>
              <h2 className="text-2xl md:text-3xl font-playfair font-bold text-gray-900">
                All Recipes
              </h2>
              <p className="text-sm md:text-base text-gray-600 mt-1">Explore our complete recipe collection</p>
            </div>
          </div>

          <RecipeList 
            searchParams={searchParams}
            featured={false}
          />
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 md:py-16 bg-primary-600">
        <div className="container-custom text-center">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-playfair font-bold text-white">
            Ready to Cook Something Amazing?
          </h2>
          <p className="mt-3 md:mt-4 text-primary-100 text-base md:text-lg max-w-2xl mx-auto px-4">
            Browse our recipes, watch video tutorials, and start creating delicious meals today!
          </p>
          <button className="mt-6 md:mt-8 bg-white text-primary-600 hover:bg-primary-50 font-semibold py-2.5 md:py-3 px-6 md:px-8 rounded-full transition-all duration-300 hover:scale-105 text-sm md:text-base">
            Explore Recipes
          </button>
        </div>
      </section>
    </>
  );
};

export default HomePage;