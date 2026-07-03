import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useRecipes } from '../context/RecipeContext';
import CommentSection from '../components/comments/CommentSection';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { FaClock, FaUser, FaUtensils, FaStar, FaStarHalfAlt, FaRegStar, FaArrowLeft, FaPlay, FaYoutube } from 'react-icons/fa';
import { IoTimeOutline } from 'react-icons/io5';
import { MdPeople } from 'react-icons/md';

const RecipePage = () => {
  const { id } = useParams();
  const { getRecipe } = useRecipes();
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [averageRating, setAverageRating] = useState(0);
  const [ratingCount, setRatingCount] = useState(0);
  const [videoError, setVideoError] = useState(false);

  useEffect(() => {
    const loadRecipe = async () => {
      setLoading(true);
      const data = await getRecipe(id);
      if (data) setRecipe(data);
      setLoading(false);
    };
    loadRecipe();
  }, [id, getRecipe]);

  // Fetch rating for this recipe
  useEffect(() => {
    const fetchRating = async () => {
      if (!id) return;
      try {
        const response = await fetch(`http://localhost:5000/api/comments/recipe/${id}?limit=1`);
        const data = await response.json();
        if (data.success && data.rating) {
          setAverageRating(data.rating.average);
          setRatingCount(data.rating.count);
        }
      } catch (error) {
        console.error('Error fetching rating:', error);
      }
    };
    fetchRating();
  }, [id]);

  // Render stars function
  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    for (let i = 1; i <= 5; i++) {
      if (i <= fullStars) {
        stars.push(<FaStar key={i} className="text-yellow-400 text-sm" />);
      } else if (i === fullStars + 1 && hasHalfStar) {
        stars.push(<FaStarHalfAlt key={i} className="text-yellow-400 text-sm" />);
      } else {
        stars.push(<FaRegStar key={i} className="text-yellow-400 text-sm" />);
      }
    }
    return stars;
  };

  if (loading) return <div className="min-h-[60vh] flex items-center justify-center"><LoadingSpinner size="lg" /></div>;
  if (!recipe) return <div className="min-h-[60vh] flex flex-col items-center justify-center"><h2 className="text-2xl font-playfair text-gray-800">Recipe Not Found</h2><Link to="/" className="btn-primary mt-4"><FaArrowLeft className="inline mr-2" /> Back to Home</Link></div>;

  const videoId = recipe.videoId;

  return (
    <>
      <Helmet>
        <title>{recipe.title} - Afsheen's Creations</title>
        <meta name="description" content={recipe.description} />
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=yes" />
      </Helmet>
      <div className="bg-gray-50 min-h-screen pt-20 pb-8 overflow-x-hidden">
        <div className="container-custom">
          <Link to="/" className="inline-flex items-center text-gray-600 hover:text-primary-600 mt-4 mb-6 transition-colors text-sm md:text-base">
            <FaArrowLeft className="mr-2" /> Back to Recipes
          </Link>
          
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <div className="relative h-[250px] md:h-[400px] lg:h-[500px]">
              <img 
                src={recipe.imageUrl} 
                alt={recipe.title} 
                className="w-full h-full object-cover" 
                onError={(e) => {
                  e.target.src = 'https://via.placeholder.com/800x400/cccccc/666666?text=No+Image';
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-4 md:p-8 text-white">
                <div className="flex flex-wrap gap-2 mb-2 md:mb-3">
                  <span className="bg-primary-500/90 text-white text-xs md:text-sm px-2 md:px-3 py-1 rounded-full">{recipe.category}</span>
                  {recipe.tags?.slice(0, 3).map((tag) => (
                    <span key={tag} className="bg-white/20 text-white text-xs md:text-sm px-2 md:px-3 py-1 rounded-full backdrop-blur-sm">#{tag}</span>
                  ))}
                </div>
                <h1 className="text-2xl md:text-4xl lg:text-5xl font-playfair font-bold">{recipe.title}</h1>
                <p className="mt-1 md:mt-2 text-gray-200 text-sm md:text-lg max-w-2xl line-clamp-2">{recipe.description}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-5 gap-3 md:gap-4 p-4 md:p-6 bg-gray-50 border-b border-gray-100">
              <div className="flex items-center space-x-2">
                <FaClock className="text-primary-500 text-base md:text-xl" />
                <div>
                  <p className="text-[10px] md:text-xs text-gray-500">Prep Time</p>
                  <p className="text-xs md:text-sm font-medium">{recipe.prepTime || 0} mins</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <IoTimeOutline className="text-primary-500 text-base md:text-xl" />
                <div>
                  <p className="text-[10px] md:text-xs text-gray-500">Cook Time</p>
                  <p className="text-xs md:text-sm font-medium">{recipe.cookTime || 0} mins</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <MdPeople className="text-primary-500 text-base md:text-xl" />
                <div>
                  <p className="text-[10px] md:text-xs text-gray-500">Servings</p>
                  <p className="text-xs md:text-sm font-medium">{recipe.servings || 4}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <FaStar className="text-primary-500 text-base md:text-xl" />
                <div>
                  <p className="text-[10px] md:text-xs text-gray-500">Difficulty</p>
                  <p className="text-xs md:text-sm font-medium">{recipe.difficulty || 'Medium'}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <div className="text-primary-500 text-base md:text-xl flex">
                  {renderStars(averageRating)}
                </div>
                <div>
                  <p className="text-[10px] md:text-xs text-gray-500">Rating</p>
                  <p className="text-xs md:text-sm font-medium flex items-center gap-1">
                    {averageRating > 0 ? averageRating.toFixed(1) : 'No'}
                    {ratingCount > 0 && <span className="text-[10px] md:text-xs text-gray-400 font-normal">({ratingCount})</span>}
                    {averageRating === 0 && <span className="text-[10px] md:text-xs text-gray-400 font-normal">reviews</span>}
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8 p-4 md:p-8">
              <div className="lg:col-span-2 space-y-6 md:space-y-8">
                {/* YouTube Video - Mobile Optimized */}
                {videoId ? (
                  <div className="bg-black rounded-xl overflow-hidden aspect-video relative">
                    <iframe
                      src={`https://www.youtube.com/embed/${videoId}?autoplay=0&rel=0&modestbranding=1&playsinline=1&controls=1&showinfo=0&iv_load_policy=3&origin=http://localhost:3000`}
                      title={`${recipe.title} video`}
                      className="w-full h-full"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      allowFullScreen
                      loading="lazy"
                      sandbox="allow-same-origin allow-scripts allow-popups allow-forms allow-presentation"
                      style={{ border: 'none' }}
                    />
                  </div>
                ) : (
                  <div className="bg-gray-100 rounded-xl p-8 text-center">
                    <FaPlay className="text-4xl text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">No video available for this recipe</p>
                  </div>
                )}

                <div>
                  <h2 className="text-xl md:text-2xl font-playfair font-bold text-gray-800 mb-3 md:mb-4 flex items-center">
                    <FaUtensils className="text-primary-500 mr-2" /> Ingredients
                  </h2>
                  <ul className="grid grid-cols-1 md:grid-cols-2 gap-1 md:gap-2">
                    {recipe.ingredients?.map((ingredient, index) => (
                      <li key={index} className="flex items-start space-x-2 p-1.5 md:p-2 rounded-lg hover:bg-gray-50 text-sm md:text-base">
                        <span className="text-primary-500 mt-1">•</span>
                        <span>
                          <span className="font-medium">{ingredient.quantity}</span>
                          {ingredient.unit && <span className="text-gray-600"> {ingredient.unit}</span>}
                          <span className="text-gray-700"> {ingredient.name}</span>
                          {ingredient.note && <span className="text-gray-500 text-xs md:text-sm block ml-4">({ingredient.note})</span>}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h2 className="text-xl md:text-2xl font-playfair font-bold text-gray-800 mb-3 md:mb-4">Instructions</h2>
                  <ol className="space-y-3 md:space-y-4">
                    {recipe.instructions?.map((step, index) => (
                      <li key={index} className="flex space-x-3 md:space-x-4">
                        <span className="flex-shrink-0 w-6 h-6 md:w-8 md:h-8 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center font-semibold text-xs md:text-sm">
                          {index + 1}
                        </span>
                        <p className="text-sm md:text-base text-gray-700 pt-0.5 md:pt-1">{step}</p>
                      </li>
                    ))}
                  </ol>
                </div>
              </div>

              <div className="space-y-4 md:space-y-6">
                <div className="bg-gray-50 rounded-xl p-4 md:p-6">
                  <h3 className="font-semibold text-gray-700 mb-2 md:mb-3 flex items-center text-sm md:text-base">
                    <FaUser className="text-primary-500 mr-2" /> Created By
                  </h3>
                  <p className="text-gray-800 text-sm md:text-base">{recipe.createdBy?.name || 'Admin'}</p>
                </div>
                <div className="bg-gray-50 rounded-xl p-4 md:p-6">
                  <h3 className="font-semibold text-gray-700 mb-2 md:mb-3 text-sm md:text-base">Recipe Info</h3>
                  <div className="space-y-1.5 md:space-y-2 text-xs md:text-sm">
                    <p><span className="text-gray-500">Category:</span> {recipe.category}</p>
                    <p><span className="text-gray-500">Total Time:</span> {recipe.totalTime || 'N/A'} mins</p>
                    <p><span className="text-gray-500">Servings:</span> {recipe.servings || 4}</p>
                    {recipe.tags && recipe.tags.length > 0 && (
                      <p><span className="text-gray-500">Tags:</span> {recipe.tags.join(', ')}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="border-t border-gray-100 p-4 md:p-8">
              <CommentSection recipeId={recipe._id} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default RecipePage;