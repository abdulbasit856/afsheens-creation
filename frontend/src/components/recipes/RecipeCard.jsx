import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaClock, FaStar, FaStarHalfAlt, FaRegStar } from 'react-icons/fa';

const RecipeCard = ({ recipe }) => {
  const { _id, title, description, imageUrl, category, prepTime, difficulty } = recipe;
  const [averageRating, setAverageRating] = useState(0);
  const [ratingCount, setRatingCount] = useState(0);

  const difficultyColors = { 
    Easy: 'bg-green-100 text-green-800', 
    Medium: 'bg-yellow-100 text-yellow-800', 
    Hard: 'bg-red-100 text-red-800' 
  };

  // Fetch rating for this recipe
  useEffect(() => {
    const fetchRating = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/comments/recipe/${_id}?limit=1`);
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
  }, [_id]);

  // Render stars based on rating
  const renderStars = () => {
    const stars = [];
    const fullStars = Math.floor(averageRating);
    const hasHalfStar = averageRating % 1 >= 0.5;

    for (let i = 1; i <= 5; i++) {
      if (i <= fullStars) {
        stars.push(<FaStar key={i} className="text-yellow-400 text-xs" />);
      } else if (i === fullStars + 1 && hasHalfStar) {
        stars.push(<FaStarHalfAlt key={i} className="text-yellow-400 text-xs" />);
      } else {
        stars.push(<FaRegStar key={i} className="text-yellow-400 text-xs" />);
      }
    }
    return stars;
  };

  return (
    <Link to={`/recipe/${_id}`} className="block group h-full">
      <div className="card h-full flex flex-col">
        {/* Fixed: Image container with proper aspect ratio */}
        <div className="relative overflow-hidden aspect-[4/3] w-full">
          <img
            src={imageUrl || 'https://via.placeholder.com/400x300/cccccc/666666?text=No+Image'}
            alt={title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            loading="lazy"
            onError={(e) => {
              e.target.src = 'https://via.placeholder.com/400x300/cccccc/666666?text=No+Image';
            }}
          />
          <div className="absolute top-2 right-2">
            <span className={`text-xs px-2 py-1 rounded-full ${difficultyColors[difficulty] || 'bg-gray-100 text-gray-800'}`}>
              {difficulty || 'Medium'}
            </span>
          </div>
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-3">
            <span className="text-white text-xs font-medium bg-primary-500/80 px-2 py-1 rounded">
              {category}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 flex-grow flex flex-col">
          <h3 className="font-playfair font-semibold text-lg text-gray-800 group-hover:text-primary-600 transition-colors line-clamp-1">
            {title}
          </h3>
          <p className="text-gray-600 text-sm mt-1 line-clamp-2 flex-grow">
            {description}
          </p>

          {/* Meta Info - Rating instead of Views */}
          <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
            <div className="flex items-center space-x-3 text-sm text-gray-500">
              <span className="flex items-center">
                <FaClock className="mr-1 text-primary-500" />
                {prepTime || 0}m
              </span>
              <span className="flex items-center space-x-1">
                {renderStars()}
                {ratingCount > 0 && (
                  <span className="text-xs text-gray-500 ml-1">
                    ({ratingCount})
                  </span>
                )}
              </span>
            </div>
            <span className="text-xs text-gray-400">
              {category}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default RecipeCard;